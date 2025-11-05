import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { collectionPointsAPI } from '../api/collectionPoints';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance, isOpenNow, getTypeColor } from '../utils/helpers';
import { MAP_CENTER } from '../utils/constants';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [filteredPoints, setFilteredPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { location, error: locationError, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    fetchCollectionPoints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedType, searchQuery, collectionPoints]);

  // Helper function to format operating hours
  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours || typeof operatingHours !== 'object') {
      return { display: 'N/A', open: null, close: null };
    }
    
    // Check if it's a simple object with open/close times
    if (operatingHours.open && operatingHours.close) {
      return {
        display: `${operatingHours.open} - ${operatingHours.close}`,
        open: operatingHours.open,
        close: operatingHours.close
      };
    }
    
    // Check if it's a weekly schedule - show today's hours
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (operatingHours[today] && !operatingHours[today].closed) {
      return {
        display: `${operatingHours[today].open} - ${operatingHours[today].close}`,
        open: operatingHours[today].open,
        close: operatingHours[today].close
      };
    }
    
    return { display: 'Closed Today', open: null, close: null };
  };

  const fetchCollectionPoints = async () => {
    try {
      setLoading(true);
      const response = await collectionPointsAPI.getAll();
      
      let points = [];
      if (Array.isArray(response)) {
        points = response;
      } else if (response.data && Array.isArray(response.data)) {
        points = response.data;
      } else if (response.collectionPoints && Array.isArray(response.collectionPoints)) {
        points = response.collectionPoints;
      }
      
      // ✅ Filter out invalid points
      points = points.filter(point => 
        point && 
        point.address && 
        typeof point.address.lat === 'number' && 
        typeof point.address.lng === 'number'
      );
      
      setCollectionPoints(points);
      setFilteredPoints(points);
    } catch (error) {
      console.error('Error fetching collection points:', error);
      setCollectionPoints([]);
      setFilteredPoints([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(collectionPoints)) {
      setFilteredPoints([]);
      return;
    }

    let filtered = [...collectionPoints];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((point) => point?.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (point) =>
          point?.name?.toLowerCase().includes(query) ||
          point?.address?.city?.toLowerCase().includes(query) ||
          point?.address?.state?.toLowerCase().includes(query) ||
          point?.address?.street?.toLowerCase().includes(query)
      );
    }

    setFilteredPoints(filtered);
  };

  const getMarkerIcon = (type) => {
    const colors = {
      pharmacy: '#3b82f6',
      hospital: '#ef4444',
      ngo: '#10b981',
      clinic: '#8b5cf6',
    };

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colors[type] || '#6b7280'}" width="32" height="32">
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const getDistanceFromUser = (point) => {
    if (!location || !point?.address?.lat || !point?.address?.lng) return null;
    return calculateDistance(
      location.lat,
      location.lng,
      point.address.lat,
      point.address.lng
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collection points...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Filters */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, city, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'pharmacy', 'hospital', 'ngo', 'clinic'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredPoints.length} of {collectionPoints.length} collection points
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={location ? [location.lat, location.lng] : [MAP_CENTER.lat, MAP_CENTER.lng]}
          zoom={location ? 12 : MAP_CENTER.zoom}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {location && (
            <Marker
              position={[location.lat, location.lng]}
              icon={
                new Icon({
                  iconUrl: `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#059669" width="32" height="32">
                      <circle cx="12" cy="12" r="8" fill="#10b981" stroke="white" stroke-width="2"/>
                    </svg>
                  `)}`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })
              }
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">Your Location</p>
                </div>
              </Popup>
            </Marker>
          )}

          {Array.isArray(filteredPoints) && filteredPoints.map((point) => {
            if (!point?.address?.lat || !point?.address?.lng) return null;

            return (
              <Marker
                key={point._id}
                position={[point.address.lat, point.address.lng]}
                icon={getMarkerIcon(point.type)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2">{point.name || 'Unknown'}</h3>
                    
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getTypeColor(point.type)}`}>
                      {point.type ? point.type.charAt(0).toUpperCase() + point.type.slice(1) : 'Unknown'}
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {point.address.street || ''}, {point.address.city || ''}
                        </span>
                      </div>

                      {point.operatingHours && (() => {
                        const hours = formatOperatingHours(point.operatingHours);
                        return (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{hours.display}</span>
                            {hours.open && hours.close && isOpenNow(hours.open, hours.close) ? (
                              <span className="ml-2 text-green-600 font-semibold">Open</span>
                            ) : hours.open && hours.close ? (
                              <span className="ml-2 text-red-600 font-semibold">Closed</span>
                            ) : null}
                          </div>
                        );
                      })()}

                      {point.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{point.phone}</span>
                        </div>
                      )}

                      {location && (
                        <div className="flex items-center">
                          <Navigation className="w-4 h-4 mr-2" />
                          <span>{getDistanceFromUser(point)} km away</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${point.address.lat},${point.address.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;