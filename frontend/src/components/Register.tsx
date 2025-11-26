import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  PageContainer,
  GlassCard,
  PageTitle,
  StyledForm,
  FormGroup,
  StyledLabel,
  StyledInput,
  StyledSelect,
  StyledButton,
  ErrorMessage,
  LinkText
} from './SharedStyles';

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <GlassCard style={{ maxWidth: '600px' }}>
        <PageTitle>Crear Cuenta</PageTitle>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <StyledLabel htmlFor="username">Nombre de Usuario</StyledLabel>
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
            <StyledLabel htmlFor="email">Correo Electrónico</StyledLabel>
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
            <StyledLabel htmlFor="password">Contraseña</StyledLabel>
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
              <StyledLabel htmlFor="firstName">Nombre</StyledLabel>
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
              <StyledLabel htmlFor="lastName">Apellido</StyledLabel>
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
              <StyledLabel htmlFor="dateOfBirth">Fecha de Nacimiento</StyledLabel>
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
              <StyledLabel htmlFor="gender">Género</StyledLabel>
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

          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </StyledButton>
        </StyledForm>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LinkText>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </LinkText>
      </GlassCard>
    </PageContainer>
  );
};

export default Register;