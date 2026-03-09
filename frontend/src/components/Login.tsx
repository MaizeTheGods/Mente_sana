import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Card,
  Button,
  StyledInput,
  ErrorMessage,
  LinkText
} from './SharedStyles';

const CenteredContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdf4;
  padding: 20px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  padding: 40px;
  text-align: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const LogoImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 24px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin-bottom: 32px;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: color 0.2s;

  &:hover {
    color: #475569;
  }

  &:focus {
    outline: none;
    color: #2e7d32;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/inicio');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContainer>
      <LoginCard>
        <LogoImage src="/logo.png" alt="Agora Logo" />
        <Title>Bienvenido</Title>
        <Subtitle>Ingresa a tu espacio de paz mental</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
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
            <Label htmlFor="password">Contraseña</Label>
            <PasswordInputContainer>
              <StyledInput
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: '50px' }}
              />
              <PasswordToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁️"}
              </PasswordToggleButton>
            </PasswordInputContainer>
          </FormGroup>

          <Button type="submit" disabled={isLoading} variant="primary" style={{ marginTop: '10px' }}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Form>

        {error && <ErrorMessage style={{ marginTop: '20px' }}>{error}</ErrorMessage>}

        <LinkText style={{ marginTop: '24px' }}>
          ¿Aún no tienes cuenta? <Link to="/register" style={{ color: '#2e7d32', fontWeight: '600' }}>Regístrate aquí</Link>
        </LinkText>
      </LoginCard>
    </CenteredContainer>
  );
};

export default Login;