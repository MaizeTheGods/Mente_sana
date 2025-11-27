import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { tipsAPI, Tip } from '../services/api';
import { CubeLoader, CubeSquare, LoadingText } from './SharedStyles';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const VideoSection = styled.div`
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const Title = styled.h1`
  color: #2e7d32;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Category = styled.div`
  background: #4caf50;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Description = styled.p`
  color: #555;
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: 30px;
`;

const WhyTitle = styled.h2`
  color: #2e7d32;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const WhyText = styled.p`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const HowTitle = styled.h3`
  color: #2e7d32;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const HowList = styled.ol`
  padding-left: 20px;
  margin-bottom: 30px;
`;

const HowItem = styled.li`
  color: #444;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 12px;
  padding-left: 8px;

  &::marker {
    color: #4caf50;
    font-weight: bold;
  }
`;

const BenefitsTitle = styled.h3`
  color: #2e7d32;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const BenefitsList = styled.ul`
  padding-left: 20px;
  margin-bottom: 30px;
`;

const BenefitItem = styled.li`
  color: #444;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 8px;

  &::marker {
    color: #4caf50;
  }
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
  align-self: flex-start;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

const VideoContainer = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
`;

const VideoTitle = styled.h3`
  color: #2e7d32;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 225px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tip, setTip] = useState<Tip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const loadTip = async () => {
      console.log('💡 TipDetail: Starting to load tip with ID:', id);

      if (!id) {
        console.log('💡 TipDetail: No ID provided, returning early');
        setIsLoading(false);
        return;
      }

      setIsLoadingData(true);
      try {
        console.log('💡 TipDetail: Calling tipsAPI.getTip with ID:', id);
        const response = await tipsAPI.getTip(id);
        console.log('💡 TipDetail: API response received:', response);

        if (response && response.tip) {
          console.log('💡 TipDetail: Tip data loaded successfully:', response.tip);
          setTip(response.tip);
        } else {
          console.log('💡 TipDetail: No tip data in response');
        }
      } catch (error) {
        console.error('💡 TipDetail: Failed to load tip:', error);
        console.error('💡 TipDetail: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown error type'
        });
      } finally {
        console.log('💡 TipDetail: Setting loading to false');
        setIsLoading(false);
        setIsLoadingData(false);
      }
    };

    loadTip();
  }, [id]);

  if (isLoading || isLoadingData) {
    return (
      <Container>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '60px 20px' }}>
          <CubeLoader>
            <CubeSquare delay={0} />
            <CubeSquare delay={1} />
            <CubeSquare delay={2} />
            <CubeSquare delay={3} />
            <CubeSquare delay={4} />
            <CubeSquare delay={5} />
            <CubeSquare delay={6} />
            <CubeSquare delay={7} />
          </CubeLoader>
          <LoadingText>Cargando consejo...</LoadingText>
        </Card>
      </Container>
    );
  }

  if (!tip) {
    return (
      <Container>
        <Card>
          <ContentSection>
            <Title>Consejo no encontrado</Title>
            <BackButton onClick={() => navigate('/tips')}>
              ← Regresar a Consejos
            </BackButton>
          </ContentSection>
        </Card>
      </Container>
    );
  }

  // Mock data for how and benefits - in a real app, this would come from the API
  const mockHow = [
    'Identifica situaciones donde puedes aplicar este consejo.',
    'Practica el consejo en momentos de calma.',
    'Integra el consejo gradualmente en tu rutina diaria.',
    'Reflexiona sobre los resultados y ajusta según sea necesario.'
  ];

  const mockBenefits = [
    'Mejora tu bienestar emocional',
    'Desarrolla hábitos saludables',
    'Aumenta tu resiliencia',
    'Mejora tu calidad de vida'
  ];


  return (
    <Container>
      <Card>
        <ContentSection>
          <Title>{tip.title}</Title>

          <MetaInfo>
            <Category>{tip.category}</Category>
          </MetaInfo>

          <Description>{tip.content}</Description>

          <WhyTitle>¿Por qué es importante?</WhyTitle>
          <WhyText>{tip.why || 'Este consejo es importante porque te ayuda a desarrollar hábitos saludables que mejoran tu bienestar emocional.'}</WhyText>

          <HowTitle>Cómo practicarlo:</HowTitle>
          <HowList>
            {mockHow.map((step, index) => (
              <HowItem key={index}>{step}</HowItem>
            ))}
          </HowList>

          <BenefitsTitle>Beneficios:</BenefitsTitle>
          <BenefitsList>
            {mockBenefits.map((benefit, index) => (
              <BenefitItem key={index}>{benefit}</BenefitItem>
            ))}
          </BenefitsList>

          <BackButton onClick={() => navigate('/tips')}>
            ← Regresar a Consejos
          </BackButton>
        </ContentSection>

        <VideoSection>
          <VideoContainer>
            <VideoTitle>Video Explicativo</VideoTitle>
            <VideoFrame
              src={`https://www.youtube.com/embed/${tip.media?.videoUrl || 'dQw4w9WgXcQ'}`}
              title={`${tip.title} - Tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoContainer>
        </VideoSection>
      </Card>
    </Container>
  );
};

export default TipDetail;