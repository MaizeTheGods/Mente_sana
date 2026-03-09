import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  Button,
  StyledInput,
  StyledSelect,
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

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  padding: 40px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/inicio');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContainer>
      <RegisterCard>
        <Header>
          <Title>Crear Cuenta</Title>
          <p style={{ color: '#64748b' }}>Únete a nuestra comunidad de bienestar</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Nombre de Usuario</Label>
            <StyledInput
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="usuario123"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
            <StyledInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <StyledInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 8 caracteres"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">Nombre</Label>
              <StyledInput
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Apellido</Label>
              <StyledInput
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Tu apellido"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <StyledInput
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="gender">Género</Label>
              <StyledSelect
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="other">Otro</option>
                <option value="prefer_not_to_say">Prefiero no decir</option>
              </StyledSelect>
            </FormGroup>
          </FormRow>

          <Button type="submit" disabled={isLoading} variant="primary" style={{ marginTop: '10px' }}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </Form>

        {error && <ErrorMessage style={{ marginTop: '20px' }}>{error}</ErrorMessage>}

        <LinkText style={{ marginTop: '24px', textAlign: 'center' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#2e7d32', fontWeight: '600' }}>Inicia sesión aquí</Link>
        </LinkText>
      </RegisterCard>
    </CenteredContainer>
  );
};

export default Register;