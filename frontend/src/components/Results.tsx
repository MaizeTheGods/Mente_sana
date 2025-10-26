import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '900px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            color: '#2e7d32',
            marginBottom: '10px',
            fontSize: '32px',
            fontWeight: '600'
          }}>
            Tus Resultados
          </h1>
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
                })()}`
              }}>
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
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {[
              { text: 'Ver Ejercicios', path: '/exercises' },
              { text: 'Ver Consejos', path: '/tips' },
              { text: 'Unirse a Grupos', path: '/chat' },
              { text: 'Encontrar Ayuda', path: '/maps' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(76, 175, 80, 0.2)';
                }}
              >
                {action.text}
              </button>
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
      </div>
    </div>
  );
};

export default Results;