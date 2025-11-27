import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { exercisesAPI, Exercise, Category } from '../services/api';
import {
  PageContainer,
  GlassCard,
  PageTitle,
  CubeLoader,
  CubeSquare,
  LoadingText
} from './SharedStyles';

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ExerciseCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ExerciseIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  text-align: center;
`;

const ExerciseTitle = styled.h3`
  color: #2e7d32;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
`;

const ExerciseDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const ExerciseDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4caf50;
  font-weight: 500;
  font-size: 0.9rem;
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
  margin-top: 20px;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

const Exercises: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadExercises();
    loadCategories();
  }, []);

  const loadExercises = async () => {
    setIsLoadingData(true);
    try {
      const response = await exercisesAPI.getExercises();
      setExercises(response.exercises);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingData(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingData(true);
    try {
      const response = await exercisesAPI.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(exercise => exercise.category === selectedCategory);

  if (isLoading || isLoadingData) {
    return (
      <PageContainer>
        <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '60px 20px' }}>
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
          <LoadingText>Cargando ejercicios...</LoadingText>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GlassCard style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
        <PageTitle>Ejercicios de Salud Mental</PageTitle>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '10px 20px',
                border: `2px solid ${selectedCategory === category.id ? '#4caf50' : '#e9ecef'}`,
                borderRadius: '25px',
                background: selectedCategory === category.id ? '#4caf50' : 'white',
                color: selectedCategory === category.id ? 'white' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        <ExerciseGrid>
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise._id}
              onClick={() => navigate(`/exercise/${exercise._id}`)}
            >
              <ExerciseIcon>🧘</ExerciseIcon>
              <ExerciseTitle>{exercise.title}</ExerciseTitle>
              <ExerciseDescription>{exercise.description}</ExerciseDescription>
              <ExerciseDuration>
                ⏱️ {exercise.duration} minutos
              </ExerciseDuration>
              {exercise.media?.videoUrl && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ color: '#4caf50', fontSize: '0.8rem' }}>🎥 Video disponible</span>
                </div>
              )}
            </ExerciseCard>
          ))}
        </ExerciseGrid>

        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => navigate('/dashboard')}>
            ← Regresar al Dashboard
          </BackButton>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Exercises;