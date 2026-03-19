import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { exercisesAPI, Exercise } from '../services/api';
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

const DurationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  font-weight: 600;
  font-size: 14px;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
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

const InstructionsList = styled.ol`
  padding-left: 20px;
  margin-bottom: 32px;
`;

const InstructionItem = styled.li`
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

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExercise = async () => {
      if (!id) return;
      try {
        const response = await exercisesAPI.getExercise(id);
        if (response && response.exercise) {
          setExercise(response.exercise);
        }
      } catch (error) {
        // Exercise load error silently handled for cleaner debugging per user request
      } finally {
        setIsLoading(false);
      }
    };
    loadExercise();
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
        <LoadingText>Cargando ejercicio...</LoadingText>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Ejercicio no encontrado</h2>
        <Button onClick={() => navigate('/exercises')}>
          Regresar a Ejercicios
        </Button>
      </div>
    );
  }

  // Mock data for instructions and benefits if missing
  const instructions = exercise.instructions?.length ? exercise.instructions.map(i => i.text) : [
    'Siéntate cómodamente con la espalda recta.',
    'Respira profundamente por la nariz.',
    'Mantén la atención en tu respiración.',
    'Si tu mente divaga, regresa gentilmente a la respiración.'
  ];

  const benefits = exercise.benefits?.length ? exercise.benefits : [
    'Reduce el estrés y la ansiedad',
    'Mejora la concentración',
    'Promueve la relajación',
    'Aumenta la consciencia plena'
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="outline" onClick={() => navigate('/exercises')} style={{ padding: '8px 12px' }}>
            ←
          </Button>
          <PageTitle>{exercise.title}</PageTitle>
        </div>
      </PageHeader>

      <DetailLayout>
        <MainContent>
          <MetaInfo>
            <CategoryBadge>{exercise.category}</CategoryBadge>
            <DurationBadge>⏱️ {exercise.duration} min</DurationBadge>
          </MetaInfo>

          <Description>{exercise.description}</Description>

          <SectionTitle>Instrucciones paso a paso</SectionTitle>
          <InstructionsList>
            {instructions.map((instruction, index) => (
              <InstructionItem key={index}>{instruction}</InstructionItem>
            ))}
          </InstructionsList>

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
              Video Tutorial
            </h3>
            <VideoContainer>
              {exercise.media?.videoUrl ? (
                <VideoFrame
                  src={`https://www.youtube.com/embed/${extractYoutubeId(exercise.media.videoUrl)}`}
                  title={`${exercise.title} - Tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748b',
                  fontSize: '16px',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>
                    🎥
                  </div>
                  <p>No hay video tutorial disponible</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Sigue las instrucciones paso a paso
                  </p>
                </div>
              )}
            </VideoContainer>
          </SidebarCard>

          <SidebarCard>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>
              Consejo Rápido
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              Practica este ejercicio diariamente para obtener mejores resultados. La constancia es clave para el bienestar mental.
            </p>
          </SidebarCard>
        </SidebarContent>
      </DetailLayout>
    </div>
  );
};

export default ExerciseDetail;