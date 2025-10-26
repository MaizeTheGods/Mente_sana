import React, { useState } from 'react';
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

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const TipCard = styled.div`
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

const TipIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  text-align: center;
`;

const TipTitle = styled.h3`
  color: #2e7d32;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
`;

const TipDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const TipCategory = styled.div`
  display: inline-block;
  background: #4caf50;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
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

const Tips: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const tipCategories = [
    { id: 'all', label: 'Todos', icon: '💡' },
    { id: 'daily', label: 'Diarios', icon: '🌅' },
    { id: 'stress', label: 'Estrés', icon: '😰' },
    { id: 'sleep', label: 'Sueño', icon: '😴' },
    { id: 'relationships', label: 'Relaciones', icon: '❤️' },
    { id: 'work', label: 'Trabajo', icon: '💼' }
  ];

  const tips = [
    {
      id: 1,
      title: 'Practica la Gratitud Diaria',
      description: 'Cada noche, escribe 3 cosas por las que estás agradecido. Esto ayuda a cambiar el enfoque de lo negativo a lo positivo.',
      category: 'daily',
      icon: '🙏'
    },
    {
      id: 2,
      title: 'Establece Límites Saludables',
      description: 'Aprende a decir "no" cuando sea necesario. Proteger tu energía es fundamental para mantener el equilibrio emocional.',
      category: 'stress',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Crea una Rutina de Sueño',
      description: 'Acuéstate y levántate a la misma hora todos los días. Evita pantallas al menos 1 hora antes de dormir.',
      category: 'sleep',
      icon: '🌙'
    },
    {
      id: 4,
      title: 'Comunicación Asertiva',
      description: 'Expresa tus sentimientos y necesidades de manera clara y respetuosa. Usa frases como "Me siento..." en lugar de "Tú me haces sentir...".',
      category: 'relationships',
      icon: '💬'
    },
    {
      id: 5,
      title: 'Técnica Pomodoro en el Trabajo',
      description: 'Trabaja 25 minutos concentrado y toma un descanso de 5 minutos. Después de 4 ciclos, toma un descanso más largo.',
      category: 'work',
      icon: '⏱️'
    },
    {
      id: 6,
      title: 'Mindful Eating',
      description: 'Come despacio, saboreando cada bocado. Presta atención a los sabores, texturas y aromas de tu comida.',
      category: 'daily',
      icon: '🍽️'
    },
    {
      id: 7,
      title: 'Gestión del Estrés Agudo',
      description: 'Cuando sientas estrés intenso, detente, respira profundamente 3 veces y pregúntate: "¿Qué puedo controlar en esta situación?".',
      category: 'stress',
      icon: '🫁'
    },
    {
      id: 8,
      title: 'Higiene del Sueño',
      description: 'Mantén tu habitación fresca, oscura y silenciosa. Usa la cama solo para dormir y actividades íntimas.',
      category: 'sleep',
      icon: '🛏️'
    },
    {
      id: 9,
      title: 'Construye Confianza',
      description: 'Sé consistente en tus palabras y acciones. La confianza se construye con el tiempo a través de la fiabilidad.',
      category: 'relationships',
      icon: '🤝'
    },
    {
      id: 10,
      title: 'Equilibrio Trabajo-Vida',
      description: 'Establece horarios claros para el trabajo y el tiempo personal. Desconecta completamente del trabajo fuera del horario laboral.',
      category: 'work',
      icon: '⚖️'
    },
    {
      id: 11,
      title: 'Diálogo Interno Positivo',
      description: 'Reemplaza pensamientos negativos con afirmaciones positivas. En lugar de "No puedo", di "Estoy aprendiendo".',
      category: 'daily',
      icon: '💭'
    },
    {
      id: 12,
      title: 'Técnicas de Relajación Rápida',
      description: 'Tensa y relaja grupos musculares progresivamente. O visualiza un lugar tranquilo y seguro en tu mente.',
      category: 'stress',
      icon: '😌'
    }
  ];

  const filteredTips = selectedCategory === 'all'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  return (
    <Container>
      <Card>
        <Title>Consejos para tu Bienestar</Title>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {tipCategories.map(category => (
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

        {/* Tips Grid */}
        <TipsGrid>
          {filteredTips.map(tip => (
            <TipCard
              key={tip.id}
              onClick={() => navigate(`/tip/${tip.id}`)}
            >
              <TipIcon>{tip.icon}</TipIcon>
              <TipTitle>{tip.title}</TipTitle>
              <TipDescription>{tip.description}</TipDescription>
              <div style={{ textAlign: 'center' }}>
                <TipCategory>
                  {tipCategories.find(cat => cat.id === tip.category)?.label || tip.category}
                </TipCategory>
              </div>
            </TipCard>
          ))}
        </TipsGrid>

        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => window.history.back()}>
            ← Regresar al Dashboard
          </BackButton>
        </div>
      </Card>
    </Container>
  );
};

export default Tips;