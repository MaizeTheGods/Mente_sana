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

  // Mock data - in a real app, this would come from an API
  const tips = [
    {
      id: 1,
      title: 'Practica la Gratitud Diaria',
      description: 'La gratitud es una emoción poderosa que puede transformar nuestra perspectiva de la vida. Cuando nos enfocamos en lo que tenemos en lugar de lo que nos falta, cultivamos una mentalidad más positiva y reducimos los sentimientos de insatisfacción.',
      category: 'Diarios',
      icon: '🙏',
      why: 'La gratitud ha sido científicamente probada para mejorar el bienestar mental. Estudios muestran que las personas que practican la gratitud regularmente experimentan menos depresión, mejor sueño y mayor satisfacción con la vida.',
      how: [
        'Elige un momento específico del día (mañana o noche) para tu práctica',
        'Escribe 3-5 cosas por las que estás agradecido',
        'Sé específico: en lugar de "mi familia", escribe "la sonrisa de mi hijo esta mañana"',
        'Lee lo que escribiste en voz alta si es posible',
        'Reflexiona por un momento sobre por qué te sientes agradecido'
      ],
      benefits: [
        'Reduce síntomas de depresión',
        'Mejora la calidad del sueño',
        'Aumenta la satisfacción con la vida',
        'Fortalece las relaciones sociales',
        'Mejora la resiliencia emocional'
      ],
      videoId: 'WPPPFqsECz0'
    },
    {
      id: 2,
      title: 'Establece Límites Saludables',
      description: 'Los límites saludables son esenciales para mantener el equilibrio emocional y prevenir el agotamiento. Aprender a decir "no" cuando es necesario protege nuestra energía y nos permite cuidar mejor de nosotros mismos.',
      category: 'Estrés',
      icon: '🛡️',
      why: 'Sin límites claros, podemos sobrecargarnos emocionalmente, lo que lleva a estrés crónico, resentimiento y agotamiento. Los límites nos ayudan a preservar nuestra energía mental y emocional.',
      how: [
        'Identifica tus valores y prioridades personales',
        'Reconoce situaciones donde te sientes sobrecargado',
        'Practica frases como "Lo siento, no puedo comprometerme con eso ahora"',
        'Sé consistente en mantener tus límites',
        'Recuerda que decir "no" a otros significa decir "sí" a ti mismo'
      ],
      benefits: [
        'Reduce el estrés y la ansiedad',
        'Previene el agotamiento emocional',
        'Mejora la autoestima',
        'Fortalece las relaciones saludables',
        'Aumenta la productividad y el enfoque'
      ],
      videoId: 'V2WkXgQBnSg'
    },
    {
      id: 3,
      title: 'Crea una Rutina de Sueño',
      description: 'El sueño de calidad es fundamental para la salud mental. Una rutina consistente de sueño ayuda a regular nuestros ritmos circadianos y mejora el funcionamiento cognitivo y emocional.',
      category: 'Sueño',
      icon: '🌙',
      why: 'La falta de sueño afecta directamente nuestro estado de ánimo, capacidad de concentración y salud mental. Una buena rutina de sueño puede prevenir problemas como la depresión y la ansiedad.',
      how: [
        'Establece horarios consistentes para acostarte y levantarte',
        'Crea un ritual relajante antes de dormir (leer, meditación)',
        'Evita pantallas al menos 1 hora antes de dormir',
        'Mantén tu habitación fresca, oscura y silenciosa',
        'Evita cafeína después del mediodía y comidas pesadas por la noche'
      ],
      benefits: [
        'Mejora el estado de ánimo',
        'Aumenta la concentración y productividad',
        'Reduce el riesgo de depresión',
        'Fortalece el sistema inmunológico',
        'Mejora la regulación emocional'
      ],
      videoId: 'qJx6QF3ZrKM'
    },
    {
      id: 4,
      title: 'Comunicación Asertiva',
      description: 'La comunicación asertiva implica expresar nuestros pensamientos y sentimientos de manera clara, honesta y respetuosa, sin violar los derechos de los demás ni permitir que violen los nuestros.',
      category: 'Relaciones',
      icon: '💬',
      why: 'La comunicación efectiva es clave para relaciones saludables. La asertividad nos ayuda a expresar nuestras necesidades, resolver conflictos y construir conexiones más profundas con los demás.',
      how: [
        'Usa frases en primera persona: "Me siento..." en lugar de "Tú me haces..."',
        'Sé específico sobre tus sentimientos y necesidades',
        'Escucha activamente la respuesta del otro',
        'Mantén un tono calmado y respetuoso',
        'Practica en situaciones de bajo riesgo primero'
      ],
      benefits: [
        'Mejora las relaciones interpersonales',
        'Reduce conflictos y malentendidos',
        'Aumenta la confianza en uno mismo',
        'Facilita la resolución de problemas',
        'Promueve un ambiente de respeto mutuo'
      ],
      videoId: '3Qm59PVxQ3I'
    },
    {
      id: 5,
      title: 'Técnica Pomodoro en el Trabajo',
      description: 'La Técnica Pomodoro es un método de gestión del tiempo que alterna períodos de trabajo concentrado con descansos cortos, ayudando a mantener la concentración y prevenir el agotamiento mental.',
      category: 'Trabajo',
      icon: '⏱️',
      why: 'El trabajo prolongado sin descansos lleva a la fatiga mental y reducción de la productividad. La Técnica Pomodoro optimiza nuestro rendimiento cognitivo y previene el burnout.',
      how: [
        'Elige una tarea para trabajar',
        'Configura un temporizador por 25 minutos',
        'Trabaja en la tarea hasta que suene el temporizador',
        'Toma un descanso corto de 5 minutos',
        'Después de 4 pomodoros, toma un descanso más largo de 15-30 minutos',
        'Repite el ciclo según sea necesario'
      ],
      benefits: [
        'Mejora la concentración y el enfoque',
        'Reduce la fatiga mental',
        'Aumenta la productividad',
        'Previene el agotamiento laboral',
        'Mejora la gestión del tiempo'
      ],
      videoId: 'L4N1q4RNi9I'
    },
    {
      id: 6,
      title: 'Mindful Eating',
      description: 'El mindful eating, o alimentación consciente, implica prestar atención plena a la experiencia de comer, saboreando cada bocado y reconociendo las señales de hambre y saciedad del cuerpo.',
      category: 'Diarios',
      icon: '🍽️',
      why: 'Comer de manera consciente mejora nuestra relación con la comida, ayuda con problemas de alimentación y aumenta el disfrute de las comidas. También puede ayudar con la gestión del peso y la digestión.',
      how: [
        'Siéntate en un lugar tranquilo sin distracciones',
        'Observa el aspecto, aroma y textura de tu comida',
        'Come despacio, masticando completamente cada bocado',
        'Presta atención a los sabores y texturas',
        'Detente cuando sientas saciedad, no cuando estés lleno'
      ],
      benefits: [
        'Mejora la relación con la comida',
        'Ayuda con problemas de alimentación',
        'Aumenta el disfrute de las comidas',
        'Facilita la digestión',
        'Promueve hábitos alimenticios saludables'
      ],
      videoId: '4YB9nZ4xK9M'
    },
    {
      id: 7,
      title: 'Gestión del Estrés Agudo',
      description: 'Cuando enfrentamos estrés agudo, es importante tener herramientas inmediatas para calmar el sistema nervioso y recuperar el equilibrio emocional.',
      category: 'Estrés',
      icon: '🫁',
      why: 'El estrés agudo activa la respuesta de "lucha o huida", lo que puede ser útil en situaciones de peligro pero problemático cuando se activa frecuentemente. Técnicas rápidas nos ayudan a regular esta respuesta.',
      how: [
        'Detente inmediatamente cuando sientas estrés intenso',
        'Toma 3 respiraciones profundas y lentas',
        'Pregúntate: "¿Qué puedo controlar en esta situación?"',
        'Nombra 3 cosas que puedes ver, oír y sentir en el momento presente',
        'Practica una afirmación positiva como "Estoy a salvo en este momento"'
      ],
      benefits: [
        'Reduce la activación del estrés agudo',
        'Recupera el equilibrio emocional rápidamente',
        'Previene la escalada de la ansiedad',
        'Mejora la capacidad de respuesta ante situaciones difíciles',
        'Fortalece la resiliencia emocional'
      ],
      videoId: 'SEfsRYdK_WY'
    },
    {
      id: 8,
      title: 'Higiene del Sueño',
      description: 'La higiene del sueño se refiere a las prácticas y hábitos que promueven un sueño de calidad y ayudan a mantener ritmos circadianos saludables.',
      category: 'Sueño',
      icon: '🛏️',
      why: 'La higiene del sueño es fundamental porque el sueño afecta todos los aspectos de nuestra salud mental y física. Prácticas pobres de sueño pueden contribuir a problemas como depresión, ansiedad y problemas cognitivos.',
      how: [
        'Mantén horarios consistentes de sueño',
        'Crea un ambiente propicio: fresco, oscuro y silencioso',
        'Evita estimulantes como cafeína y nicotina por la tarde',
        'Establece una rutina relajante antes de dormir',
        'Usa la cama solo para dormir y actividades íntimas'
      ],
      benefits: [
        'Mejora la calidad y duración del sueño',
        'Reduce la somnolencia diurna',
        'Mejora el estado de ánimo y la energía',
        'Fortalece la memoria y el aprendizaje',
        'Reduce el riesgo de problemas de salud mental'
      ],
      videoId: 'aW2QK5H3WjM'
    },
    {
      id: 9,
      title: 'Construye Confianza',
      description: 'La confianza es el fundamento de todas las relaciones saludables. Construir confianza requiere consistencia, honestidad y fiabilidad a lo largo del tiempo.',
      category: 'Relaciones',
      icon: '🤝',
      why: 'La confianza crea un sentido de seguridad emocional en las relaciones. Sin confianza, las relaciones se vuelven tensas y difíciles de mantener. La confianza se construye con acciones consistentes a lo largo del tiempo.',
      how: [
        'Sé consistente en tus palabras y acciones',
        'Cumple tus compromisos y promesas',
        'Sé honesto y transparente en tu comunicación',
        'Admite cuando te equivocas y aprende de ello',
        'Demuestra interés genuino en los demás'
      ],
      benefits: [
        'Crea relaciones más profundas y significativas',
        'Reduce la ansiedad en las interacciones sociales',
        'Facilita la resolución de conflictos',
        'Aumenta la satisfacción en las relaciones',
        'Promueve un ambiente de apoyo mutuo'
      ],
      videoId: '3vYD6FnmL8E'
    },
    {
      id: 10,
      title: 'Equilibrio Trabajo-Vida',
      description: 'Mantener un equilibrio saludable entre el trabajo y la vida personal es esencial para prevenir el agotamiento y mantener la salud mental.',
      category: 'Trabajo',
      icon: '⚖️',
      why: 'El desequilibrio trabajo-vida lleva al burnout, estrés crónico y problemas de salud mental. Un equilibrio adecuado nos permite recargar energías y mantener la motivación en todas las áreas de nuestra vida.',
      how: [
        'Establece límites claros entre trabajo y tiempo personal',
        'Programa tiempo para actividades que disfrutes',
        'Aprende a desconectar completamente del trabajo',
        'Prioriza el autocuidado y el descanso',
        'Revisa regularmente tu equilibrio y ajusta según sea necesario'
      ],
      benefits: [
        'Previene el agotamiento laboral',
        'Mejora la salud mental y física',
        'Aumenta la satisfacción general con la vida',
        'Mejora el rendimiento laboral',
        'Fortalece las relaciones personales'
      ],
      videoId: 'bJBYk2QxS-0'
    },
    {
      id: 11,
      title: 'Diálogo Interno Positivo',
      description: 'El diálogo interno positivo implica reemplazar pensamientos negativos y autocríticos con afirmaciones constructivas y compasivas.',
      category: 'Diarios',
      icon: '💭',
      why: 'Nuestro diálogo interno afecta directamente nuestro estado emocional y comportamiento. Los pensamientos negativos pueden crear ciclos de ansiedad y depresión, mientras que los positivos promueven resiliencia y bienestar.',
      how: [
        'Identifica pensamientos negativos recurrentes',
        'Reemplázalos con afirmaciones positivas y realistas',
        'Practica la autocompasión cuando cometas errores',
        'Usa evidencia para desafiar pensamientos distorsionados',
        'Repite afirmaciones positivas regularmente'
      ],
      benefits: [
        'Reduce la ansiedad y la depresión',
        'Mejora la autoestima',
        'Aumenta la resiliencia emocional',
        'Mejora el rendimiento en diversas áreas',
        'Promueve una mentalidad más positiva'
      ],
      videoId: 'PDjQpJzDWUs'
    },
    {
      id: 12,
      title: 'Técnicas de Relajación Rápida',
      description: 'Técnicas de relajación rápida son herramientas que podemos usar en cualquier momento para reducir el estrés y recuperar la calma.',
      category: 'Estrés',
      icon: '😌',
      why: 'En nuestro ritmo de vida acelerado, necesitamos herramientas accesibles para manejar el estrés diario. Técnicas rápidas nos permiten intervenir inmediatamente cuando sentimos tensión emocional.',
      how: [
        'Técnica 4-7-8: inhala 4 segundos, retiene 7, exhala 8',
        'Relajación muscular progresiva: tense y relaje grupos musculares',
        'Visualización: imagina un lugar tranquilo y seguro',
        'Anclaje: nombra 5 cosas que puedes ver, 4 que puedes tocar, etc.',
        'Afirmaciones: repite frases calmantes como "Estoy seguro"'
      ],
      benefits: [
        'Reduce el estrés agudo rápidamente',
        'Mejora la capacidad de respuesta al estrés',
        'Aumenta la consciencia emocional',
        'Previene la acumulación de tensión',
        'Mejora la calidad de vida diaria'
      ],
      videoId: '1nX7QYqO4yE'
    }
  ];

  const tip = tips.find(t => t.id === parseInt(id || '0'));

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

  return (
    <Container>
      <Card>
        <ContentSection>
          <Title>{tip.title}</Title>

          <MetaInfo>
            <Category>{tip.category}</Category>
          </MetaInfo>

          <Description>{tip.description}</Description>

          <WhyTitle>¿Por qué es importante?</WhyTitle>
          <WhyText>{tip.why}</WhyText>

          <HowTitle>Cómo practicarlo:</HowTitle>
          <HowList>
            {tip.how.map((step, index) => (
              <HowItem key={index}>{step}</HowItem>
            ))}
          </HowList>

          <BenefitsTitle>Beneficios:</BenefitsTitle>
          <BenefitsList>
            {tip.benefits.map((benefit, index) => (
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
              src={`https://www.youtube.com/embed/${tip.videoId}`}
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