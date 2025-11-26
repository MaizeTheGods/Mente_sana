import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  padding: 0;
  position: relative;
  overflow-x: hidden;
`;

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; /* Default max-width, can be overridden */
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

export const PageTitle = styled.h2`
  text-align: center;
  color: #2e7d32;
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: 700;
`;

export const PageSubtitle = styled.p`
  text-align: center;
  color: #4caf50;
  margin-bottom: 30px;
  font-size: 16px;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled.label`
  font-weight: 500;
  color: #2e7d32;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const StyledInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #c8e6c9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f1f8e9;

  &:focus {
    outline: none;
    border-color: #4caf50;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  }

  &::placeholder {
    color: #a5d6a7;
  }
`;

export const StyledSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #c8e6c9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f1f8e9;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4caf50;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  }
`;

export const StyledButton = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
  }
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background: #fce4ec;
  border-radius: 8px;
  border: 1px solid #f8bbd0;
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;

  a {
    color: #2e7d32;
    text-decoration: none;
    font-weight: 600;
    margin-left: 5px;
    transition: color 0.2s;

    &:hover {
      color: #1b5e20;
      text-decoration: underline;
    }
  }
`;

export const IconWrapper = styled.div`
  text-align: center;
  font-size: 48px;
  margin-bottom: 16px;
`;
