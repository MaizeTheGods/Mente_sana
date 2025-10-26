import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  text-align: center;
  color: #2e7d32;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

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
  const navigate = useNavigate();

  const exerciseCategories = [
    { id: 'all', label: 'Todos', icon: '🧘' },
    { id: 'breathing', label: 'Respiración', icon: '🫁' },
    { id: 'meditation', label: 'Meditación', icon: '🧘' },
    { id: 'relaxation', label: 'Relajación', icon: '😌' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🌸' }
  ];

  const exercises = [
    {
      id: 1,
      title: 'Respiración 4-7-8',
      description: 'Técnica de respiración profunda que ayuda a reducir la ansiedad y promover el sueño reparador.',
      duration: '5 minutos',
      category: 'breathing',
      icon: '🫁',
      instructions: [
        'Siéntate cómodamente con la espalda recta',
        'Inhala por la nariz durante 4 segundos',
        'Retén la respiración por 7 segundos',
        'Exhala por la boca durante 8 segundos',
        'Repite el ciclo 4 veces'
      ]
    },
    {
      id: 2,
      title: 'Meditación Mindfulness',
      description: 'Práctica de atención plena para estar presente en el momento y reducir el estrés diario.',
      duration: '10 minutos',
      category: 'meditation',
      icon: '🧘',
      instructions: [
        'Siéntate en un lugar tranquilo',
        'Cierra los ojos y enfócate en tu respiración',
        'Observa tus pensamientos sin juzgarlos',
        'Cuando te distraigas, regresa suavemente a tu respiración',
        'Continúa por el tiempo establecido'
      ]
    },
    {
      id: 3,
      title: 'Relajación Muscular Progresiva',
      description: 'Técnica que reduce la tensión muscular y ayuda a liberar el estrés acumulado en el cuerpo.',
      duration: '15 minutos',
      category: 'relaxation',
      icon: '😌',
      instructions: [
        'Túmbate cómodamente en una superficie plana',
        'Comienza por los pies: tense los músculos por 5 segundos',
        'Libera la tensión lentamente',
        'Continúa con las piernas, abdomen, brazos y rostro',
        'Respira profundamente durante todo el proceso'
      ]
    },
    {
      id: 4,
      title: 'Escaneo Corporal',
      description: 'Práctica de mindfulness que conecta mente y cuerpo, ideal para reducir la ansiedad.',
      duration: '20 minutos',
      category: 'mindfulness',
      icon: '🌸',
      instructions: [
        'Túmbate cómodamente con los ojos cerrados',
        'Dirige tu atención a los dedos de los pies',
        'Observa las sensaciones sin juzgar',
        'Continúa moviendo tu atención hacia arriba',
        'Termina enfocándote en la respiración'
      ]
    },
    {
      id: 5,
      title: 'Respiración Abdominal',
      description: 'Ejercicio básico de respiración que ayuda a activar el sistema nervioso parasimpático.',
      duration: '3 minutos',
      category: 'breathing',
      icon: '🫁',
      instructions: [
        'Coloca una mano en el abdomen',
        'Inhala lentamente por la nariz, sintiendo como se expande el abdomen',
        'Exhala por la boca o nariz, sintiendo como se contrae',
        'Mantén un ritmo constante y relajado',
        'Practica por varios minutos'
      ]
    },
    {
      id: 6,
      title: 'Meditación Guiada para Ansiedad',
      description: 'Sesión guiada específicamente diseñada para personas que experimentan ansiedad frecuente.',
      duration: '12 minutos',
      category: 'meditation',
      icon: '🧘',
      instructions: [
        'Siéntate cómodamente en un lugar tranquilo',
        'Cierra los ojos y escucha las instrucciones',
        'Sigue las visualizaciones guiadas',
        'Permite que las emociones fluyan naturalmente',
        'Termina con una respiración profunda'
      ]
    }
  ];

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(exercise => exercise.category === selectedCategory);

  return (
    <Container>
      <Card>
        <Title>Ejercicios de Salud Mental</Title>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {exerciseCategories.map(category => (
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
              key={exercise.id}
              onClick={() => navigate(`/exercise/${exercise.id}`)}
            >
              <ExerciseIcon>{exercise.icon}</ExerciseIcon>
              <ExerciseTitle>{exercise.title}</ExerciseTitle>
              <ExerciseDescription>{exercise.description}</ExerciseDescription>
              <ExerciseDuration>
                ⏱️ {exercise.duration}
              </ExerciseDuration>
            </ExerciseCard>
          ))}
        </ExerciseGrid>

        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => window.history.back()}>
            ← Regresar al Dashboard
          </BackButton>
        </div>
      </Card>
    </Container>
  );
};

export default Exercises;