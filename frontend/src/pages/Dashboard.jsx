import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Package, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle 
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import Leaderboard from '../components/dashboard/Leaderboard';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { usersAPI } from '../api/users';
import { pickupsAPI } from '../api/pickups';
import { collectionPointsAPI } from '../api/collectionPoints';
import { formatDate, getStatusColor } from '../utils/helpers';
import { ROLES, PICKUP_STATUS } from '../utils/constants';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showPickupModal, setShowPickupModal] = useState(false);

  useEffect(() => {
    if (!user) return; // Guard against no user
    
    fetchDashboardData();

    // Refresh dashboard when user comes back to the page
    const handleFocus = () => {
      console.log('🔄 Dashboard page focused, refreshing data...');
      fetchDashboardData();
    };

    window.addEventListener('focus', handleFocus);
    
    // Also listen for visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, refreshing data...');
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user.role === ROLES.CITIZEN) {
        const [dashboard, pickups] = await Promise.all([
          usersAPI.getDashboard(),
          pickupsAPI.getMy()
        ]);
        setDashboardData(dashboard);
        setRecentPickups(pickups.pickups.slice(0, 5));
        
        // Update user context with latest data only if values changed
        if (dashboard.dashboard) {
          const newPoints = dashboard.dashboard.points;
          const newTotalCollected = dashboard.dashboard.totalCollected;
          
          // Check if any value has changed
          const hasChanges = 
            user.points !== newPoints || 
            user.totalCollected !== newTotalCollected;
          
          // Only update if values have actually changed
          if (hasChanges) {
            const updatedUser = {
              ...user,
              points: newPoints,
              totalCollected: newTotalCollected
            };
            // Update both localStorage and context
            updateUser(updatedUser);
          }
        }
      } else if (user.role === ROLES.COLLECTION_POINT) {
        const [dashboard, pickups] = await Promise.all([
          collectionPointsAPI.getDashboard(),
          pickupsAPI.getCollectionPointPickups()
        ]);
        setDashboardData(dashboard);
        setRecentPickups(pickups.pickups.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PICKUP_STATUS.PENDING:
        return <Clock size={20} className="text-yellow-600" />;
      case PICKUP_STATUS.ACCEPTED:
        return <AlertCircle size={20} className="text-blue-600" />;
      case PICKUP_STATUS.COMPLETED:
        return <CheckCircle size={20} className="text-green-600" />;
      case PICKUP_STATUS.REJECTED:
      case PICKUP_STATUS.CANCELLED:
        return <XCircle size={20} className="text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading dashboard..." />
      </div>
    );
  }

  // Citizen Dashboard
  if (user.role === ROLES.CITIZEN) {
    return (
      <div className="min-h-screen bg-gray-50">
        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600">
              Track your impact and manage your medicine collections
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Package}
              title="Total Collected"
              value={`${dashboardData?.dashboard?.totalCollected || 0}kg`}
              subtitle="Medicines disposed safely"
              color="green"
            />
            <StatsCard
              icon={Calendar}
              title="Total Pickups"
              value={dashboardData?.dashboard?.totalPickups || 0}
              subtitle="Scheduled collections"
              color="blue"
            />
            <StatsCard
              icon={Award}
              title="Points Earned"
              value={dashboardData?.dashboard?.points || 0}
              subtitle="Reward points"
              color="yellow"
            />
            <StatsCard
              icon={TrendingUp}
              title="City Rank"
              value={`#${dashboardData?.dashboard?.userRank || '-'}`}
              subtitle="In your city"
              color="purple"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Pickups */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Pickups
                  </h2>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate('/schedule-pickup')}
                  >
                    Schedule New
                  </Button>
                </div>

                {recentPickups.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No pickups yet"
                    description="Schedule your first pickup to start earning rewards"
                    action={() => navigate('/schedule-pickup')}
                    actionLabel="Schedule Pickup"
                  />
                ) : (
                  <div className="space-y-4">
                    {recentPickups.map((pickup) => (
                      <div
                        key={pickup._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedPickup(pickup);
                          setShowPickupModal(true);
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div>
                            {getStatusIcon(pickup.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {pickup.collectionPointId?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(pickup.preferredDate)} • {pickup.timeSlot}
                            </p>
                          </div>
                        </div>
                        <Badge variant={pickup.status === 'completed' ? 'success' : pickup.status === 'pending' ? 'warning' : pickup.status === 'rejected' || pickup.status === 'cancelled' ? 'danger' : 'default'}>
                          {pickup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Leaderboard & Referral */}
            <div className="space-y-6">
              <Leaderboard
                leaderboard={dashboardData?.dashboard?.leaderboard || []}
                currentUserId={user._id}
              />

              {/* Referral Card */}
              <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Invite Friends
                </h3>
                <p className="text-sm text-primary-100 mb-4">
                  Share your referral code and earn 50 bonus points when they complete their first collection!
                </p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                  <p className="text-xs text-primary-100 mb-1">Your Referral Code</p>
                  <p className="text-xl font-bold tracking-wider">
                    {user.referralCode}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="small"
                  fullWidth
                  onClick={() => {
                    navigator.clipboard.writeText(user.referralCode);
                    alert('Referral code copied!');
                  }}
                >
                  Copy Code
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Pickup Details Modal */}
        {showPickupModal && selectedPickup && (
          <Modal
            isOpen={showPickupModal}
            onClose={() => {
              setShowPickupModal(false);
              setSelectedPickup(null);
            }}
            title="Pickup Details"
          >
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <Badge 
                    variant={
                      selectedPickup.status === 'completed' ? 'success' : 
                      selectedPickup.status === 'pending' ? 'warning' : 
                      selectedPickup.status === 'rejected' || selectedPickup.status === 'cancelled' ? 'danger' : 
                      'default'
                    }
                    className="text-lg px-4 py-2"
                  >
                    {selectedPickup.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Collection Point */}
              <div>
                <label className="text-sm font-medium text-gray-700">Collection Point</label>
                <p className="mt-1 text-gray-900">{selectedPickup.collectionPointId?.name || 'N/A'}</p>
                {selectedPickup.collectionPointId?.address && (
                  <p className="text-sm text-gray-600">
                    {selectedPickup.collectionPointId.address.street}, {selectedPickup.collectionPointId.address.city}
                  </p>
                )}
              </div>

              {/* Pickup Date & Time */}
              <div>
                <label className="text-sm font-medium text-gray-700">Scheduled Date & Time</label>
                <p className="mt-1 text-gray-900">
                  {formatDate(selectedPickup.preferredDate)} • {selectedPickup.timeSlot}
                </p>
              </div>

              {/* Address */}
              {selectedPickup.address && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Pickup Address</label>
                  <p className="mt-1 text-gray-900">
                    {selectedPickup.address.street}, {selectedPickup.address.city}, {selectedPickup.address.state} - {selectedPickup.address.pincode}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedPickup.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Details</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedPickup.notes}</p>
                </div>
              )}

              {/* Created Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">Requested On</label>
                <p className="mt-1 text-gray-900">{formatDate(selectedPickup.createdAt)}</p>
              </div>

              {/* Action Button */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPickupModal(false);
                    setSelectedPickup(null);
                  }}
                >
                  Close
                </Button>
                {selectedPickup.status === 'pending' && (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      try {
                        await pickupsAPI.cancel(selectedPickup._id);
                        setShowPickupModal(false);
                        setSelectedPickup(null);
                        fetchDashboardData(); // Refresh data
                        toast.success('Pickup cancelled successfully');
                      } catch (error) {
                        toast.error('Failed to cancel pickup');
                      }
                    }}
                  >
                    Cancel Pickup
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}
       
      </div>
    );
  }

  // Collection Point Dashboard
  if (user.role === ROLES.COLLECTION_POINT) {
    return (
      <div className="min-h-screen bg-gray-50">
    

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Collection Point Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your pickup requests and track collections
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Package}
              title="Total Collected"
              value={`${dashboardData?.dashboard?.stats?.totalCollected || 0}kg`}
              subtitle="Medicines collected"
              color="green"
            />
            <StatsCard
              icon={Clock}
              title="Pending Requests"
              value={dashboardData?.dashboard?.stats?.pendingCount || 0}
              subtitle="Awaiting response"
              color="yellow"
            />
            <StatsCard
              icon={CheckCircle}
              title="Completed"
              value={dashboardData?.dashboard?.stats?.completedPickups || 0}
              subtitle="Total pickups"
              color="blue"
            />
            <StatsCard
              icon={TrendingUp}
              title="Accepted Pickups"
              value={`${dashboardData?.dashboard?.stats?.acceptedCount || 0}`}
              subtitle="In progress"
              color="purple"
            />
          </div>

          {/* Recent Pickup Requests */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Pickup Requests
            </h2>

            {recentPickups.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No pickup requests"
                description="Pickup requests will appear here"
              />
            ) : (
              <div className="space-y-4">
                {recentPickups.map((pickup) => (
                  <div
                    key={pickup._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        {getStatusIcon(pickup.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {pickup.userId?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pickup.address.street}, {pickup.address.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(pickup.preferredDate)} • {pickup.timeSlot}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={pickup.status === 'completed' ? 'success' : 'warning'}>
                        {pickup.status}
                      </Badge>
                      {pickup.status === PICKUP_STATUS.PENDING && (
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            size="small"
                            onClick={async () => {
                              try {
                                await pickupsAPI.accept(pickup._id);
                                fetchDashboardData();
                              } catch (error) {
                                console.error('Error accepting pickup:', error);
                              }
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={async () => {
                              const reason = prompt('Enter rejection reason:');
                              if (reason) {
                                try {
                                  await pickupsAPI.reject(pickup._id, reason);
                                  fetchDashboardData();
                                } catch (error) {
                                  console.error('Error rejecting pickup:', error);
                                }
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;