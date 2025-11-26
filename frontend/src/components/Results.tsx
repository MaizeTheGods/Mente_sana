import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PageContainer,
  GlassCard,
  PageTitle
} from './SharedStyles';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/questionnaire');
    return null;
  }

  const { scores, severityLevels, recommendations } = result;

  const getSeverityText = (severity: string) => {
    const texts = {
      normal: 'Normal',
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Severo',
      extremely_severe: 'Extremadamente Severo'
    };
    return texts[severity as keyof typeof texts] || severity;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return '#28a745';
      case 'mild': return '#ffc107';
      case 'moderate': return '#fd7e14';
      case 'severe': return '#dc3545';
      case 'extremely_severe': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  return (
    <PageContainer>
      <GlassCard style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <PageTitle>Tus Resultados</PageTitle>
          <p style={{
            color: '#666',
            fontSize: '18px'
          }}>
            Evaluación completada el {new Date(result.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Scores Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {[
            { title: 'Depresión', score: scores.depression, severity: severityLevels.depression },
            { title: 'Ansiedad', score: scores.anxiety, severity: severityLevels.anxiety },
            { title: 'Estrés', score: scores.stress, severity: severityLevels.stress }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid #f0f0f0',
              textAlign: 'center'
            }}>
              <h3 style={{
                color: '#333',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                {item.title}
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: getSeverityColor(item.severity),
                  marginBottom: '10px'
                }}>
                  {item.score}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Puntuación DASS
                </div>
              </div>

              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: (() => {
                  switch (item.severity) {
                    case 'normal': return '#d4edda';
                    case 'mild': return '#fff3cd';
                    case 'moderate': return '#ffeaa7';
                    case 'severe': return '#f8d7da';
                    case 'extremely_severe': return '#e2e3e5';
                    default: return '#f8f9fa';
                  }
                })(),
                color: (() => {
                  switch (item.severity) {
                    case 'normal': return '#155724';
                    case 'mild': return '#856404';
                    case 'moderate': return '#856404';
                    case 'severe': return '#721c24';
                    case 'extremely_severe': return '#383d41';
                    default: return '#6c757d';
                  }
                })()
              }}>
                {getSeverityText(item.severity)}
              </div>
            </div>
          ))}
        </div>

        {/* DASS-21 Scoring Chart */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #f0f0f0',
          marginBottom: '40px',
          overflowX: 'auto'
        }}>
          <h3 style={{
            color: '#333',
            marginBottom: '20px',
            fontSize: '20px',
            textAlign: 'center'
          }}>
            Tabla de Interpretación DASS-21
          </h3>

          <div style={{ display: 'grid', gap: '10px' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 1fr',
              gap: '10px',
              fontWeight: 'bold',
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div>Severidad</div>
              <div style={{ textAlign: 'center' }}>Depresión</div>
              <div style={{ textAlign: 'center' }}>Ansiedad</div>
              <div style={{ textAlign: 'center' }}>Estrés</div>
            </div>

            {/* Normal */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 1fr',
              gap: '10px',
              padding: '15px',
              background: '#ecfdf5',
              borderRadius: '8px',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ fontWeight: '600', color: '#065f46' }}>Normal</div>
              <div style={{ textAlign: 'center' }}>0-9</div>
              <div style={{ textAlign: 'center' }}>0-7</div>
              <div style={{ textAlign: 'center' }}>0-14</div>
            </div>

            {/* Leve */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 1fr',
              gap: '10px',
              padding: '15px',
              background: '#fffbeb',
              borderRadius: '8px',
              border: '1px solid #fed7aa'
            }}>
              <div style={{ fontWeight: '600', color: '#92400e' }}>Leve</div>
              <div style={{ textAlign: 'center' }}>10-13</div>
              <div style={{ textAlign: 'center' }}>8-9</div>
              <div style={{ textAlign: 'center' }}>15-18</div>
            </div>

            {/* Moderado */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 1fr',
              gap: '10px',
              padding: '15px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fcd34d'
            }}>
              <div style={{ fontWeight: '600', color: '#78350f' }}>Moderado</div>
              <div style={{ textAlign: 'center' }}>14-20</div>
              <div style={{ textAlign: 'center' }}>10-14</div>
              <div style={{ textAlign: 'center' }}>19-25</div>
            </div>

            {/* Grave */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 1fr',
              gap: '10px',
              padding: '15px',
              background: '#fee2e2',
              borderRadius: '8px',
              border: '1px solid #fca5a5'
            }}>
              <div style={{ fontWeight: '600', color: '#991b1b' }}>Grave</div>
              <div style={{ textAlign: 'center' }}>21-27</div>
              <div style={{ textAlign: 'center' }}>15-19</div>
              <div style={{ textAlign: 'center' }}>26-33</div>
            </div>

            {/* Extremadamente Grave */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 1fr',
              gap: '10px',
              padding: '15px',
              background: '#f3e8ff',
              borderRadius: '8px',
              border: '1px solid #d8b4fe'
            }}>
              <div style={{ fontWeight: '600', color: '#6b21a8' }}>Extremadamente Grave</div>
              <div style={{ textAlign: 'center' }}>28+</div>
              <div style={{ textAlign: 'center' }}>20+</div>
              <div style={{ textAlign: 'center' }}>34+</div>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <strong>Nota:</strong> Los puntajes mostrados son para la versión completa de 42 ítems.
            Para DASS-21 (21 ítems), se multiplico los puntajes por 2 antes de interpretar.
          </div>
        </div>

        {/* Recommendations */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: '#333',
            marginBottom: '20px',
            fontSize: '28px'
          }}>
            Recomendaciones Personalizadas
          </h2>

          <div style={{ display: 'grid', gap: '15px' }}>
            {recommendations.map((rec: any, index: number) => (
              <div key={index} style={{
                background: (() => {
                  switch (rec.priority) {
                    case 'high': return '#fff5f5';
                    case 'medium': return '#fffbf0';
                    case 'low': return '#f8f9fa';
                    default: return '#f8f9fa';
                  }
                })(),
                border: `1px solid ${(() => {
                  switch (rec.priority) {
                    case 'high': return '#fed7d7';
                    case 'medium': return '#feebc8';
                    case 'low': return '#e9ecef';
                    default: return '#e9ecef';
                  }
                })()}`,
                borderRadius: '8px',
                padding: '20px',
                borderLeft: `4px solid ${(() => {
                  switch (rec.priority) {
                    case 'high': return '#e53e3e';
                    case 'medium': return '#dd6b20';
                    case 'low': return '#718096';
                    default: return '#718096';
                  }
                })()}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
                onClick={() => {
                  // Handle navigation based on recommendation type
                  if (rec.type === 'exercise') {
                    navigate('/exercises');
                  } else if (rec.type === 'tip') {
                    navigate('/tips');
                  } else if (rec.type === 'group_chat') {
                    navigate('/chat');
                  } else if (rec.type === 'professional_help') {
                    navigate('/maps');
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  color: (() => {
                    switch (rec.priority) {
                      case 'high': return '#c53030';
                      case 'medium': return '#c05621';
                      case 'low': return '#4a5568';
                      default: return '#4a5568';
                    }
                  })(),
                  marginBottom: '5px',
                  textTransform: 'capitalize'
                }}>
                  {rec.type.replace('_', ' ')}
                </div>
                <h4 style={{
                  color: '#333',
                  marginBottom: '8px',
                  fontSize: '18px'
                }}>
                  {rec.title}
                </h4>
                <p style={{
                  color: '#666',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '40px'
        }}>
          <h3 style={{
            color: '#2e7d32',
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            ¿Qué te gustaría hacer ahora?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                text: 'Ver Ejercicios',
                path: '/exercises',
                icon: '🧘',
                description: 'Accede a técnicas de relajación y mindfulness'
              },
              {
                text: 'Ver Consejos',
                path: '/tips',
                icon: '💡',
                description: 'Descubre consejos prácticos para tu bienestar'
              },
              {
                text: 'Unirse a Grupos',
                path: '/chat',
                icon: '👥',
                description: 'Conecta con personas que comparten experiencias similares'
              },
              {
                text: 'Encontrar Ayuda',
                path: '/maps',
                icon: '🗺️',
                description: 'Localiza profesionales de salud mental cercanos'
              },
              {
                text: 'Ir al Dashboard',
                path: '/dashboard',
                icon: '🏠',
                description: 'Regresa a tu panel principal de control'
              }
            ].map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#4caf50';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#f0f0f0';
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}>
                  {action.icon}
                </div>
                <h4 style={{
                  color: '#2e7d32',
                  marginBottom: '8px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {action.text}
                </h4>
                <p style={{
                  color: '#666',
                  margin: '0',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{
            color: '#856404',
            marginBottom: '10px'
          }}>
            Importante
          </h4>
          <p style={{
            color: '#856404',
            margin: '0',
            lineHeight: '1.5'
          }}>
            Estos resultados son solo una evaluación preliminar y no reemplazan el diagnóstico profesional.
            Si experimentas síntomas graves o persistentes, te recomendamos buscar ayuda de un profesional de la salud mental calificado.
          </p>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Results;