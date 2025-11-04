import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { collectionPointAPI } from '../api/collectionPoints';
import { toast } from 'react-hot-toast';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CollectionPoints = () => {
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchCollectionPoints();
  }, []);

  const fetchCollectionPoints = async () => {
    try {
      setLoading(true);
      const response = await collectionPointAPI.getAll();
      if (response.success) {
        setCollectionPoints(response.collectionPoints || []);
      }
    } catch (error) {
      console.error('Error fetching collection points:', error);
      toast.error('Failed to load collection points');
    } finally {
      setLoading(false);
    }
  };

  const filteredPoints = collectionPoints.filter(point => {
    const matchesSearch = 
      point.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address?.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || point.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collection points...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Collection Points
        </h1>
        <p className="text-gray-600">
          Locate the nearest medicine collection point in your area
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by name or location
            </label>
            <input
              type="text"
              placeholder="Search collection points..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="government">Government Center</option>
              <option value="ngo">NGO</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🗺️ Map View
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Found <span className="font-semibold text-gray-900">{filteredPoints.length}</span> collection points
        </p>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => (
              <div
                key={point._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {point.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      point.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {point.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="text-lg mr-2">🏥</span>
                      <span className="capitalize">{point.type || 'N/A'}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="text-lg mr-2">📍</span>
                      <span>
                        {point.address?.street}, {point.address?.city}, {point.address?.state} - {point.address?.pincode}
                      </span>
                    </div>

                    {point.contactPhone && (
                      <div className="flex items-start">
                        <span className="text-lg mr-2">📞</span>
                        <a href={`tel:${point.contactPhone}`} className="text-green-600 hover:underline">
                          {point.contactPhone}
                        </a>
                      </div>
                    )}

                    {point.contactEmail && (
                      <div className="flex items-start">
                        <span className="text-lg mr-2">✉️</span>
                        <a href={`mailto:${point.contactEmail}`} className="text-green-600 hover:underline">
                          {point.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>

                  {point.operatingHours && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Operating Hours:</p>
                      <p className="text-sm text-gray-600">{point.operatingHours}</p>
                    </div>
                  )}

                  <button
                    onClick={() => window.open(
                      `https://www.google.com/maps/search/?api=1&query=${point.location?.coordinates[1]},${point.location?.coordinates[0]}`,
                      '_blank'
                    )}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No collection points found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={5}
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPoints.map((point) => {
              if (point.location?.coordinates?.length === 2) {
                return (
                  <Marker
                    key={point._id}
                    position={[point.location.coordinates[1], point.location.coordinates[0]]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">{point.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {point.address?.street}, {point.address?.city}
                        </p>
                        {point.contactPhone && (
                          <p className="text-sm mt-2">📞 {point.contactPhone}</p>
                        )}
                        <button
                          onClick={() => window.open(
                            `https://www.google.com/maps/search/?api=1&query=${point.location.coordinates[1]},${point.location.coordinates[0]}`,
                            '_blank'
                          )}
                          className="mt-2 text-green-600 hover:underline text-sm font-medium"
                        >
                          Get Directions →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default CollectionPoints;