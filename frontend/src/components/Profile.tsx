import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { uploadsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  Button,
  CubeLoader,
  CubeSquare,
  LoadingText
} from './SharedStyles';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileCard = styled(Card)`
  text-align: center;
  margin-bottom: 32px;
`;

const CurrentAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 20px;
  border: 4px solid #2e7d32;
  overflow: hidden;
  background: #f8fafc;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2e7d32, #4caf50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
`;

const UserInfo = styled.div`
  margin-bottom: 24px;
`;

const UserName = styled.h2`
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 24px;
`;

const UserEmail = styled.p`
  color: #64748b;
  font-size: 16px;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin-top: 32px;
`;

const AvatarOption = styled.div<{ selected: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid ${props => props.selected ? '#2e7d32' : '#e2e8f0'};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
  position: relative;

  &:hover {
    border-color: #2e7d32;
    transform: scale(1.05);
  }

  ${props => props.selected && `
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.2);
  `}
`;

const AvatarOptionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarOptionPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2e7d32, #4caf50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const Profile: React.FC = () => {
  const { user, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Available profile images (these would be provided by us)
  const defaultImages = [
    'default-avatar.png',
    'avatar-1.png',
    'avatar-2.png',
    'avatar-3.png',
    'avatar-4.png',
    'avatar-5.png',
    'avatar-6.png',
    'avatar-7.png',
    'avatar-8.png'
  ];

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const response = await uploadsAPI.getAvatars();
        // Add default avatar option
        setAvailableImages(['default-avatar.png', ...response.avatars.map(avatar => avatar.url)]);
      } catch (error) {
        console.error('Error loading avatars:', error);
        // Fallback to default images
        setAvailableImages(defaultImages);
      }
    };

    loadAvatars();

    // Set current selected image
    if (user?.preferences?.profileImage) {
      setSelectedImage(user.preferences.profileImage);
    }
  }, [user]);

  const handleImageSelect = (imageName: string) => {
    setSelectedImage(imageName);
  };

  const handleSaveProfile = async () => {
    if (!selectedImage || !user) return;

    setIsSaving(true);
    try {
      await updateProfileImage(selectedImage);
      alert('Imagen de perfil actualizada exitosamente');
    } catch (error) {
      console.error('Error updating profile image:', error);
      alert('Error al actualizar la imagen de perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
        <CubeLoader>
          <CubeSquare delay={0} />
          <CubeSquare delay={1} />
          <CubeSquare delay={2} />
          <CubeSquare delay={3} />
          <CubeSquare delay={4} />
          <CubeSquare delay={5} />
          <CubeSquare delay={6} />
          <CubeSquare delay={7} />
        </CubeLoader>
        <LoadingText>Cargando perfil...</LoadingText>
      </div>
    );
  }

  if (!user) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <ProfileContainer>
      <PageHeader>
        <div>
          <PageTitle>Mi Perfil</PageTitle>
          <PageSubtitle>Personaliza tu imagen de perfil</PageSubtitle>
        </div>
      </PageHeader>

      <ProfileCard>
        <CurrentAvatar>
          {selectedImage && selectedImage !== 'default-avatar.png' ? (
            <AvatarImage
              src={selectedImage}
              alt="Avatar actual"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <AvatarPlaceholder style={{
            display: selectedImage === 'default-avatar.png' || !selectedImage ? 'flex' : 'none'
          }}>
            {user.firstName[0]}{user.lastName[0]}
          </AvatarPlaceholder>
        </CurrentAvatar>

        <UserInfo>
          <UserName>{user.firstName} {user.lastName}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>

        <div style={{ marginTop: '24px' }}>
          <Button
            variant="primary"
            onClick={handleSaveProfile}
            disabled={isSaving || selectedImage === user?.preferences?.profileImage}
            style={{ marginRight: '12px' }}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </ProfileCard>

      <Card>
        <h3 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '20px' }}>
          Selecciona tu imagen de perfil
        </h3>

        <AvatarGrid>
          {availableImages.map((imageName) => (
            <AvatarOption
              key={imageName}
              selected={selectedImage === imageName}
              onClick={() => handleImageSelect(imageName)}
            >
              {imageName === 'default-avatar.png' ? (
                <AvatarOptionPlaceholder>
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarOptionPlaceholder>
              ) : (
                <>
                  <AvatarOptionImage
                    src={imageName}
                    alt={`Avatar ${imageName}`}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <AvatarOptionPlaceholder style={{ display: 'none' }}>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarOptionPlaceholder>
                </>
              )}
              {selectedImage === imageName && (
                <SelectedIndicator>✓</SelectedIndicator>
              )}
            </AvatarOption>
          ))}
        </AvatarGrid>
      </Card>
    </ProfileContainer>
  );
};

export default Profile;