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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  padding: 20px;
`;

const MapCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  text-align: center;
  color: #2e7d32;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const MapContainerWrapper = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #4caf50;
`;

const InfoTitle = styled.h3`
  color: #2e7d32;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const InfoText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const ServiceTypeFilter = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#4caf50' : '#e9ecef'};
  border-radius: 20px;
  background: ${props => props.active ? '#4caf50' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4caf50;
    background: ${props => props.active ? '#4caf50' : '#f1f8e9'};
  }
`;

const ServicesList = styled.div`
  margin-top: 20px;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ServiceName = styled.h4`
  color: #2e7d32;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

const ServiceInfo = styled.p`
  color: #666;
  font-size: 14px;
  margin: 4px 0;
  display: flex;
  align-items: center;

  &::before {
    content: attr(data-icon);
    margin-right: 8px;
    font-size: 16px;
  }
`;

const ServiceType = styled.span`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
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
  const [error, setError] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.4326, -99.1332]); // Default: Mexico City
  const [selectedType, setSelectedType] = useState<HealthService['type'] | 'all'>('all');

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
    setError('');
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

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

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

      if (transformedServices.length === 0) {
        setError('No se encontraron centros de salud en tu área. Intenta buscar en otra ubicación.');
      }
    } catch (error) {
      console.error('Error searching services:', error);
      setError('Error al buscar centros de salud. Por favor, intenta de nuevo más tarde.');

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
    <Container>
      <MapCard>
        <Title>Ayuda Profesional Cercana</Title>

        <InfoSection>
          <InfoTitle>¿Cómo funciona?</InfoTitle>
          <InfoText>
            Esta herramienta te ayuda a encontrar centros de salud mental, hospitales, clínicas y psicólogos
            cerca de tu ubicación. Haz clic en "Buscar Centros de Salud" para encontrar servicios disponibles
            en un radio de 5 kilómetros.
          </InfoText>
        </InfoSection>

        {error && (
          <InfoSection style={{ borderLeftColor: '#e74c3c', background: '#fdf2f2' }}>
            <InfoTitle style={{ color: '#e74c3c' }}>Error</InfoTitle>
            <InfoText style={{ color: '#c0392b' }}>{error}</InfoText>
          </InfoSection>
        )}

        {services.length > 0 && (
          <ServicesList>
            <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
              Centros encontrados ({services.length})
            </h3>
            {services.map((service) => (
              <ServiceCard key={service.id}>
                <ServiceName>
                  {service.name}
                  <ServiceType>{service.type.replace('_', ' ')}</ServiceType>
                </ServiceName>
                <ServiceInfo data-icon="📍">{service.address}</ServiceInfo>
                {service.phone && (
                  <ServiceInfo data-icon="📞">{service.phone}</ServiceInfo>
                )}
                {service.website && (
                  <ServiceInfo data-icon="🌐">
                    <a href={service.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>
                      Sitio web
                    </a>
                  </ServiceInfo>
                )}
                {service.description && (
                  <ServiceInfo data-icon="ℹ️">{service.description}</ServiceInfo>
                )}
              </ServiceCard>
            ))}
          </ServicesList>
        )}

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

        <BackButton onClick={() => window.history.back()}>
          ← Regresar al Dashboard
        </BackButton>
      </MapCard>
    </Container>
  );
};

export default HealthServicesMap;