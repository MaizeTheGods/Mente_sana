import React, { useState, useEffect } from 'react';
import { questionnaireAPI, QuestionnaireQuestion } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scale, setScale] = useState<{ [key: number]: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    loadQuestionnaire();
  }, []);

  const loadQuestionnaire = async () => {
    try {
      const data: QuestionnaireQuestion = await questionnaireAPI.getQuestions();
      setQuestions(data.questions);
      setScale(data.scale);
    } catch (error) {
      console.error('Failed to load questionnaire:', error);
    } finally {
      setIsLoading(false);
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

    console.log('Total questions:', totalQuestions);
    console.log('Response count:', responseCount);
    console.log('Responses:', responses);

    if (responseCount !== totalQuestions) {
      alert(`Debes responder todas las preguntas. Has respondido ${responseCount} de ${totalQuestions}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await questionnaireAPI.submitQuestionnaire({ responses });
      navigate('/dashboard'); // Navigate to dashboard instead of results
    } catch (error: any) {
      console.error('Failed to submit questionnaire:', error);
      alert('Error al enviar el cuestionario. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentResponse = responses[currentQuestionIndex.toString()];

  if (isLoading) {
    return <div>Cargando cuestionario...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Evaluación de Salud Mental</h1>
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
        <p>Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
      </div>

      <div style={{
        background: '#f1f8e9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        borderLeft: '4px solid #4caf50'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>Instrucciones</h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
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
        <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>Escala de respuesta:</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {Object.entries(scale).map(([value, text]) => (
            <li key={value} style={{ marginBottom: '5px', color: '#555', fontSize: '14px' }}>
              <strong>{value}:</strong> {text}
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ fontWeight: 'bold', color: '#4caf50', marginBottom: '10px', fontSize: '18px' }}>
          Pregunta {currentQuestionIndex + 1}
        </div>
        <p style={{ color: '#333', marginBottom: '15px', lineHeight: '1.6', fontSize: '18px', fontWeight: '500' }}>
          {questions[currentQuestionIndex]}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          {[0, 1, 2, 3].map((value) => (
            <label key={value} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              border: `2px solid ${currentResponse === value ? '#4caf50' : '#e9ecef'}`,
              borderRadius: '8px',
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
              <span style={{ fontWeight: 'bold', marginRight: '10px', color: currentResponse === value ? 'white' : '#4caf50' }}>
                {value}
              </span>
              <span style={{ flex: 1 }}>
                {scale[value]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestionIndex === 0 ? 0.5 : 1,
            background: '#6c757d',
            color: 'white'
          }}
        >
          Anterior
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
              background: '#66bb6a',
              color: 'white'
            }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Cuestionario'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentResponse === undefined}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: currentResponse === undefined ? 'not-allowed' : 'pointer',
              opacity: currentResponse === undefined ? 0.5 : 1,
              background: '#4caf50',
              color: 'white'
            }}
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;