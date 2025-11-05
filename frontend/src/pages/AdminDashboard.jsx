import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Package, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import StatsCard from '../components/dashboard/StatsCard';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { adminAPI } from '../api/admin';
import { formatDate } from '../utils/helpers';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, collection-points, pending

  useEffect(() => {
    fetchAnalytics();

    // Refresh analytics when user comes back to the page
    const handleFocus = () => {
      console.log('🔄 Admin dashboard focused, refreshing data...');
      fetchAnalytics();
    };

    window.addEventListener('focus', handleFocus);
    
    // Also listen for visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, refreshing data...');
        fetchAnalytics();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching admin analytics...');
      const data = await adminAPI.getAnalytics();
      console.log('📊 Analytics data received:', data);
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">Unable to fetch analytics data</p>
          <Button onClick={fetchAnalytics} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { overview, cityStats, monthlyStats, recentPickups } = analytics || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and monitor the MediReturn platform
            </p>
          </div>
          <Button 
            onClick={fetchAnalytics} 
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            title="Total Citizens"
            value={overview?.totalCitizens || 0}
            subtitle="Registered users"
            color="blue"
          />
          <StatsCard
            icon={MapPin}
            title="Collection Points"
            value={overview?.totalCollectionPoints || 0}
            subtitle={`${overview?.verifiedCollectionPoints || 0} verified`}
            color="green"
          />
          <StatsCard
            icon={Package}
            title="Total Pickups"
            value={overview?.totalPickups || 0}
            subtitle={`${overview?.completedPickups || 0} completed`}
            color="purple"
          />
          <StatsCard
            icon={TrendingUp}
            title="Medicines Collected"
            value={`${overview?.totalKgCollected || 0}kg`}
            subtitle="Total weight"
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${activeTab === tab.id ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Cities */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Top Cities by Collection
              </h2>
              {cityStats && cityStats.length > 0 ? (
                <div className="space-y-3">
                  {cityStats.map((city, index) => (
                    <div key={city._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{city._id}</p>
                          <p className="text-sm text-gray-600">{city.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{city.totalCollected}kg</p>
                        <p className="text-sm text-gray-600">{city.totalPoints} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No data available</p>
              )}
            </Card>

            {/* Recent Completed Pickups */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Completed Pickups
              </h2>
              {recentPickups && recentPickups.length > 0 ? (
                <div className="space-y-3">
                  {recentPickups.slice(0, 5).map((pickup) => (
                    <div key={pickup._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{pickup.userId?.name}</p>
                        <p className="text-sm text-gray-600">{pickup.collectionPointId?.name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="success">Completed</Badge>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(pickup.completedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent pickups</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
