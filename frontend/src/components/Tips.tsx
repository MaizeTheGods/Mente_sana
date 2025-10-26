import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { tipsAPI, Tip, Category } from '../services/api';

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
  const [tips, setTips] = useState<Tip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTips();
    loadCategories();
  }, []);

  const loadTips = async () => {
    try {
      const response = await tipsAPI.getTips();
      setTips(response.tips);
    } catch (error) {
      console.error('Failed to load tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await tipsAPI.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Card>
          <Title>Cargando consejos...</Title>
        </Card>
      </Container>
    );
  }

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

        {/* Tips Grid */}
        <TipsGrid>
          {filteredTips.map(tip => (
            <TipCard
              key={tip._id}
              onClick={() => navigate(`/tip/${tip._id}`)}
            >
              <TipIcon>💡</TipIcon>
              <TipTitle>{tip.title}</TipTitle>
              <TipDescription>{tip.content}</TipDescription>
              <div style={{ textAlign: 'center' }}>
                <TipCategory>
                  {categories.find(cat => cat.id === tip.category)?.label || tip.category}
                </TipCategory>
                {tip.media?.videoUrl && (
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ color: '#4caf50', fontSize: '0.8rem' }}>🎥 Video disponible</span>
                  </div>
                )}
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