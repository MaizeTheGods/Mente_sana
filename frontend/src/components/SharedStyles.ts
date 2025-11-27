import styled, { keyframes, css } from 'styled-components';

// --- Animations ---
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Layout & Containers ---
export const PageContainer = styled.div`
  /* No longer needed as main wrapper, but kept for compatibility if needed */
  width: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 16px;
  margin-top: 8px;
`;

// --- Cards ---
export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

export const GlassCard = styled(Card)`
  /* Keeping name for compatibility, but updating style to match new design */
  background: white;
  backdrop-filter: none;
  border: 1px solid #f1f5f9;
`;

// --- Forms ---
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
  font-size: 14px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

// --- Buttons ---
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'danger':
        return css`
          background: #fee2e2;
          color: #dc2626;
          &:hover { background: #fecaca; }
        `;
      case 'success':
        return css`
          background: #dcfce7;
          color: #16a34a;
          &:hover { background: #bbf7d0; }
        `;
      case 'outline':
        return css`
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
          &:hover { background: #f8fafc; border-color: #94a3b8; }
        `;
      case 'secondary':
        return css`
          background: #e2e8f0;
          color: #475569;
          &:hover { background: #cbd5e1; }
        `;
      case 'primary':
      default:
        return css`
          background: #2e7d32;
          color: white;
          &:hover { background: #1b5e20; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const StyledButton = styled(Button)`
  /* Alias for compatibility */
  width: 100%;
  justify-content: center;
`;

// --- Utilities ---
export const Badge = styled.span<{ color: string; bg: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
  padding: 10px;
  background: #fee2e2;
  border-radius: 8px;
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #64748b;
  font-size: 14px;

  a {
    color: #2e7d32;
    text-decoration: none;
    font-weight: 600;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const IconWrapper = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

