import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  font-size: 32px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 18px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #f0f0f0;
`;

const CardTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;

const ScoreDisplay = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ScoreNumber = styled.div<{ severity: string }>`
  font-size: 48px;
  font-weight: bold;
  color: ${props => {
    switch (props.severity) {
      case 'normal': return '#28a745';
      case 'mild': return '#ffc107';
      case 'moderate': return '#fd7e14';
      case 'severe': return '#dc3545';
      case 'extremely_severe': return '#6f42c1';
      default: return '#6c757d';
    }
  }};
  margin-bottom: 10px;
`;

const ScoreLabel = styled.div`
  font-size: 16px;
  color: #666;
  text-transform: capitalize;
`;

const SeverityBadge = styled.div<{ severity: string }>`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.severity) {
      case 'normal': return '#d4edda';
      case 'mild': return '#fff3cd';
      case 'moderate': return '#ffeaa7';
      case 'severe': return '#f8d7da';
      case 'extremely_severe': return '#e2e3e5';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.severity) {
      case 'normal': return '#155724';
      case 'mild': return '#856404';
      case 'moderate': return '#856404';
      case 'severe': return '#721c24';
      case 'extremely_severe': return '#383d41';
      default: return '#6c757d';
    }
  }};
`;

const RecommendationsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const RecommendationsTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
`;

const RecommendationList = styled.div`
  display: grid;
  gap: 15px;
`;

const RecommendationItem = styled.div<{ priority: string }>`
  background: ${props => {
    switch (props.priority) {
      case 'high': return '#fff5f5';
      case 'medium': return '#fffbf0';
      case 'low': return '#f8f9fa';
      default: return '#f8f9fa';
    }
  }};
  border: 1px solid ${props => {
    switch (props.priority) {
      case 'high': return '#fed7d7';
      case 'medium': return '#feebc8';
      case 'low': return '#e9ecef';
      default: return '#e9ecef';
    }
  }};
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      case 'low': return '#718096';
      default: return '#718096';
    }
  }};
`;

const RecommendationType = styled.div`
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
  text-transform: capitalize;
`;

const RecommendationTitle = styled.h4`
  color: #333;
  margin-bottom: 8px;
  font-size: 18px;
`;

const RecommendationDescription = styled.p`
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const ActionsSection = styled.div`
  text-align: center;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 10px 10px 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Disclaimer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  text-align: center;
`;

const DisclaimerTitle = styled.h4`
  color: #856404;
  margin-bottom: 10px;
`;

const DisclaimerText = styled.p`
  color: #856404;
  margin: 0;
  line-height: 1.5;
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
    const texts = {
      normal: 'Normal',
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Severo',
      extremely_severe: 'Extremadamente Severo'
    };
    return texts[severity as keyof typeof texts] || severity;
  };

  return (
    <Container>
      <Header>
        <Title>Tus Resultados</Title>
        <Subtitle>Evaluación completada el {new Date(result.createdAt).toLocaleDateString('es-ES')}</Subtitle>
      </Header>

      <ResultsGrid>
        <ResultCard>
          <CardTitle>Depresión</CardTitle>
          <ScoreDisplay>
            <ScoreNumber severity={severityLevels.depression}>
              {scores.depression}
            </ScoreNumber>
            <ScoreLabel>Puntuación DASS</ScoreLabel>
          </ScoreDisplay>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <SeverityBadge severity={severityLevels.depression}>
              {getSeverityText(severityLevels.depression)}
            </SeverityBadge>
          </div>
        </ResultCard>

        <ResultCard>
          <CardTitle>Ansiedad</CardTitle>
          <ScoreDisplay>
            <ScoreNumber severity={severityLevels.anxiety}>
              {scores.anxiety}
            </ScoreNumber>
            <ScoreLabel>Puntuación DASS</ScoreLabel>
          </ScoreDisplay>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <SeverityBadge severity={severityLevels.anxiety}>
              {getSeverityText(severityLevels.anxiety)}
            </SeverityBadge>
          </div>
        </ResultCard>

        <ResultCard>
          <CardTitle>Estrés</CardTitle>
          <ScoreDisplay>
            <ScoreNumber severity={severityLevels.stress}>
              {scores.stress}
            </ScoreNumber>
            <ScoreLabel>Puntuación DASS</ScoreLabel>
          </ScoreDisplay>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <SeverityBadge severity={severityLevels.stress}>
              {getSeverityText(severityLevels.stress)}
            </SeverityBadge>
          </div>
        </ResultCard>
      </ResultsGrid>

      <RecommendationsSection>
        <RecommendationsTitle>Recomendaciones Personalizadas</RecommendationsTitle>
        <RecommendationList>
          {recommendations.map((rec: any, index: number) => (
            <RecommendationItem key={index} priority={rec.priority}>
              <RecommendationType>{rec.type.replace('_', ' ')}</RecommendationType>
              <RecommendationTitle>{rec.title}</RecommendationTitle>
              <RecommendationDescription>{rec.description}</RecommendationDescription>
            </RecommendationItem>
          ))}
        </RecommendationList>
      </RecommendationsSection>

      <ActionsSection>
        <ActionButton onClick={() => navigate('/exercises')}>
          Ver Ejercicios
        </ActionButton>
        <ActionButton onClick={() => navigate('/tips')}>
          Ver Consejos
        </ActionButton>
        <ActionButton onClick={() => navigate('/chat')}>
          Unirse a Grupos
        </ActionButton>
        <ActionButton onClick={() => navigate('/maps')}>
          Encontrar Ayuda
        </ActionButton>
      </ActionsSection>

      <Disclaimer>
        <DisclaimerTitle>Importante</DisclaimerTitle>
        <DisclaimerText>
          Estos resultados son solo una evaluación preliminar y no reemplazan el diagnóstico profesional.
          Si experimentas síntomas graves o persistentes, te recomendamos buscar ayuda de un profesional de la salud mental calificado.
        </DisclaimerText>
      </Disclaimer>
    </Container>
  );
};

export default Results;