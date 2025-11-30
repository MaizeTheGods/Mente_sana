import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { PageHeader, PageTitle } from './SharedStyles';
import { useAuth } from '../contexts/AuthContext';

type DiaryPage = {
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Book = styled.div<{ flipping: boolean }>`
  width: min(900px, 100%);
  margin: 0 auto;
  perspective: 2000px;
`;

const BookInner = styled.div<{ flipping: boolean }>`
  position: relative;
  width: 100%;
  height: clamp(380px, 60vh, 640px);
  border-radius: 12px;
  background: linear-gradient(90deg, #f8fafc 50%, #ffffff 50%);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  overflow: hidden;
  transform-style: preserve-3d;
`;

const LeftPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
  padding: clamp(12px, 2vw, 24px);
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;

const RightPage = styled.div<{ flipping: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background: #ffffff;
  padding: clamp(12px, 2vw, 24px);
  transform-origin: left center;
  transition: transform 0.6s ease;
  backface-visibility: hidden;
  will-change: transform;
  ${p => p.flipping ? 'transform: rotateY(-180deg);' : ''}
`;

const PageTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: #1e293b;
  font-size: 16px;
  line-height: 1.6;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #1e293b;
  cursor: pointer;
`;

const Counter = styled.span`
  color: #64748b;
  font-size: 14px;
`;

const Timestamp = styled.div`
  text-align: right;
  color: #94a3b8;
  font-size: 12px;
`;

const MAX_CHARS_PER_PAGE = 1200;

const Diary: React.FC = () => {
  const { user } = useAuth();
  const storageKey = useMemo(() => `diaryPages:${user?._id || 'guest'}`, [user?._id]);

  const [pages, setPages] = useState<DiaryPage[]>([{ text: '' }]);
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const saveTimeout = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as DiaryPage[];
        if (Array.isArray(parsed) && parsed.length) {
          setPages(parsed);
          setCurrent(0);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    saveTimeout.current = window.setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(pages));
    }, 300);
    return () => {
      if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    };
  }, [pages, storageKey]);

  const setText = (value: string) => {
    setPages(prev => {
      const next = [...prev];
      const page = { ...(next[current] || { text: '' }) } as DiaryPage;
      const wasEmpty = !page.text;
      page.text = value;
      const now = new Date().toISOString();
      if (wasEmpty && value) page.createdAt = now;
      page.updatedAt = now;
      next[current] = page;

      if (value.length > MAX_CHARS_PER_PAGE) {
        const overflow = value.slice(MAX_CHARS_PER_PAGE);
        page.text = value.slice(0, MAX_CHARS_PER_PAGE);
        setFlipping(true);
        window.setTimeout(() => setFlipping(false), 650);
        const nextIndex = current + 1;
        const nextPage = next[nextIndex] || { text: '' };
        const now2 = new Date().toISOString();
        if (!next[nextIndex]) next[nextIndex] = nextPage;
        if (!nextPage.createdAt && overflow.trim()) nextPage.createdAt = now2;
        nextPage.updatedAt = now2;
        nextPage.text = overflow + (nextPage.text || '');
        setCurrent(nextIndex);
      }

      return next;
    });
  };

  const goPrev = () => setCurrent(c => Math.max(0, c - 1));
  const goNext = () => setPages(prev => {
    const next = [...prev];
    if (current + 1 >= next.length) next.push({ text: '' });
    setFlipping(true);
    window.setTimeout(() => setFlipping(false), 650);
    setCurrent(current + 1);
    return next;
  });

  const page = pages[current] || { text: '' };

  const format = (iso?: string) => iso ? new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'medium', timeStyle: 'short'
  }) : '';

  return (
    <Container>
      <PageHeader>
        <div>
          <PageTitle>Diario</PageTitle>
        </div>
      </PageHeader>

      <Book flipping={flipping}>
        <BookInner flipping={flipping}>
          <LeftPage />
          <RightPage flipping={flipping}>
            <PageTextarea
              value={page.text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aquí..."
            />
          </RightPage>
        </BookInner>
      </Book>

      <Controls>
        <Button onClick={goPrev}>⬅️ Anterior</Button>
        <Counter>Página {current + 1} / {pages.length}</Counter>
        <Button onClick={goNext}>Siguiente ➡️</Button>
      </Controls>

      <Timestamp>
        {page.createdAt && `Escrito: ${format(page.createdAt)}`} {page.updatedAt && `· Modificado: ${format(page.updatedAt)}`}
      </Timestamp>
    </Container>
  );
};

export default Diary;
