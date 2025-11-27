import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { exercisesAPI, Exercise, Category } from '../services/api';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  Badge,
  Button
} from './SharedStyles';
import Loader from './Loader';

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ExerciseCard = styled(Card)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e2e8f0;
  
  &:hover {
    border-color: #2e7d32;
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const ExerciseTitle = styled.h3`
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ExerciseDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DurationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 16px;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.active ? '#2e7d32' : '#e2e8f0'};
  background: ${props => props.active ? '#e8f5e9' : 'white'};
  color: ${props => props.active ? '#2e7d32' : '#64748b'};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#e8f5e9' : '#f8fafc'};
  }
`;

const Exercises: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exercisesRes, catsRes] = await Promise.all([
          exercisesAPI.getExercises(),
          exercisesAPI.getCategories()
        ]);
        setExercises(exercisesRes.exercises);
        setCategories(catsRes.categories);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
        <Loader />
        <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginTop: '20px' }}>Cargando ejercicios...</div>
      </div>
    );
  }

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(exercise => exercise.category === selectedCategory);

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Ejercicios de Salud Mental</PageTitle>
          <PageSubtitle>Prácticas guiadas para tu bienestar emocional</PageSubtitle>
        </div>
      </PageHeader>

      <CategoryFilter>
        <FilterButton
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        >
          Todos
        </FilterButton>
        {categories.map(cat => (
          <FilterButton
            key={cat.id}
            active={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </FilterButton>
        ))}
      </CategoryFilter>

      <ExerciseGrid>
        {filteredExercises.map(exercise => (
          <ExerciseCard key={exercise._id} onClick={() => navigate(`/exercise/${exercise._id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Badge bg="#fef3c7" color="#d97706">
                {categories.find(c => c.id === exercise.category)?.label || exercise.category}
              </Badge>
              {exercise.media?.videoUrl && <span>🎥</span>}
            </div>
            <ExerciseTitle>{exercise.title}</ExerciseTitle>
            <DurationBadge>
              <span>⏱️</span> {exercise.duration} minutos
            </DurationBadge>
            <ExerciseDescription>{exercise.description}</ExerciseDescription>
            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <Button variant="outline" style={{ width: '100%', fontSize: '13px' }}>
                Comenzar Ejercicio
              </Button>
            </div>
          </ExerciseCard>
        ))}
      </ExerciseGrid>
    </div>
  );
};

export default Exercises;