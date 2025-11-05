import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  MapPin,
  Phone,
  User,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import StatsCard from '../components/dashboard/StatsCard';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Textarea from '../components/common/Textarea';
import { pickupsAPI } from '../api/pickups';
import { formatDate } from '../utils/helpers';

const CollectionPointDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0
  });
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const data = await pickupsAPI.getCollectionPointPickups();
      setPickups(data.pickups || []);
      
      // Calculate stats
      const pending = data.pickups.filter(p => p.status === 'pending').length;
      const accepted = data.pickups.filter(p => p.status === 'accepted').length;
      const completed = data.pickups.filter(p => p.status === 'completed').length;
      const rejected = data.pickups.filter(p => p.status === 'rejected').length;
      
      setStats({ pending, accepted, completed, rejected });
    } catch (error) {
      console.error('Error fetching pickups:', error);
      toast.error('Failed to load pickups');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (pickupId) => {
    try {
      setActionLoading(true);
      await pickupsAPI.acceptPickup(pickupId);
      toast.success('Pickup request accepted!');
      await fetchPickups(); // Wait for pickups to refresh
      
      // Switch to accepted tab after accepting
      setActiveTab('accepted');
      toast.info('Switched to Accepted tab - you can now mark it complete', { duration: 4000 });
    } catch (error) {
      console.error('Error accepting pickup:', error);
      toast.error(error.response?.data?.message || 'Failed to accept pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (pickup) => {
    setSelectedPickup(pickup);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await pickupsAPI.rejectPickup(selectedPickup._id, rejectionReason);
      toast.success('Pickup request rejected');
      setShowRejectModal(false);
      setSelectedPickup(null);
      setRejectionReason('');
      fetchPickups();
    } catch (error) {
      console.error('Error rejecting pickup:', error);
      toast.error(error.response?.data?.message || 'Failed to reject pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (pickupId) => {
    // Find the pickup to check its status
    const pickup = pickups.find(p => p._id === pickupId);
    
    if (!pickup) {
      toast.error('Pickup not found');
      return;
    }
    
    if (pickup.status !== 'accepted') {
      if (pickup.status === 'pending') {
        toast.error('Please accept this pickup first from the Pending tab', { duration: 5000 });
        setActiveTab('pending');
      } else {
        toast.error(`Cannot complete pickup with status: ${pickup.status}`);
      }
      return;
    }
    
    const quantity = prompt('Enter quantity collected (in kg):');
    if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      setActionLoading(true);
      const response = await pickupsAPI.completePickup(pickupId, { quantityCollected: parseFloat(quantity) });
      toast.success('Pickup marked as completed!');
      if (response.pointsEarned) {
        toast.success(`${response.pointsEarned} points awarded to citizen!`, { duration: 4000 });
      }
      await fetchPickups(); // Wait for refresh
      
      // Switch to completed tab
      setActiveTab('completed');
    } catch (error) {
      console.error('Error completing pickup:', error);
      const errorMsg = error.response?.data?.message || 'Failed to complete pickup';
      toast.error(errorMsg);
      
      // Show helpful message if status is wrong
      if (errorMsg.includes('accepted before completion')) {
        toast.error('Please accept the pickup first from the Pending tab', { duration: 5000 });
        setActiveTab('pending');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      accepted: { variant: 'info', label: 'Accepted' },
      completed: { variant: 'success', label: 'Completed' },
      rejected: { variant: 'danger', label: 'Rejected' },
      cancelled: { variant: 'default', label: 'Cancelled' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const filterPickups = () => {
    return pickups.filter(pickup => pickup.status === activeTab);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collection Point Dashboard
          </h1>
          <p className="text-gray-600">
            Manage pickup requests from citizens
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Clock}
            title="Pending Requests"
            value={stats.pending}
            subtitle="Awaiting response"
            color="yellow"
          />
          <StatsCard
            icon={CheckCircle}
            title="Accepted"
            value={stats.accepted}
            subtitle="Ready for pickup"
            color="blue"
          />
          <StatsCard
            icon={Package}
            title="Completed"
            value={stats.completed}
            subtitle="Successfully collected"
            color="green"
          />
          <StatsCard
            icon={XCircle}
            title="Rejected"
            value={stats.rejected}
            subtitle="Declined requests"
            color="red"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'accepted', label: 'Accepted', count: stats.accepted },
              { id: 'completed', label: 'Completed', count: stats.completed },
              { id: 'rejected', label: 'Rejected', count: stats.rejected }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-medium bg-gray-100">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Pickups List */}
        <div className="space-y-4">
          {filterPickups().length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} pickups
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'pending' 
                    ? 'New pickup requests will appear here'
                    : `No ${activeTab} pickups at the moment`
                  }
                </p>
              </div>
            </Card>
          ) : (
            filterPickups().map((pickup) => (
              <Card key={pickup._id}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant={getStatusBadge(pickup.status).variant}>
                        {getStatusBadge(pickup.status).label}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(pickup.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User size={18} />
                        <span className="font-medium">{pickup.userId?.name || 'Unknown User'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={18} />
                        <span>{pickup.userId?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={18} />
                        <span>
                          {pickup.address?.street || 'N/A'}, {pickup.address?.city || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} />
                        <span>{formatDate(pickup.preferredDate)} - {pickup.timeSlot || 'N/A'}</span>
                      </div>
                      {pickup.notes && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {pickup.notes}
                          </p>
                        </div>
                      )}
                      {pickup.rejectionReason && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Rejection Reason:</strong> {pickup.rejectionReason}
                          </p>
                        </div>
                      )}
                      {pickup.quantityCollected && pickup.quantityCollected > 0 && (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <TrendingUp size={18} />
                          <span>{pickup.quantityCollected}kg collected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex md:flex-col gap-2">
                    {pickup.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleAccept(pickup._id)}
                          variant="success"
                          size="small"
                          loading={actionLoading}
                          className="flex-1 md:flex-none"
                        >
                          <CheckCircle size={18} className="mr-1" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRejectClick(pickup)}
                          variant="danger"
                          size="small"
                          loading={actionLoading}
                          className="flex-1 md:flex-none"
                        >
                          <XCircle size={18} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {pickup.status === 'accepted' && (
                      <Button
                        onClick={() => handleComplete(pickup._id)}
                        variant="primary"
                        size="small"
                        loading={actionLoading}
                      >
                        <Package size={18} className="mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => !actionLoading && setShowRejectModal(false)}
        title="Reject Pickup Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please provide a reason for rejecting this pickup request:
          </p>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="E.g., Not available on selected date, Area not serviceable, etc."
            rows={4}
            required
          />
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setShowRejectModal(false)}
              variant="outline"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              variant="danger"
              loading={actionLoading}
            >
              Reject Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionPointDashboard;
