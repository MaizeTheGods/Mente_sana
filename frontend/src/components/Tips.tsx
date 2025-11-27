import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { tipsAPI, Tip, Category } from '../services/api';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  CubeLoader,
  CubeSquare,
  LoadingText,
  Badge,
  Button
} from './SharedStyles';

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const TipCard = styled(Card)`
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

const TipTitle = styled.h3`
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const TipContent = styled.p`
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

const Tips: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tips, setTips] = useState<Tip[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tipsRes, catsRes] = await Promise.all([
          tipsAPI.getTips(),
          tipsAPI.getCategories()
        ]);
        setTips(tipsRes.tips);
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
        <LoadingText>Cargando consejos...</LoadingText>
      </div>
    );
  }

  const filteredTips = selectedCategory === 'all'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Consejos para tu Bienestar</PageTitle>
          <PageSubtitle>Descubre herramientas prácticas para mejorar tu día a día</PageSubtitle>
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

      <TipsGrid>
        {filteredTips.map(tip => (
          <TipCard key={tip._id} onClick={() => navigate(`/tip/${tip._id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Badge bg="#e0f2fe" color="#0284c7">
                {categories.find(c => c.id === tip.category)?.label || tip.category}
              </Badge>
              {tip.media?.videoUrl && <span>🎥</span>}
            </div>
            <TipTitle>{tip.title}</TipTitle>
            <TipContent>{tip.content}</TipContent>
            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <Button variant="outline" style={{ width: '100%', fontSize: '13px' }}>
                Leer más
              </Button>
            </div>
          </TipCard>
        ))}
      </TipsGrid>
    </div>
  );
};

export default Tips;