import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { tipsAPI, Tip } from '../services/api';
import {
  PageHeader,
  PageTitle,
  Card,
  Button,
  CubeLoader,
  CubeSquare,
  LoadingText
} from './SharedStyles';
import { extractYoutubeId } from '../utils/youtubeUtils';

const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled(Card)`
  padding: 32px;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SidebarCard = styled(Card)`
  padding: 24px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.div`
  background: #dcfce7;
  color: #166534;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const Description = styled.p`
  color: #475569;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 24px;
    background: #2e7d32;
    border-radius: 2px;
  }
`;

const StepsList = styled.ol`
  padding-left: 20px;
  margin-bottom: 32px;
`;

const StepItem = styled.li`
  color: #334155;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 12px;
  padding-left: 8px;

  &::marker {
    color: #2e7d32;
    font-weight: 700;
  }
`;

const BenefitsList = styled.ul`
  padding-left: 20px;
  margin-bottom: 0;
`;

const BenefitItem = styled.li`
  color: #334155;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 8px;

  &::marker {
    color: #2e7d32;
  }
`;

const VideoContainer = styled.div`
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  aspect-ratio: 16/9;
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const WhyText = styled.div`
  background: #f0fdf4;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #2e7d32;
  color: #334155;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const TipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tip, setTip] = useState<Tip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTip = async () => {
      if (!id) return;
      try {
        const response = await tipsAPI.getTip(id);
        if (response && response.tip) {
          setTip(response.tip);
        }
      } catch (error) {
        console.error('Failed to load tip:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTip();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
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
      </div>
    );
  }

  if (!tip) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Consejo no encontrado</h2>
        <Button onClick={() => navigate('/tips')}>
          Regresar a Consejos
        </Button>
      </div>
    );
  }

  // Mock data for how and benefits if missing
  const howToSteps = [
    'Identifica situaciones donde puedes aplicar este consejo.',
    'Practica el consejo en momentos de calma.',
    'Integra el consejo gradualmente en tu rutina diaria.',
    'Reflexiona sobre los resultados y ajusta según sea necesario.'
  ];

  const benefits = [
    'Mejora tu bienestar emocional',
    'Desarrolla hábitos saludables',
    'Aumenta tu resiliencia',
    'Mejora tu calidad de vida'
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="outline" onClick={() => navigate('/tips')} style={{ padding: '8px 12px' }}>
            ←
          </Button>
          <PageTitle>{tip.title}</PageTitle>
        </div>
      </PageHeader>

      <DetailLayout>
        <MainContent>
          <MetaInfo>
            <CategoryBadge>{tip.category}</CategoryBadge>
          </MetaInfo>

          <Description>{tip.content}</Description>

          <SectionTitle>¿Por qué es importante?</SectionTitle>
          <WhyText>
            {tip.why || 'Este consejo es importante porque te ayuda a desarrollar hábitos saludables que mejoran tu bienestar emocional.'}
          </WhyText>

          <SectionTitle>Cómo practicarlo</SectionTitle>
          <StepsList>
            {howToSteps.map((step, index) => (
              <StepItem key={index}>{step}</StepItem>
            ))}
          </StepsList>

          <SectionTitle>Beneficios</SectionTitle>
          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index}>{benefit}</BenefitItem>
            ))}
          </BenefitsList>
        </MainContent>

        <SidebarContent>
          <SidebarCard>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
              Video Explicativo
            </h3>
            <VideoContainer>
              <VideoFrame
                src={`https://www.youtube-nocookie.com/embed/${extractYoutubeId(tip.media?.videoUrl)}`}
                title={`${tip.title} - Tutorial`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </VideoContainer>
          </SidebarCard>

          <SidebarCard>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>
              Recuerda
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              La práctica constante de pequeños hábitos positivos puede tener un gran impacto en tu salud mental a largo plazo.
            </p>
          </SidebarCard>
        </SidebarContent>
      </DetailLayout>
    </div>
  );
};

export default TipDetail;