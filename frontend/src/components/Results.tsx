import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  Button
} from './SharedStyles';

const ResultCard = styled(Card)`
  text-align: center;
  margin-bottom: 30px;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ScoreCard = styled.div<{ severity: string }>`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ScoreValue = styled.div<{ color: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 8px;
`;

const SeverityBadge = styled.div<{ bg: string; color: string }>`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const TableContainer = styled(Card)`
  margin-bottom: 40px;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr 1fr 1fr;
  gap: 10px;
  font-weight: 600;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  color: #475569;
  margin-bottom: 12px;
  min-width: 600px;
`;

const TableRow = styled.div<{ bg: string; borderColor: string }>`
  display: grid;
  grid-template-columns: 150px 1fr 1fr 1fr;
  gap: 10px;
  padding: 16px;
  background: ${props => props.bg};
  border-radius: 8px;
  border: 1px solid ${props => props.borderColor};
  margin-bottom: 8px;
  min-width: 600px;
`;

const RecommendationCard = styled.div<{ priority: string }>`
  background: ${props => {
    switch (props.priority) {
      case 'high': return '#fff5f5';
      case 'medium': return '#fffbf0';
      default: return '#f8fafc';
    }
  }};
  border: 1px solid ${props => {
    switch (props.priority) {
      case 'high': return '#fed7d7';
      case 'medium': return '#feebc8';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      default: return '#64748b';
    }
  }};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ActionCard = styled(Card)`
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;

  &:hover {
    border-color: #2e7d32;
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

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
    const texts: Record<string, string> = {
      normal: 'Normal',
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Severo',
      extremely_severe: 'Extremadamente Severo'
    };
    return texts[severity] || severity;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return '#16a34a';
      case 'mild': return '#ca8a04';
      case 'moderate': return '#ea580c';
      case 'severe': return '#dc2626';
      case 'extremely_severe': return '#7c3aed';
      default: return '#475569';
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal': return { bg: '#dcfce7', color: '#166534' };
      case 'mild': return { bg: '#fef9c3', color: '#854d0e' };
      case 'moderate': return { bg: '#ffedd5', color: '#9a3412' };
      case 'severe': return { bg: '#fee2e2', color: '#991b1b' };
      case 'extremely_severe': return { bg: '#f3e8ff', color: '#6b21a8' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div>
      <PageHeader>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <PageTitle>Tus Resultados</PageTitle>
          <PageSubtitle>
            Evaluación completada el {new Date(result.createdAt).toLocaleDateString('es-ES')}
          </PageSubtitle>
        </div>
      </PageHeader>

      <ScoreGrid>
        {[
          { title: 'Depresión', score: scores.depression, severity: severityLevels.depression },
          { title: 'Ansiedad', score: scores.anxiety, severity: severityLevels.anxiety },
          { title: 'Estrés', score: scores.stress, severity: severityLevels.stress }
        ].map((item, index) => {
          const styles = getSeverityStyles(item.severity);
          return (
            <ScoreCard key={index} severity={item.severity}>
              <h3 style={{ color: '#1e293b', marginBottom: '16px', fontSize: '18px' }}>
                {item.title}
              </h3>
              <ScoreValue color={getSeverityColor(item.severity)}>
                {item.score}
              </ScoreValue>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                Puntuación DASS
              </div>
              <SeverityBadge bg={styles.bg} color={styles.color}>
                {getSeverityText(item.severity)}
              </SeverityBadge>
            </ScoreCard>
          );
        })}
      </ScoreGrid>

      <TableContainer>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>
          Tabla de Interpretación DASS-21
        </h3>
        <TableHeader>
          <div>Severidad</div>
          <div style={{ textAlign: 'center' }}>Depresión</div>
          <div style={{ textAlign: 'center' }}>Ansiedad</div>
          <div style={{ textAlign: 'center' }}>Estrés</div>
        </TableHeader>

        <TableRow bg="#f0fdf4" borderColor="#bbf7d0">
          <div style={{ fontWeight: '600', color: '#166534' }}>Normal</div>
          <div style={{ textAlign: 'center' }}>0-9</div>
          <div style={{ textAlign: 'center' }}>0-7</div>
          <div style={{ textAlign: 'center' }}>0-14</div>
        </TableRow>
        <TableRow bg="#fefce8" borderColor="#fde047">
          <div style={{ fontWeight: '600', color: '#854d0e' }}>Leve</div>
          <div style={{ textAlign: 'center' }}>10-13</div>
          <div style={{ textAlign: 'center' }}>8-9</div>
          <div style={{ textAlign: 'center' }}>15-18</div>
        </TableRow>
        <TableRow bg="#fff7ed" borderColor="#fdba74">
          <div style={{ fontWeight: '600', color: '#9a3412' }}>Moderado</div>
          <div style={{ textAlign: 'center' }}>14-20</div>
          <div style={{ textAlign: 'center' }}>10-14</div>
          <div style={{ textAlign: 'center' }}>19-25</div>
        </TableRow>
        <TableRow bg="#fef2f2" borderColor="#fca5a5">
          <div style={{ fontWeight: '600', color: '#991b1b' }}>Grave</div>
          <div style={{ textAlign: 'center' }}>21-27</div>
          <div style={{ textAlign: 'center' }}>15-19</div>
          <div style={{ textAlign: 'center' }}>26-33</div>
        </TableRow>
        <TableRow bg="#faf5ff" borderColor="#d8b4fe">
          <div style={{ fontWeight: '600', color: '#6b21a8' }}>Extremadamente Grave</div>
          <div style={{ textAlign: 'center' }}>28+</div>
          <div style={{ textAlign: 'center' }}>20+</div>
          <div style={{ textAlign: 'center' }}>34+</div>
        </TableRow>

        <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
          <strong>Nota:</strong> Los puntajes mostrados son para la versión completa de 42 ítems.
          Para DASS-21 (21 ítems), se multiplico los puntajes por 2 antes de interpretar.
        </div>
      </TableContainer>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1e293b' }}>
          Recomendaciones Personalizadas
        </h2>
        {recommendations.map((rec: any, index: number) => (
          <RecommendationCard
            key={index}
            priority={rec.priority}
            onClick={() => {
              if (rec.type === 'exercise') navigate('/exercises');
              else if (rec.type === 'tip') navigate('/tips');
              else if (rec.type === 'group_chat') navigate('/chat');
              else if (rec.type === 'professional_help') navigate('/maps');
            }}
          >
            <div style={{
              fontWeight: '600',
              color: rec.priority === 'high' ? '#c53030' : rec.priority === 'medium' ? '#c05621' : '#475569',
              marginBottom: '4px',
              textTransform: 'capitalize',
              fontSize: '14px'
            }}>
              {rec.type.replace('_', ' ')}
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
              {rec.title}
            </h4>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>
              {rec.description}
            </p>
          </RecommendationCard>
        ))}
      </div>

      <Card style={{ marginBottom: '40px', background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px', color: '#1e293b' }}>
          ¿Qué te gustaría hacer ahora?
        </h3>
        <ActionGrid>
          {[
            { text: 'Ver Ejercicios', path: '/exercises', icon: '🧘', desc: 'Técnicas de relajación' },
            { text: 'Ver Consejos', path: '/tips', icon: '💡', desc: 'Tips de bienestar' },
            { text: 'Unirse a Grupos', path: '/chat', icon: '👥', desc: 'Comunidad de apoyo' },
            { text: 'Encontrar Ayuda', path: '/maps', icon: '🗺️', desc: 'Profesionales cercanos' },
            { text: 'Ir al Dashboard', path: '/dashboard', icon: '🏠', desc: 'Volver al inicio' }
          ].map((action, index) => (
            <ActionCard key={index} onClick={() => navigate(action.path)}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{action.icon}</div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>
                {action.text}
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {action.desc}
              </p>
            </ActionCard>
          ))}
        </ActionGrid>
      </Card>

      <div style={{
        background: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#92400e', marginBottom: '8px', fontSize: '16px' }}>Importante</h4>
        <p style={{ color: '#92400e', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
          Estos resultados son solo una evaluación preliminar y no reemplazan el diagnóstico profesional.
          Si experimentas síntomas graves o persistentes, te recomendamos buscar ayuda de un profesional de la salud mental calificado.
        </p>
      </div>
    </div>
  );
};

export default Results;