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
      case 'normal': return '#10b981';
      case 'mild': return '#f59e0b';
      case 'moderate': return '#f97316';
      case 'severe': return '#ef4444';
      case 'extremely_severe': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'normal': return '#ecfdf5';
      case 'mild': return '#fffbeb';
      case 'moderate': return '#fff7ed';
      case 'severe': return '#fef2f2';
      case 'extremely_severe': return '#f3e8ff';
      default: return '#f9fafb';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#fef2f2';
      case 'medium': return '#fffbeb';
      case 'low': return '#ecfdf5';
      default: return '#f9fafb';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            color: '#1f2937',
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🎉 Tus Resultados
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.2rem',
            margin: '0'
          }}>
            Evaluación completada el {new Date(result.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Scores Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {[
            { title: 'Depresión', score: scores.depression, severity: severityLevels.depression, icon: '😔' },
            { title: 'Ansiedad', score: scores.anxiety, severity: severityLevels.anxiety, icon: '😰' },
            { title: 'Estrés', score: scores.stress, severity: severityLevels.stress, icon: '😫' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '40px 30px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${getSeverityColor(item.severity)}`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.icon}</div>
                <h3 style={{
                  color: '#1f2937',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0 0 20px 0'
                }}>
                  {item.title}
                </h3>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  color: getSeverityColor(item.severity),
                  marginBottom: '10px',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {item.score}
                </div>
                <div style={{
                  color: '#6b7280',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Puntuación DASS
                </div>
              </div>

              <div style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: getSeverityBgColor(item.severity),
                color: getSeverityColor(item.severity),
                border: `2px solid ${getSeverityColor(item.severity)}`
              }}>
                {getSeverityText(item.severity)}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '50px'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '30px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💡 Recomendaciones Personalizadas
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {recommendations.map((rec: any, index: number) => (
              <div key={index} style={{
                background: getPriorityBgColor(rec.priority),
                border: `2px solid ${getPriorityColor(rec.priority)}`,
                borderRadius: '15px',
                padding: '25px',
                borderLeft: `5px solid ${getPriorityColor(rec.priority)}`,
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(10px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div style={{
                  fontWeight: 'bold',
                  color: getPriorityColor(rec.priority),
                  marginBottom: '8px',
                  textTransform: 'capitalize',
                  fontSize: '0.9rem'
                }}>
                  {rec.type.replace('_', ' ')}
                </div>
                <h4 style={{
                  color: '#1f2937',
                  marginBottom: '10px',
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>
                  {rec.title}
                </h4>
                <p style={{
                  color: '#4b5563',
                  margin: '0',
                  lineHeight: '1.6',
                  fontSize: '1rem'
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
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '50px'
        }}>
          <h3 style={{
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            🚀 ¿Qué te gustaría hacer ahora?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {[
              { text: 'Ver Ejercicios', icon: '🏃‍♂️', path: '/exercises', color: '#10b981' },
              { text: 'Ver Consejos', icon: '💡', path: '/tips', color: '#f59e0b' },
              { text: 'Unirse a Grupos', icon: '👥', path: '/chat', color: '#8b5cf6' },
              { text: 'Encontrar Ayuda', icon: '🏥', path: '/maps', color: '#ef4444' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                  color: 'white',
                  border: 'none',
                  padding: '20px',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                {action.text}
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid #f59e0b',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{
            color: '#92400e',
            marginBottom: '15px',
            fontSize: '1.3rem',
            textAlign: 'center'
          }}>
            ⚠️ Importante
          </h4>
          <p style={{
            color: '#92400e',
            margin: '0',
            lineHeight: '1.6',
            fontSize: '1rem',
            textAlign: 'center'
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