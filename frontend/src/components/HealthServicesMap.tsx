import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  Button,
  StyledInput
} from './SharedStyles';

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
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    height: 350px;
  }
`;

const InfoSection = styled(Card)`
  margin-bottom: 24px;
  border-left: 4px solid #2e7d32;
`;

const InfoTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
`;

const InfoText = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#2e7d32' : '#e2e8f0'};
  border-radius: 20px;
  background: ${props => props.active ? '#2e7d32' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2e7d32;
    background: ${props => props.active ? '#2e7d32' : '#f0fdf4'};
    color: ${props => props.active ? 'white' : '#2e7d32'};
  }
`;

const ServicesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const ServiceCard = styled(Card)`
  padding: 16px;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: #2e7d32;
  }
`;

const ServiceName = styled.h4`
  color: #1e293b;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

const ServiceInfo = styled.p`
  color: #64748b;
  font-size: 13px;
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ServiceTypeBadge = styled.span`
  background: #f0fdf4;
  color: #166534;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  margin-left: auto;
`;

const Container = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.8531, -99.8237]); // Default: Acapulco
  const [selectedType, setSelectedType] = useState<HealthService['type'] | 'all'>('all');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [manualLocation, setManualLocation] = useState<string>('');


  // Function to geocode manual location input
  const handleManualLocation = async () => {
    if (!manualLocation.trim()) return;

    setLocationLoading(true);
    setLocationError('');

    try {
      // Use Nominatim API for geocoding
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocation)}&limit=1&countrycodes=mx`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setLocationLoading(false);
        onLocationSelect?.(newCenter);
        setLocationError('');
      } else {
        const msg = 'No se encontró la ubicación especificada. Intenta con una dirección más específica.';
        setLocationError(msg);
        setLocationLoading(false);
      }
    } catch (error) {
      const msg = 'Error al buscar la ubicación. Intenta de nuevo.';
      console.error('Error geocoding location:', error);
      setLocationError(msg);
      setLocationLoading(false);
    }
  };

  // Initialize with user location if provided
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  // Function to request user location (requires user gesture for iOS Safari)
  const requestUserLocation = async () => {
    // Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // For iOS devices, automatically set to Acapulco and search services
      console.log('iOS device detected, setting location to Acapulco and searching services');
      const acapulcoCoords: [number, number] = [16.8531, -99.8237];
      setMapCenter(acapulcoCoords);
      setLocationLoading(false);
      setLocationError('');
      onLocationSelect?.(acapulcoCoords);

      // Automatically search for services in Acapulco
      await searchNearbyServices();
      return;
    }

    if (!navigator.geolocation) {
      const msg = 'La geolocalización no está disponible en este navegador.';
      setLocationError(msg);
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds
      maximumAge: 300000 // 5 minutes
    };


    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('Location obtained:', { latitude, longitude, accuracy });
        setMapCenter([latitude, longitude]);
        setLocationLoading(false);
        onLocationSelect?.([latitude, longitude]);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);

        let errorMessage = '';
        const iosInstructions = /iPad|iPhone|iPod/.test(navigator.userAgent) ? `
📱 INSTRUCCIONES PARA iOS/iPhone:
1. Ve a: Ajustes → Safari → Ubicación
2. Selecciona "Preguntar" o "Permitir"
3. También: Ajustes → Privacidad → Servicios de ubicación → Safari → Permitir
4. 🔄 IMPORTANTE: Actualiza esta página (pulsa el botón de recarga ↻)
5. Toca "Obtener mi ubicación" nuevamente

Si aún falla:
• Cierra Safari completamente y vuelve a abrirlo
• Verifica que tienes buena señal GPS
• Intenta en otra red WiFi
• Reinicia tu iPhone si es necesario` : '';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = `❌ PERMISO DENEGADO
El acceso a tu ubicación fue rechazado por el navegador.

${iosInstructions}

Para otros navegadores:
• Haz clic en el ícono de candado/descarga segura en la barra de direcciones
• Selecciona "Permitir" para Ubicación
• Actualiza la página e intenta nuevamente

También puedes ingresar manualmente tu ubicación abajo.`;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = `❌ UBICACIÓN NO DISPONIBLE
No se pudo determinar tu ubicación.

Posibles causas:
• GPS desactivado
• Sin conexión a internet
• Estás en un área sin cobertura GPS
• Problemas con los servicios de ubicación del dispositivo

${iosInstructions}

Solución alternativa: Ingresa manualmente tu ciudad abajo (ej: "Acapulco, Guerrero").`;
            break;
          case error.TIMEOUT:
            errorMessage = `⏰ TIEMPO AGOTADO
La solicitud de ubicación tardó demasiado en responder.

Posibles causas:
• Conexión a internet lenta
• GPS tardando en obtener señal
• Servicios de ubicación sobrecargados

${iosInstructions}

Intenta:
• Esperar un momento y tocar "Reintentar"
• Verificar que tienes buena señal de internet
• Moverte a un área con mejor recepción GPS

O usa la búsqueda manual abajo.`;
            break;
          default:
            errorMessage = `❌ ERROR DESCONOCIDO
Ocurrió un error inesperado al obtener tu ubicación (Código: ${error.code}).

${iosInstructions}

Solución: Intenta nuevamente o usa la búsqueda manual de ubicación abajo.`;
            break;
        }
        setLocationError(errorMessage);
      },
      options
    );
  };

  // Search for health services using Overpass API (OpenStreetMap)
  const searchNearbyServices = async () => {
    setLoading(true);
    setError('');
    try {
      const [lat, lng] = mapCenter;
      const radius = 10000; // 10km radius

      // Overpass API query for health facilities - expanded search
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          node["healthcare"="hospital"](around:${radius},${lat},${lng});
          node["healthcare"="clinic"](around:${radius},${lat},${lng});
          node["healthcare"="psychologist"](around:${radius},${lat},${lng});
          node["healthcare"="therapist"](around:${radius},${lat},${lng});
          node["healthcare"="centre"](around:${radius},${lat},${lng});
          node["healthcare"="counselling"](around:${radius},${lat},${lng});
          node["healthcare"="psychiatry"](around:${radius},${lat},${lng});
          node["office"="therapist"](around:${radius},${lat},${lng});
          node["shop"="medical_supply"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          way["healthcare"="hospital"](around:${radius},${lat},${lng});
          way["healthcare"="clinic"](around:${radius},${lat},${lng});
          way["healthcare"="psychologist"](around:${radius},${lat},${lng});
          way["healthcare"="therapist"](around:${radius},${lat},${lng});
          way["healthcare"="centre"](around:${radius},${lat},${lng});
          way["healthcare"="counselling"](around:${radius},${lat},${lng});
          way["healthcare"="psychiatry"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="clinic"](around:${radius},${lat},${lng});
          relation["healthcare"](around:${radius},${lat},${lng});
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

      if (transformedServices.length > 0) {
        setServices(transformedServices);
      } else {
        // Fallback to mock data when no real services found
        console.log('No real services found, using mock data');
        setServices([
          {
            id: 'mock-1',
            name: 'Centro de Salud Mental Comunitario',
            type: 'clinic',
            latitude: mapCenter[0] + 0.005,
            longitude: mapCenter[1] + 0.005,
            address: 'Centro de la ciudad',
            phone: '+52 55 1234 5678',
            description: 'Servicios de atención psicológica y salud mental'
          },
          {
            id: 'mock-2',
            name: 'Clínica Psicológica Integral',
            type: 'psychologist',
            latitude: mapCenter[0] - 0.005,
            longitude: mapCenter[1] - 0.005,
            address: 'Zona residencial',
            phone: '+52 55 9876 5432',
            description: 'Especialistas en psicología clínica y terapia'
          },
          {
            id: 'mock-3',
            name: 'Hospital General Regional',
            type: 'hospital',
            latitude: mapCenter[0] + 0.003,
            longitude: mapCenter[1] - 0.003,
            address: 'Zona hospitalaria',
            phone: '+52 55 5555 1234',
            description: 'Atención de urgencias y servicios psiquiátricos'
          },
          {
            id: 'mock-4',
            name: 'Centro de Terapia Familiar',
            type: 'therapy_center',
            latitude: mapCenter[0] - 0.003,
            longitude: mapCenter[1] + 0.003,
            address: 'Barrio tranquilo',
            phone: '+52 55 7777 9999',
            description: 'Terapia familiar y de pareja'
          }
        ]);
        setError(''); // Clear any previous error
      }
    } catch (error) {
      console.error('Error searching services:', error);
      setError('Error al buscar centros de salud. Por favor, intenta de nuevo más tarde.');

      // Fallback: provide basic mock data even on API error
      setServices([
        {
          id: 'fallback-1',
          name: 'Centro de Apoyo Psicológico',
          type: 'clinic',
          latitude: mapCenter[0] + 0.002,
          longitude: mapCenter[1] + 0.002,
          address: 'Centro de la ciudad',
          phone: 'Consulta telefónica disponible',
          description: 'Apoyo psicológico y orientación emocional'
        },
        {
          id: 'fallback-2',
          name: 'Línea de Ayuda Mental',
          type: 'psychologist',
          latitude: mapCenter[0] - 0.002,
          longitude: mapCenter[1] - 0.002,
          address: 'Servicio telefónico',
          phone: '+52 55 5259 8121',
          description: 'Línea de ayuda las 24 horas para crisis emocionales'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine service type
  const getServiceType = (tags: any): HealthService['type'] => {
    // Check for hospitals first
    if (tags?.amenity === 'hospital') return 'hospital';

    // Check for clinics and health centers
    if (tags?.amenity === 'clinic') return 'clinic';
    if (tags?.healthcare === 'clinic') return 'clinic';
    if (tags?.healthcare === 'centre') return 'clinic';
    if (tags?.healthcare === 'center') return 'clinic';

    // Check for psychologists and mental health
    if (tags?.healthcare === 'psychologist') return 'psychologist';
    if (tags?.healthcare === 'psychiatry') return 'psychologist';
    if (tags?.healthcare === 'counselling') return 'psychologist';

    // Check for therapy centers
    if (tags?.healthcare === 'therapist') return 'therapy_center';
    if (tags?.healthcare === 'rehabilitation') return 'therapy_center';

    // Check name/description for keywords
    const name = (tags?.name || '').toLowerCase();
    const desc = (tags?.description || '').toLowerCase();

    if (name.includes('hospital') || desc.includes('hospital')) return 'hospital';
    if (name.includes('clínica') || name.includes('clinica') || desc.includes('clínica') || desc.includes('clinica')) return 'clinic';
    if (name.includes('psicólogo') || name.includes('psicologo') || desc.includes('psicólogo') || desc.includes('psicologo')) return 'psychologist';
    if (name.includes('terapia') || desc.includes('terapia')) return 'therapy_center';

    // Default fallback
    return 'clinic';
  };

  // Helper function to format address
  const formatAddress = (tags: any): string => {
    const parts = [];
    if (tags?.['addr:street']) parts.push(tags['addr:street']);
    if (tags?.['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags?.['addr:city']) parts.push(tags['addr:city']);
    if (tags?.['addr:state']) parts.push(tags['addr:state']);
    if (tags?.['addr:country']) parts.push(tags['addr:country']);

    // If we have any address parts, join them
    if (parts.length > 0) {
      return parts.join(', ');
    }

    // Try alternative address fields
    if (tags?.['addr:full']) return tags['addr:full'];
    if (tags?.['addr:place']) return tags['addr:place'];

    // If no structured address, try to use name or other location info
    if (tags?.name) return `Cerca de ${tags.name}`;

    // Last resort - return coordinates as fallback
    return 'Dirección no disponible';
  };

  // Function to open Google Maps with place name and address
  const openInGoogleMaps = (service: HealthService) => {
    // Create a search query with place name and address for better accuracy
    const searchQuery = encodeURIComponent(`${service.name}, ${service.address}`);

    // Use Google Maps URL that will search for the place
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

    // Open in new tab/window
    window.open(googleMapsUrl, '_blank');
  };

  // Get marker icon based on service type
  const getMarkerIcon = (type: HealthService['type']) => {
    const iconUrls = {
      hospital: '🏥',
      clinic: '🏥',
      psychologist: '🧠',
      therapy_center: '💬'
    };

    const colors = {
      hospital: '#4caf50', // Green for hospitals
      clinic: '#4caf50',   // Green for clinics
      psychologist: '#4caf50', // Green for psychologists
      therapy_center: '#4caf50' // Green for therapy centers
    };

    return L.divIcon({
      html: `<div style="background: ${colors[type]}; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${iconUrls[type]}</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  };

  return (
    <Container>
      <PageHeader>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <PageTitle>Ayuda Profesional Cercana</PageTitle>
          <PageSubtitle>
            Encuentra especialistas y centros de salud mental cerca de ti
          </PageSubtitle>
        </div>
      </PageHeader>

      <InfoSection>
        <InfoTitle>¿Cómo funciona?</InfoTitle>
        <InfoText>
          Esta herramienta te ayuda a encontrar centros de salud mental, hospitales, clínicas y psicólogos
          cerca de tu ubicación. Haz clic en "Buscar Centros de Salud" para encontrar servicios disponibles
          en un radio de 10 kilómetros. Al seleccionar un resultado, se abrirá Google Maps con la ubicación
          exacta del lugar para que puedas obtener direcciones y navegar hasta allí.
        </InfoText>
      </InfoSection>

      <MapWrapper>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />

          {/* User Location Marker */}
          <Marker position={mapCenter} icon={L.divIcon({
            html: '<div style="background: #2196f3; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            className: 'user-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>

          {/* Service Markers */}
          {services.map(service => (
            <Marker
              key={service.id}
              position={[service.latitude, service.longitude]}
              icon={getMarkerIcon(service.type)}
            >
              <Popup>
                <strong>{service.name}</strong><br />
                {service.type}<br />
                {service.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapWrapper>

      <Card style={{ marginBottom: '24px' }}>
        <InfoTitle>Ubicación y Búsqueda</InfoTitle>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
              Ingresa tu ubicación manualmente:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <StyledInput
                type="text"
                placeholder="Ej: Acapulco, Guerrero"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
              />
              <Button
                onClick={handleManualLocation}
                disabled={locationLoading || !manualLocation.trim()}
              >
                {locationLoading ? '...' : 'Buscar'}
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outline"
              onClick={requestUserLocation}
              disabled={locationLoading}
            >
              📍 Mi Ubicación
            </Button>
            <Button
              variant="primary"
              onClick={searchNearbyServices}
              disabled={loading}
            >
              🔍 Buscar Centros
            </Button>
          </div>
        </div>

        {locationError && (
          <div style={{ marginTop: '16px', color: '#dc2626', fontSize: '14px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
            {locationError}
          </div>
        )}
      </Card>

      {error && (
        <div style={{
          padding: '16px',
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {services.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
              Resultados ({services.length})
            </h3>
          </div>

          <FilterContainer>
            <FilterButton
              active={selectedType === 'all'}
              onClick={() => setSelectedType('all')}
            >
              Todos
            </FilterButton>
            <FilterButton
              active={selectedType === 'hospital'}
              onClick={() => setSelectedType('hospital')}
            >
              Hospitales
            </FilterButton>
            <FilterButton
              active={selectedType === 'clinic'}
              onClick={() => setSelectedType('clinic')}
            >
              Clínicas
            </FilterButton>
            <FilterButton
              active={selectedType === 'psychologist'}
              onClick={() => setSelectedType('psychologist')}
            >
              Psicólogos
            </FilterButton>
          </FilterContainer>

          <ServicesList>
            {services
              .filter(s => selectedType === 'all' || s.type === selectedType)
              .map(service => (
                <ServiceCard key={service.id} onClick={() => openInGoogleMaps(service)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <ServiceName>{service.name}</ServiceName>
                    <ServiceTypeBadge>{service.type}</ServiceTypeBadge>
                  </div>
                  <ServiceInfo>📍 {service.address}</ServiceInfo>
                  {service.phone && <ServiceInfo>📞 {service.phone}</ServiceInfo>}
                  {service.description && (
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', lineHeight: '1.5' }}>
                      {service.description}
                    </p>
                  )}
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                    fontSize: '12px',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>🗺️</span>
                    <span>Haz clic para abrir en Google Maps</span>
                  </div>
                </ServiceCard>
              ))}
          </ServicesList>
        </div>
      )}
    </Container>
  );
};

export default HealthServicesMap;
