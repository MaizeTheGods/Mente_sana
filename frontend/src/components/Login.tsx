import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  PageContainer,
  GlassCard,
  PageTitle,
  PageSubtitle,
  StyledForm,
  FormGroup,
  StyledLabel,
  StyledInput,
  StyledButton,
  ErrorMessage,
  LinkText,
  IconWrapper
} from './SharedStyles';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <GlassCard>
        <IconWrapper>
          <img src="/logo.png" alt="Mente Sana Logo" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        </IconWrapper>
        <PageTitle>Bienvenido</PageTitle>
        <PageSubtitle>Ingresa a tu espacio de paz mental</PageSubtitle>

        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <StyledLabel htmlFor="email">Correo Electrónico</StyledLabel>
            <StyledInput
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </FormGroup>

          <FormGroup>
            <StyledLabel htmlFor="password">Contraseña</StyledLabel>
            <StyledInput
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </FormGroup>

          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </StyledButton>
        </StyledForm>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LinkText>
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </LinkText>
      </GlassCard>
    </PageContainer>
  );
};

export default Login;