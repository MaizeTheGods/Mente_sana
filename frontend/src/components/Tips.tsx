import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { tipsAPI, Tip, Category } from '../services/api';
import {
  PageContainer,
  GlassCard,
  PageTitle,
  CubeLoader,
  CubeSquare,
  LoadingText
} from './SharedStyles';

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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTips();
    loadCategories();
  }, []);

  const loadTips = async () => {
    setIsLoadingData(true);
    try {
      const response = await tipsAPI.getTips();
      setTips(response.tips);
    } catch (error) {
      console.error('Failed to load tips:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingData(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingData(true);
    try {
      const response = await tipsAPI.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <PageContainer>
        <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '60px 20px' }}>
          <CubeLoader>
            <CubeSquare delay={0} />
            <CubeSquare delay={-1.4285714286} />
            <CubeSquare delay={-2.8571428571} />
            <CubeSquare delay={-4.2857142857} />
            <CubeSquare delay={-5.7142857143} />
            <CubeSquare delay={-7.1428571429} />
            <CubeSquare delay={-8.5714285714} />
            <CubeSquare delay={-10} />
          </CubeLoader>
          <LoadingText>Cargando consejos...</LoadingText>
        </GlassCard>
      </PageContainer>
    );
  }

  const filteredTips = selectedCategory === 'all'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  return (
    <PageContainer>
      <GlassCard style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
        <PageTitle>Consejos para tu Bienestar</PageTitle>

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
      </GlassCard>
    </PageContainer>
  );
};

export default Tips;