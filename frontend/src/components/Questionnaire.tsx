import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { questionnaireAPI, QuestionnaireQuestion } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
`;

const Instructions = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #667eea;
`;

const InstructionsTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const InstructionsText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ScaleInfo = styled.div`
  background: #e8f4f8;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ScaleTitle = styled.h4`
  color: #333;
  margin-bottom: 10px;
`;

const ScaleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ScaleItem = styled.li`
  margin-bottom: 5px;
  color: #555;
  font-size: 14px;
`;

const QuestionCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
`;

const QuestionNumber = styled.div`
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
  font-size: 18px;
`;

const QuestionText = styled.p`
  color: #333;
  margin-bottom: 15px;
  line-height: 1.6;
  font-size: 16px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }

  input:checked + & {
    border-color: #667eea;
    background: #667eea;
    color: white;
  }
`;

const OptionInput = styled.input`
  display: none;
`;

const OptionValue = styled.span`
  font-weight: bold;
  margin-right: 10px;
  color: #667eea;
`;

const OptionText = styled.span`
  flex: 1;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const NextButton = styled(Button)`
  background: #667eea;
  color: white;

  &:hover:not(:disabled) {
    background: #5a67d8;
  }
`;

const SubmitButton = styled(Button)`
  background: #28a745;
  color: white;

  &:hover:not(:disabled) {
    background: #218838;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

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
    setResponses({
      ...responses,
      [questionIndex.toString()]: value
    });
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

  if (isLoading) {
    return <Container>Cargando cuestionario...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Evaluación de Salud Mental</Title>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        <p>Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
      </Header>

      <Instructions>
        <InstructionsTitle>Instrucciones</InstructionsTitle>
        <InstructionsText>
          Lee cada declaración y selecciona el número que indica cuánto se aplicó a ti durante la semana pasada.
          No hay respuestas correctas o incorrectas. No pases demasiado tiempo en cada declaración.
        </InstructionsText>
      </Instructions>

      <ScaleInfo>
        <ScaleTitle>Escala de respuesta:</ScaleTitle>
        <ScaleList>
          {Object.entries(scale).map(([value, text]) => (
            <ScaleItem key={value}>
              <strong>{value}:</strong> {text}
            </ScaleItem>
          ))}
        </ScaleList>
      </ScaleInfo>

      <QuestionCard>
        <QuestionNumber>Pregunta {currentQuestionIndex + 1}</QuestionNumber>
        <QuestionText>{questions[currentQuestionIndex]}</QuestionText>

        <OptionsGrid>
          {[0, 1, 2, 3].map((value) => (
            <OptionLabel key={value}>
              <OptionInput
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={value}
                checked={currentResponse === value}
                onChange={() => handleResponseChange(currentQuestionIndex, value)}
              />
              <OptionValue>{value}</OptionValue>
              <OptionText>{scale[value]}</OptionText>
            </OptionLabel>
          ))}
        </OptionsGrid>
      </QuestionCard>

      <NavigationButtons>
        <PrevButton
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </PrevButton>

        {currentQuestionIndex === questions.length - 1 ? (
          <SubmitButton
            onClick={handleSubmit}
            disabled={isSubmitting || currentResponse === undefined}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Cuestionario'}
          </SubmitButton>
        ) : (
          <NextButton
            onClick={handleNext}
            disabled={currentResponse === undefined}
          >
            Siguiente
          </NextButton>
        )}
      </NavigationButtons>
    </Container>
  );
};

export default Questionnaire;