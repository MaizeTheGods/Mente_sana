import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from './SharedStyles';

const PageContainer = styled.div`
  margin: -30px; /* Negate the MainContent padding to go full bleed */
  min-height: calc(100vh);
  background: #0f172a; /* Dark background similar to image */
  color: #f8fafc;
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: -20px;
    padding: 24px;
    padding-top: max(80px, calc(40px + env(safe-area-inset-top)));
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 10;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(46, 125, 50, 0.2);
  color: #4ade80;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
  border: 1px solid rgba(46, 125, 50, 0.3);
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  color: #ffffff;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 480px;
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  font-size: 16px;
  padding: 14px 28px;
  border-radius: 100px;
`;

const SecondaryButton = styled(Button)`
  font-size: 16px;
  padding: 14px 28px;
  border-radius: 100px;
  background: transparent;
  color: white;
  border: 1px solid #475569;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #64748b;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 24px;
  flex: 1;
  min-width: 140px;
  backdrop-filter: blur(10px);

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.4;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
`;

const HeroCard = styled.div`
  background: linear-gradient(to bottom, #1e293b, #0f172a);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  aspect-ratio: 4/3;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;

  /* Image background overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=800&q=80');
    background-size: cover;
    background-position: center;
    opacity: 0.4;
    z-index: 0;
  }

  /* Gradient overlay for text readability */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, #0f172a 0%, transparent 60%);
    z-index: 1;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;

  span {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 12px;
    backdrop-filter: blur(4px);
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 12px 0;
    line-height: 1.2;
  }

  p {
    font-size: 14px;
    color: #cbd5e1;
    margin: 0;
    line-height: 1.5;
    max-width: 90%;
  }
`;

const RecommendationCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  .icon {
    width: 48px;
    height: 48px;
    background: #1e293b;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .text-content {
    flex: 1;

    .label {
      font-size: 12px;
      color: #4ade80;
      font-weight: 600;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h4 {
      font-size: 16px;
      color: #ffffff;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
    }
  }
`;

// Soft glow blobs for atmospheric effect
const GlowBlob = styled.div<{ color: string, top: string, right?: string, left?: string }>`
  position: absolute;
  top: ${props => props.top};
  ${props => props.right && `right: ${props.right};`}
  ${props => props.left && `left: ${props.left};`}
  width: 400px;
  height: 400px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
`;

const Inicio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <GlowBlob color="#2e7d32" top="-100px" right="-100px" />
      <GlowBlob color="#3b82f6" top="40%" left="-150px" />

      <ContentGrid>
        <LeftSection>
          <Badge>✨ Plataforma juvenil de bienestar emocional</Badge>
          <Title>
            Tu espacio cool<br />
            para sentirte<br />
            mejor
          </Title>
          <Description>
            Ágora reúne tests, ejercicios, blog, apoyo seguro, juegos mentales y recursos de ayuda en una pantalla moderna, brillante y pensada para ti.
          </Description>

          <ButtonRow>
            <PrimaryButton onClick={() => navigate('/blog')}>
              Explorar Ágora
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/dashboard')}>
              Ver herramientas
            </SecondaryButton>
          </ButtonRow>

          <StatsRow>
            <StatCard>
              <h3>+7</h3>
              <p>categorías activas</p>
            </StatCard>
            <StatCard>
              <h3>100%</h3>
              <p>juvenil y accesible</p>
            </StatCard>
            <StatCard>
              <h3>24/7</h3>
              <p>contenido disponible</p>
            </StatCard>
          </StatsRow>
        </LeftSection>

        <RightSection>
          <HeroCard>
            <CardContent>
              <span>Banner interactivo</span>
              <h2>Respira, siente y avanza</h2>
              <p>Una experiencia digital creada para apoyar tu bienestar emocional con herramientas reales, contenido visual y acompañamiento juvenil.</p>
            </CardContent>
          </HeroCard>

          <RecommendationCard onClick={() => navigate('/blog')}>
            <div className="icon">📖</div>
            <div className="text-content">
              <div className="label">
                <span style={{ fontSize: '10px' }}>🟢</span> Auri te recomienda
              </div>
              <h4>Blog informativo</h4>
              <p>Temas de autoestima, relaciones, hábitos y salud mental.</p>
            </div>
          </RecommendationCard>
        </RightSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default Inicio;
