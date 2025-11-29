import React, { useState, useEffect } from 'react';
import { questionnaireAPI, QuestionnaireQuestion } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PageHeader,
  PageTitle,
  Card,
  Button
} from './SharedStyles';
import Loader from './Loader';

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #2e7d32, #4caf50);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const InstructionsCard = styled.div`
  background: #f0fdf4;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  border-left: 4px solid #2e7d32;
`;

const ScaleList = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
`;

const QuestionCard = styled(Card)`
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const OptionLabel = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border: 2px solid ${props => props.selected ? '#2e7d32' : '#e2e8f0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#f0fdf4' : 'white'};
  position: relative;

  &:hover {
    border-color: ${props => props.selected ? '#2e7d32' : '#cbd5e1'};
    transform: translateY(-2px);
  }
`;

const OptionValue = styled.span<{ selected: boolean }>`
  font-weight: 700;
  margin-right: 12px;
  font-size: 18px;
  color: ${props => props.selected ? '#2e7d32' : '#64748b'};
  min-width: 24px;
`;

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scale, setScale] = useState<{ [key: number]: string }>({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!showConfirmationModal) {
      loadQuestionnaire();
    }
  }, [showConfirmationModal]);

  const loadQuestionnaire = async () => {
    setIsLoadingData(true);
    try {
      const data: QuestionnaireQuestion = await questionnaireAPI.getQuestions();
      setQuestions(data.questions);
      setScale(data.scale);
    } catch (error) {
      console.error('Failed to load questionnaire:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingData(false);
    }
  };

  const handleStartQuestionnaire = () => {
    setShowConfirmationModal(false);
  };

  const handleCancelQuestionnaire = () => {
    navigate('/dashboard');
  };

  const handleResponseChange = (questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex.toString()]: value
    }));

    // Auto-advance after a short delay for better UX
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if we have responses for all questions
    const totalQuestions = questions.length;
    const responseCount = Object.keys(responses).length;

    if (responseCount !== totalQuestions) {
      alert(`Debes responder todas las preguntas. Has respondido ${responseCount} de ${totalQuestions}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await questionnaireAPI.submitQuestionnaire({ responses });
      navigate('/results', { state: { result } });
    } catch (error: any) {
      console.error('Failed to submit questionnaire:', error);
      alert('Error al enviar el cuestionario. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentResponse = responses[currentQuestionIndex.toString()];

  if (isLoading || isLoadingData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
        <Loader />
        <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginTop: '20px' }}>
          Cargando cuestionario...
        </div>
      </div>
    );
  }

  // Sección de confirmación integrada
  if (showConfirmationModal) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <PageHeader>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <PageTitle>Evaluación de Salud Mental</PageTitle>
          </div>
        </PageHeader>

        <Card style={{
          textAlign: 'center',
          padding: '60px 40px',
          marginBottom: '32px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
          <h2 style={{
            color: '#1e293b',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            ¿Estás listo para comenzar el cuestionario?
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Este cuestionario consta de 21 preguntas sobre tu estado emocional durante la semana pasada.
            Toma tu tiempo para responder honestamente. No hay respuestas correctas o incorrectas.
          </p>

          <div style={{
            background: '#f0fdf4',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '40px',
            borderLeft: '4px solid #2e7d32',
            display: 'inline-block',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>⏱️</span>
              <span style={{
                color: '#1e293b',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Duración aproximada: 5-10 minutos
              </span>
            </div>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              margin: '0',
              lineHeight: '1.5'
            }}>
              Recibirás resultados detallados con recomendaciones personalizadas al finalizar.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <Button
              variant="outline"
              onClick={handleCancelQuestionnaire}
              style={{ flex: 1, padding: '14px 24px', fontSize: '16px' }}
            >
              Volver al inicio
            </Button>
            <Button
              variant="primary"
              onClick={handleStartQuestionnaire}
              style={{ flex: 1, padding: '14px 24px', fontSize: '16px' }}
            >
              Comenzar cuestionario
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <PageTitle>Evaluación de Salud Mental</PageTitle>
          <p style={{ color: '#64748b', marginTop: '8px' }}>
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>
      </PageHeader>

      <ProgressBarContainer>
        <ProgressBarFill progress={progress} />
      </ProgressBarContainer>

      <InstructionsCard>
        <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>Instrucciones</h3>
        <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
          Lee cada declaración y selecciona el número que indica cuánto se aplicó a ti durante la semana pasada.
          No hay respuestas correctas o incorrectas. No pases demasiado tiempo en cada declaración.
        </p>
      </InstructionsCard>

      <ScaleList>
        <h4 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Escala de respuesta:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {Object.entries(scale).map(([value, text]) => (
            <div key={value} style={{ fontSize: '13px', color: '#64748b' }}>
              <strong style={{ color: '#2e7d32' }}>{value}:</strong> {text}
            </div>
          ))}
        </div>
      </ScaleList>

      <QuestionCard>
        <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Pregunta {currentQuestionIndex + 1}
        </div>
        <h2 style={{ color: '#1e293b', marginBottom: '32px', lineHeight: '1.4', fontSize: '24px', fontWeight: '600' }}>
          {questions[currentQuestionIndex]}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '12px'
        }}>
          {[0, 1, 2, 3].map((value) => (
            <OptionLabel key={value} selected={currentResponse === value}>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={value}
                checked={currentResponse === value}
                onChange={() => handleResponseChange(currentQuestionIndex, value)}
                style={{ display: 'none' }}
              />
              <OptionValue selected={currentResponse === value}>
                {value}
              </OptionValue>
              <span style={{ flex: 1, fontSize: '16px', color: currentResponse === value ? '#1e293b' : '#475569' }}>
                {scale[value]}
              </span>
              {currentResponse === value && (
                <span style={{ color: '#2e7d32', fontSize: '20px' }}>✓</span>
              )}
            </OptionLabel>
          ))}
        </div>
      </QuestionCard>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
        >
          ← Anterior
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || currentResponse === undefined}
          >
            {isSubmitting ? 'Enviando...' : 'Finalizar y Ver Resultados'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={currentResponse === undefined}
          >
            Siguiente →
          </Button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;