import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { exercisesAPI, Exercise } from '../services/api';

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

const Duration = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4caf50;
  font-weight: 600;
  font-size: 1.1rem;
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

const InstructionsTitle = styled.h2`
  color: #2e7d32;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const InstructionsList = styled.ol`
  padding-left: 20px;
  margin-bottom: 30px;
`;

const InstructionItem = styled.li`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.6;
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
        setExercise(response.exercise);
      } catch (error) {
        console.error('Failed to load exercise:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  if (isLoading) {
    return (
      <Container>
        <Card>
          <ContentSection>
            <Title>Cargando ejercicio...</Title>
          </ContentSection>
        </Card>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container>
        <Card>
          <ContentSection>
            <Title>Ejercicio no encontrado</Title>
            <BackButton onClick={() => navigate('/exercises')}>
              ← Regresar a Ejercicios
            </BackButton>
          </ContentSection>
        </Card>
      </Container>
    );
  }

  // Mock data for instructions and benefits - in a real app, this would come from the API
  const mockInstructions = exercise.instructions?.map(inst => inst.text) || [
    'Siéntate cómodamente con la espalda recta.',
    'Respira profundamente por la nariz.',
    'Mantén la atención en tu respiración.',
    'Si tu mente divaga, regresa gentilmente a la respiración.'
  ];

  const mockBenefits = exercise.benefits || [
    'Reduce el estrés y la ansiedad',
    'Mejora la concentración',
    'Promueve la relajación',
    'Aumenta la consciencia plena'
  ];

  return (
    <Container>
      <Card>
        <ContentSection>
          <Title>{exercise.title}</Title>

          <MetaInfo>
            <Duration>
              <span>⏱️</span>
              {exercise.duration}
            </Duration>
            <Category>{exercise.category}</Category>
          </MetaInfo>

          <Description>{exercise.description}</Description>

          <InstructionsTitle>Instrucciones paso a paso:</InstructionsTitle>
          <InstructionsList>
            {mockInstructions.map((instruction, index) => (
              <InstructionItem key={index}>{instruction}</InstructionItem>
            ))}
          </InstructionsList>

          <BenefitsTitle>Beneficios:</BenefitsTitle>
          <BenefitsList>
            {mockBenefits.map((benefit, index) => (
              <BenefitItem key={index}>{benefit}</BenefitItem>
            ))}
          </BenefitsList>

          <BackButton onClick={() => navigate('/exercises')}>
            ← Regresar a Ejercicios
          </BackButton>
        </ContentSection>

        <VideoSection>
          <VideoContainer>
            <VideoTitle>Video Tutorial</VideoTitle>
            <VideoFrame
              src={`https://www.youtube.com/embed/${exercise.media?.videoUrl || 'dQw4w9WgXcQ'}`}
              title={`${exercise.title} - Tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoContainer>
        </VideoSection>
      </Card>
    </Container>
  );
};

export default ExerciseDetail;