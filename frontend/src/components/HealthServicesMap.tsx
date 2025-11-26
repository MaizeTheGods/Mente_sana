import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import {
  PageContainer,
  GlassCard,
  PageTitle
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
        const { lat, lon, display_name } = data[0];
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

  // Function to retry getting current location
  const retryLocation = () => {
    setLocationError('');
    setLocationLoading(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0 // Force fresh location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setLocationLoading(false);
        onLocationSelect?.([latitude, longitude]);
      },
      (error) => {
        console.error('Retry geolocation error:', error);
        setLocationLoading(false);
        setLocationError('No se pudo obtener tu ubicación. Intenta ingresar manualmente tu ubicación abajo.');
      },
      options
    );
  };

  // Initialize with user location if provided, otherwise show default
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    } else {
    }
  }, [userLocation, onLocationSelect]);

  // Function to request user location (requires user gesture for iOS Safari)
  const requestUserLocation = () => {

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
    <PageContainer>
      <GlassCard style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
        <PageTitle>Ayuda Profesional Cercana</PageTitle>

        <InfoSection>
          <InfoTitle>¿Cómo funciona?</InfoTitle>
          <InfoText>
            Esta herramienta te ayuda a encontrar centros de salud mental, hospitales, clínicas y psicólogos
            cerca de tu ubicación. Haz clic en "Buscar Centros de Salud" para encontrar servicios disponibles
            en un radio de 10 kilómetros.
          </InfoText>
        </InfoSection>

        {/* Location Status */}
        <InfoSection>
          <InfoTitle>Ubicación Actual</InfoTitle>
          <InfoText>
            {locationLoading ? (
              'Obteniendo tu ubicación...'
            ) : locationError ? (
              <span style={{ color: '#e74c3c' }}>{locationError}</span>
            ) : userLocation ? (
              `Ubicación manual: ${mapCenter[0].toFixed(4)}, ${mapCenter[1].toFixed(4)}`
            ) : (
              'Ubicación no establecida. Usa los botones abajo para obtener tu ubicación.'
            )}
          </InfoText>

          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={requestUserLocation}
                disabled={locationLoading}
                style={{
                  padding: '10px 20px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: locationLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!locationLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(76, 175, 80, 0.2)';
                }}
              >
                📍 {locationLoading ? 'Obteniendo...' : 'Obtener mi ubicación'}
              </button>

              {locationError && (
                <button
                  onClick={requestUserLocation}
                  disabled={locationLoading}
                  style={{
                    padding: '10px 20px',
                    background: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: locationLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  🔄 Reintentar
                </button>
              )}
            </div>

            <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '15px', marginTop: '15px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>
                O ingresa manualmente tu ubicación:
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Ej: Acapulco, Guerrero"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #c8e6c9',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
                />
                <button
                  onClick={handleManualLocation}
                  disabled={locationLoading || !manualLocation.trim()}
                  style={{
                    padding: '10px 16px',
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (locationLoading || !manualLocation.trim()) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {locationLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>
          </div>
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
            {services.some(s => s.id.startsWith('mock-') || s.id.startsWith('fallback-')) && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '15px',
                fontSize: '14px',
                color: '#856404'
              }}>
                ⚠️ <strong>Nota:</strong> Se están mostrando datos de ejemplo porque no se encontraron resultados en tiempo real o hubo un error de conexión.
              </div>
            )}
            <ServiceTypeFilter>
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
              <FilterButton
                active={selectedType === 'therapy_center'}
                onClick={() => setSelectedType('therapy_center')}
              >
                Terapeutas
              </FilterButton>
            </ServiceTypeFilter>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {services
                .filter(s => selectedType === 'all' || s.type === selectedType)
                .map(service => (
                  <ServiceCard
                    key={service.id}
                    onClick={() => setMapCenter([service.latitude, service.longitude])}
                    style={{ cursor: 'pointer' }}
                  >
                    <ServiceName>{service.name}</ServiceName>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <ServiceType>{service.type === 'hospital' ? 'Hospital' :
                        service.type === 'clinic' ? 'Clínica' :
                          service.type === 'psychologist' ? 'Psicólogo' : 'Terapeuta'}</ServiceType>
                    </div>
                    <ServiceInfo data-icon="📍">{service.address}</ServiceInfo>
                    {service.phone && <ServiceInfo data-icon="📞">{service.phone}</ServiceInfo>}
                    {service.description && <ServiceInfo data-icon="ℹ️">{service.description}</ServiceInfo>}
                  </ServiceCard>
                ))}
            </div>
          </ServicesList>
        )}

        <MapContainerWrapper>
          <MapWrapper>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <MapController center={mapCenter} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapCenter} icon={L.divIcon({
                html: '<div style="background: #2196f3; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 0 0 2px #2196f3;"></div>',
                className: 'user-location-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}>
                <Popup>Tu ubicación actual</Popup>
              </Marker>
              {services
                .filter(s => selectedType === 'all' || s.type === selectedType)
                .map(service => (
                  <Marker
                    key={service.id}
                    position={[service.latitude, service.longitude]}
                    icon={getMarkerIcon(service.type)}
                  >
                    <Popup>
                      <strong>{service.name}</strong><br />
                      {service.address}<br />
                      {service.phone && <>{service.phone}<br /></>}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 'bold' }}
                      >
                        Cómo llegar ➡️
                      </a>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </MapWrapper>

          <SearchButton
            onClick={searchNearbyServices}
            disabled={loading}
          >
            {loading ? 'Buscando...' : '🔍 Buscar Centros de Salud'}
          </SearchButton>
        </MapContainerWrapper>

        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => window.history.back()}>
            ← Regresar al Dashboard
          </BackButton>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default HealthServicesMap;
