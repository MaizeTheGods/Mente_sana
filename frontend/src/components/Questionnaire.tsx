import React, { useState, useEffect } from 'react';
import { questionnaireAPI, QuestionnaireQuestion } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  GlassCard,
  PageTitle,
  StyledButton,
  CubeLoader,
  CubeSquare,
  LoadingText
} from './SharedStyles';

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scale, setScale] = useState<{ [key: number]: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    loadQuestionnaire();
  }, []);

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

  const handleResponseChange = (questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex.toString()]: value
    }));
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
          <LoadingText>Cargando cuestionario...</LoadingText>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GlassCard style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <PageTitle>Evaluación de Salud Mental</PageTitle>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e9ecef',
            borderRadius: '4px',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #4caf50, #66bb6a)',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ color: '#666' }}>Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
        </div>

        <div style={{
          background: '#f1f8e9',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          borderLeft: '4px solid #4caf50'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '18px' }}>Instrucciones</h3>
          <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
            Lee cada declaración y selecciona el número que indica cuánto se aplicó a ti durante la semana pasada.
            No hay respuestas correctas o incorrectas. No pases demasiado tiempo en cada declaración.
          </p>
        </div>

        <div style={{
          background: '#e8f5e8',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#2e7d32', marginBottom: '10px', margin: '0 0 10px 0' }}>Escala de respuesta:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {Object.entries(scale).map(([value, text]) => (
              <li key={value} style={{ marginBottom: '5px', color: '#555', fontSize: '14px' }}>
                <strong>{value}:</strong> {text}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontWeight: 'bold', color: '#4caf50', marginBottom: '10px', fontSize: '18px' }}>
            Pregunta {currentQuestionIndex + 1}
          </div>
          <p style={{ color: '#333', marginBottom: '20px', lineHeight: '1.6', fontSize: '18px', fontWeight: '500' }}>
            {questions[currentQuestionIndex]}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {[0, 1, 2, 3].map((value) => (
              <label key={value} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: `2px solid ${currentResponse === value ? '#4caf50' : '#e9ecef'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: currentResponse === value ? '#4caf50' : 'white',
                color: currentResponse === value ? 'white' : 'inherit',
                position: 'relative'
              }}>
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={value}
                  checked={currentResponse === value}
                  onChange={() => handleResponseChange(currentQuestionIndex, value)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '18px', color: currentResponse === value ? 'white' : '#4caf50' }}>
                  {value}
                </span>
                <span style={{ flex: 1, fontSize: '14px' }}>
                  {scale[value]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <StyledButton
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              background: currentQuestionIndex === 0 ? '#e0e0e0' : '#9e9e9e',
              width: 'auto',
              padding: '12px 30px',
              marginTop: 0
            }}
          >
            Anterior
          </StyledButton>

          {currentQuestionIndex === questions.length - 1 ? (
            <StyledButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: 'auto',
                padding: '12px 30px',
                marginTop: 0
              }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Cuestionario'}
            </StyledButton>
          ) : (
            <StyledButton
              onClick={handleNext}
              disabled={currentResponse === undefined}
              style={{
                width: 'auto',
                padding: '12px 30px',
                marginTop: 0
              }}
            >
              Siguiente
            </StyledButton>
          )}
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Questionnaire;