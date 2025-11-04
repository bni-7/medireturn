import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StatsCard from '../components/dashboard/StatsCard';
import Leaderboard from '../components/dashboard/Leaderboard';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { usersAPI } from '../api/users';
import { pickupsAPI } from '../api/pickups';
import { collectionPointsAPI } from '../api/collectionPoints';
import { formatDate, getStatusColor } from '../utils/helpers';
import { ROLES, PICKUP_STATUS } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

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
              value={`${dashboardData?.stats?.totalCollected || 0}kg`}
              subtitle="Medicines disposed safely"
              color="green"
            />
            <StatsCard
              icon={Calendar}
              title="Total Pickups"
              value={dashboardData?.stats?.totalPickups || 0}
              subtitle="Scheduled collections"
              color="blue"
            />
            <StatsCard
              icon={Award}
              title="Points Earned"
              value={dashboardData?.stats?.points || 0}
              subtitle="Reward points"
              color="yellow"
            />
            <StatsCard
              icon={TrendingUp}
              title="City Rank"
              value={`#${dashboardData?.stats?.cityRank || '-'}`}
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
                        onClick={() => navigate(`/pickups/${pickup._id}`)}
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
                        <Badge variant={pickup.status === 'completed' ? 'success' : 'warning'}>
                          {pickup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Badges */}
              <Card className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Badges
                </h2>
                {dashboardData?.badges?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Start collecting to earn badges!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboardData?.badges?.map((badge, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl"
                      >
                        <span className="text-4xl mb-2">{badge.icon}</span>
                        <p className="text-sm font-medium text-gray-900 text-center">
                          {badge.name}
                        </p>
                        <p className="text-xs text-gray-600 text-center mt-1">
                          {badge.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Leaderboard & Referral */}
            <div className="space-y-6">
              <Leaderboard
                leaderboard={dashboardData?.leaderboard || []}
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
              value={`${dashboardData?.stats?.totalCollected || 0}kg`}
              subtitle="Medicines collected"
              color="green"
            />
            <StatsCard
              icon={Clock}
              title="Pending Requests"
              value={dashboardData?.stats?.pendingPickups || 0}
              subtitle="Awaiting response"
              color="yellow"
            />
            <StatsCard
              icon={CheckCircle}
              title="Completed"
              value={dashboardData?.stats?.completedPickups || 0}
              subtitle="Total pickups"
              color="blue"
            />
            <StatsCard
              icon={TrendingUp}
              title="This Month"
              value={`${dashboardData?.stats?.thisMonth || 0}kg`}
              subtitle="Monthly collection"
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