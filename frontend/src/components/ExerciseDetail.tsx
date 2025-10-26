import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

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

  // Mock data - in a real app, this would come from an API
  const exercises = [
    {
      id: 1,
      title: 'Respiración 4-7-8',
      description: 'La técnica de respiración 4-7-8 es un ejercicio de respiración profunda desarrollado por el Dr. Andrew Weil. Esta técnica ayuda a reducir la ansiedad, promover el sueño reparador y calmar el sistema nervioso. Es especialmente útil para personas que sufren de insomnio o estrés crónico.',
      duration: '5 minutos',
      category: 'Respiración',
      icon: '🫁',
      instructions: [
        'Siéntate cómodamente con la espalda recta en una silla o almohada en el suelo.',
        'Coloca la punta de la lengua en el paladar superior, justo detrás de los dientes frontales.',
        'Exhala completamente por la boca, haciendo un sonido de "whoosh".',
        'Inhala silenciosamente por la nariz durante 4 segundos.',
        'Retén la respiración durante 7 segundos.',
        'Exhala completamente por la boca durante 8 segundos, haciendo el sonido de "whoosh".',
        'Repite el ciclo 4 veces.'
      ],
      benefits: [
        'Reduce la ansiedad y el estrés',
        'Ayuda a conciliar el sueño más rápidamente',
        'Mejora la concentración y el enfoque',
        'Regula el sistema nervioso autónomo',
        'Puede practicarse en cualquier momento y lugar'
      ],
      videoId: '4bB49F5GZsw'
    },
    {
      id: 2,
      title: 'Meditación Mindfulness',
      description: 'La meditación mindfulness, o atención plena, es una práctica que consiste en prestar atención al momento presente de manera intencional y sin juzgar. Esta técnica ayuda a desarrollar una mayor consciencia de nuestros pensamientos, emociones y sensaciones corporales.',
      duration: '10 minutos',
      category: 'Meditación',
      icon: '🧘',
      instructions: [
        'Siéntate en un lugar tranquilo donde no te interrumpan.',
        'Adopta una postura cómoda con la espalda recta.',
        'Cierra los ojos suavemente o mantén una mirada suave hacia abajo.',
        'Enfócate en tu respiración natural - siente como el aire entra y sale.',
        'Cuando tu mente divague (como sucederá), gentilmente regresa tu atención a la respiración.',
        'Observa tus pensamientos sin juzgarlos, como nubes pasando por el cielo.',
        'Continúa por el tiempo establecido, terminando con una respiración profunda.'
      ],
      benefits: [
        'Reduce el estrés y la ansiedad',
        'Mejora la concentración y la claridad mental',
        'Aumenta la capacidad de manejar emociones difíciles',
        'Mejora la calidad del sueño',
        'Desarrolla mayor resiliencia emocional'
      ],
      videoId: 'ZToicYcHwb4'
    },
    {
      id: 3,
      title: 'Relajación Muscular Progresiva',
      description: 'La relajación muscular progresiva es una técnica desarrollada por Edmund Jacobson que consiste en tensar y relajar grupos musculares específicos del cuerpo. Esta práctica ayuda a liberar la tensión acumulada y reduce los niveles de estrés.',
      duration: '15 minutos',
      category: 'Relajación',
      icon: '😌',
      instructions: [
        'Túmbate cómodamente en una superficie plana o siéntate en una silla cómoda.',
        'Comienza por los pies: tense los músculos de los dedos y el arco del pie durante 5 segundos.',
        'Libera la tensión lentamente, sintiendo como los músculos se relajan.',
        'Continúa con las pantorrillas, tensando durante 5 segundos y relajando.',
        'Sigue con los muslos, glúteos, abdomen, pecho, brazos, cuello y rostro.',
        'Respira profundamente durante todo el proceso.',
        'Termina con una respiración profunda y abre los ojos lentamente.'
      ],
      benefits: [
        'Reduce la tensión muscular crónica',
        'Ayuda con dolores de cabeza tensionales',
        'Mejora la calidad del sueño',
        'Reduce la ansiedad y el estrés',
        'Aumenta la consciencia corporal'
      ],
      videoId: 't2VVo6Nn4Vo'
    },
    {
      id: 4,
      title: 'Escaneo Corporal',
      description: 'El escaneo corporal es una práctica de mindfulness que implica dirigir la atención de manera sistemática a diferentes partes del cuerpo. Esta técnica ayuda a desarrollar una mayor consciencia corporal y a identificar áreas de tensión.',
      duration: '20 minutos',
      category: 'Mindfulness',
      icon: '🌸',
      instructions: [
        'Túmbate cómodamente en el suelo con los ojos cerrados.',
        'Comienza dirigiendo tu atención a los dedos de los pies.',
        'Observa cualquier sensación sin juzgar: calor, frío, cosquilleo, tensión.',
        'Respira en esa área por unos momentos, permitiendo que se relaje naturalmente.',
        'Continúa moviendo tu atención hacia arriba: pies, tobillos, pantorrillas, rodillas, etc.',
        'Si encuentras áreas de tensión, respira en ellas hasta que se relajen.',
        'Termina enfocándote en tu respiración general y abre los ojos lentamente.'
      ],
      benefits: [
        'Desarrolla mayor consciencia corporal',
        'Identifica y libera tensiones acumuladas',
        'Reduce el estrés y la ansiedad',
        'Mejora la conexión mente-cuerpo',
        'Ayuda con problemas de sueño'
      ],
      videoId: 'HzS8vhA8Vcw'
    },
    {
      id: 5,
      title: 'Respiración Abdominal',
      description: 'La respiración abdominal, también conocida como respiración diafragmática, es una técnica básica pero poderosa que activa el sistema nervioso parasimpático, promoviendo la relajación y reduciendo el estrés.',
      duration: '3 minutos',
      category: 'Respiración',
      icon: '🫁',
      instructions: [
        'Túmbate cómodamente o siéntate con la espalda recta.',
        'Coloca una mano en el abdomen y otra en el pecho.',
        'Inhala lentamente por la nariz, permitiendo que el abdomen se expanda.',
        'Siente como el diafragma baja y el abdomen se eleva (la mano del pecho debe moverse mínimamente).',
        'Exhala lentamente por la nariz o boca, sintiendo como el abdomen se contrae.',
        'Mantén un ritmo constante y relajado.',
        'Practica por varios minutos, enfocándote en la sensación de calma.'
      ],
      benefits: [
        'Activa el sistema nervioso parasimpático',
        'Reduce la frecuencia cardíaca y la presión arterial',
        'Mejora la oxigenación de los tejidos',
        'Reduce el estrés y la ansiedad',
        'Puede practicarse en cualquier momento'
      ],
      videoId: '4Lb5L-VEm34'
    },
    {
      id: 6,
      title: 'Meditación Guiada para Ansiedad',
      description: 'Esta meditación guiada está específicamente diseñada para personas que experimentan ansiedad frecuente. Utiliza visualizaciones y afirmaciones positivas para ayudar a calmar la mente y reducir los síntomas de ansiedad.',
      duration: '12 minutos',
      category: 'Meditación',
      icon: '🧘',
      instructions: [
        'Siéntate cómodamente en un lugar tranquilo donde no te interrumpan.',
        'Cierra los ojos y toma unas respiraciones profundas.',
        'Comienza enfocándote en sensaciones físicas agradables.',
        'Visualiza un lugar seguro y tranquilo en tu mente.',
        'Repite afirmaciones positivas como "Estoy seguro" o "Estoy en paz".',
        'Si surgen pensamientos ansiosos, obsérvalos sin juzgar y regresa a la visualización.',
        'Termina con una respiración profunda y abre los ojos lentamente.'
      ],
      benefits: [
        'Reduce los síntomas de ansiedad aguda',
        'Desarrolla herramientas para manejar ataques de pánico',
        'Mejora la capacidad de autorregulación emocional',
        'Aumenta la sensación de seguridad interna',
        'Puede usarse como herramienta preventiva'
      ],
      videoId: 'O-6f5wQXSu8'
    }
  ];

  const exercise = exercises.find(ex => ex.id === parseInt(id || '0'));

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
            {exercise.instructions.map((instruction, index) => (
              <InstructionItem key={index}>{instruction}</InstructionItem>
            ))}
          </InstructionsList>

          <BenefitsTitle>Beneficios:</BenefitsTitle>
          <BenefitsList>
            {exercise.benefits.map((benefit, index) => (
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
              src={`https://www.youtube.com/embed/${exercise.videoId}`}
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