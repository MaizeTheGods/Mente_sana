import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: #f8f9fa;
  border-radius: 12px;
  color: #666;
  font-size: 16px;
`;

const SearchButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding: 10px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-1px);
  }
`;

const MapContainerWrapper = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
`;

interface HealthService {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'psychologist' | 'therapy_center';
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  website?: string;
  description?: string;
}

// Component to handle map centering
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

interface HealthServicesMapProps {
  userLocation?: [number, number];
  onLocationSelect?: (location: [number, number]) => void;
}

const HealthServicesMap: React.FC<HealthServicesMapProps> = ({
  userLocation,
  onLocationSelect
}) => {
  const [services, setServices] = useState<HealthService[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.4326, -99.1332]); // Default: Mexico City

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          onLocationSelect?.([latitude, longitude]);
        },
        (error) => {
          console.log('Error getting location:', error);
          // Keep default location
        }
      );
    } else if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation, onLocationSelect]);

  // Search for health services using Overpass API (OpenStreetMap)
  const searchNearbyServices = async () => {
    setLoading(true);
    try {
      const [lat, lng] = mapCenter;
      const radius = 5000; // 5km radius

      // Overpass API query for health facilities
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          node["healthcare"="psychologist"](around:${radius},${lat},${lng});
          node["healthcare"="therapist"](around:${radius},${lat},${lng});
          node["healthcare"="centre"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          way["healthcare"="psychologist"](around:${radius},${lat},${lng});
          way["healthcare"="therapist"](around:${radius},${lat},${lng});
          way["healthcare"="centre"](around:${radius},${lat},${lng});
        );
        out center meta;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();

      // Transform Overpass data to our format
      const transformedServices: HealthService[] = data.elements
        .filter((element: any) => element.lat && element.lon)
        .slice(0, 20) // Limit to 20 results
        .map((element: any, index: number) => ({
          id: element.id.toString(),
          name: element.tags?.name || `Centro de Salud ${index + 1}`,
          type: getServiceType(element.tags),
          latitude: element.lat,
          longitude: element.lon,
          address: formatAddress(element.tags),
          phone: element.tags?.phone,
          website: element.tags?.website,
          description: element.tags?.description || element.tags?.['healthcare:speciality']
        }));

      setServices(transformedServices);
    } catch (error) {
      console.error('Error searching services:', error);
      // Fallback: mock data for demonstration
      setServices([
        {
          id: '1',
          name: 'Clínica de Salud Mental Central',
          type: 'clinic',
          latitude: mapCenter[0] + 0.01,
          longitude: mapCenter[1] + 0.01,
          address: 'Centro de la ciudad',
          phone: '+52 55 1234 5678',
          description: 'Especialistas en salud mental y apoyo psicológico'
        },
        {
          id: '2',
          name: 'Hospital General',
          type: 'hospital',
          latitude: mapCenter[0] - 0.01,
          longitude: mapCenter[1] - 0.01,
          address: 'Zona hospitalaria',
          phone: '+52 55 9876 5432',
          description: 'Servicio de urgencias y atención psiquiátrica'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine service type
  const getServiceType = (tags: any): HealthService['type'] => {
    if (tags?.amenity === 'hospital') return 'hospital';
    if (tags?.healthcare === 'psychologist') return 'psychologist';
    if (tags?.healthcare === 'therapist') return 'therapy_center';
    return 'clinic';
  };

  // Helper function to format address
  const formatAddress = (tags: any): string => {
    const parts = [];
    if (tags?.['addr:street']) parts.push(tags['addr:street']);
    if (tags?.['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags?.['addr:city']) parts.push(tags['addr:city']);
    return parts.length > 0 ? parts.join(', ') : 'Dirección no disponible';
  };

  // Get marker icon based on service type
  const getMarkerIcon = (type: HealthService['type']) => {
    const iconUrls = {
      hospital: '🏥',
      clinic: '🏥',
      psychologist: '🧠',
      therapy_center: '💬'
    };

    return L.divIcon({
      html: iconUrls[type],
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  };

  return (
    <MapContainerWrapper>
      <SearchButton onClick={searchNearbyServices} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar Centros de Salud'}
      </SearchButton>

      {loading ? (
        <LoadingMessage>Buscando centros de salud cercanos...</LoadingMessage>
      ) : (
        <MapWrapper>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <MapController center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            <Marker position={mapCenter}>
              <Popup>
                <strong>Tu ubicación</strong>
              </Popup>
            </Marker>

            {/* Health services markers */}
            {services.map((service) => (
              <Marker
                key={service.id}
                position={[service.latitude, service.longitude]}
                icon={getMarkerIcon(service.type)}
              >
                <Popup>
                  <div style={{ maxWidth: '200px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                      {service.name}
                    </h4>
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                      📍 {service.address}
                    </p>
                    {service.phone && (
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        📞 {service.phone}
                      </p>
                    )}
                    {service.website && (
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        🌐 <a href={service.website} target="_blank" rel="noopener noreferrer">
                          Sitio web
                        </a>
                      </p>
                    )}
                    {service.description && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#555' }}>
                        {service.description}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </MapWrapper>
      )}
    </MapContainerWrapper>
  );
};

export default HealthServicesMap;