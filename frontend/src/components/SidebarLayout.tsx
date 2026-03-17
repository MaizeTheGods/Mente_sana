import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MusicPlayer from './MusicPlayer';

// --- Styled Components (Adapted from AdminPanel) ---

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 260px;
  background: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  transition: transform 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    z-index: 1100;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1050;
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #2e7d32;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const NavItem = styled.div<{ active: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.active ? '#2e7d32' : '#64748b'};
  background: ${props => props.active ? '#e8f5e9' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#e8f5e9' : '#f8fafc'};
    color: #2e7d32;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 260px;
  padding: 30px;
  padding-top: 30px;
  overflow-y: auto;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
    /* Ensure content starts below the fixed mobile header (with safe-area support) */
    padding-top: max(96px, calc(64px + env(safe-area-inset-top)));
  }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1060;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    height: 64px; /* stabilize header height for consistent content offset */
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #1e293b;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  overflow: hidden;
  position: relative;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
`;

const UserRole = styled.span`
  color: #64748b;
  font-size: 12px;
`;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Perfil', icon: '👤' },
    { path: '/questionnaire', label: 'Cuestionario', icon: '📝' },
    { path: '/diary', label: 'Diario', icon: '📔' },
    { path: '/exercises', label: 'Ejercicios', icon: '🧘' },
    { path: '/tips', label: 'Consejos', icon: '💡' },
    { path: '/reels', label: 'Reels', icon: '🎥' },
    { path: '/juegos', label: 'Juegos', icon: '🎮' },
    { path: '/blog', label: 'Blog', icon: '📖' },
    { path: '/chat', label: 'Comunidad', icon: '👥' },
    { path: '/maps', label: 'Ayuda Profesional', icon: '🗺️' },
  ];

  if (user?.role === 'admin' || user?.role === 'owner') {
    navItems.push({ path: '/admin', label: 'Panel Admin', icon: '⚙️' });
  }

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <MobileHeader>
        <Logo onClick={() => navigate('/dashboard')}>🌿 Agora</Logo>
        <MenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </MenuButton>
      </MobileHeader>

      <Overlay isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />

      <Sidebar isOpen={isMobileMenuOpen}>
        <Logo onClick={() => navigate('/dashboard')}>
          🌿 Agora
        </Logo>

        {navItems.map(item => (
          <NavItem
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => handleNavClick(item.path)}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavItem>
        ))}

        <UserProfile>
          <Avatar>
            {user?.preferences?.profileImage && user.preferences.profileImage !== 'default-avatar.png' ? (
              <AvatarImage
                src={user.preferences.profileImage}
                alt="Avatar"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.textContent = user?.firstName?.[0] || '';
                  }
                }}
              />
            ) : (
              user?.firstName?.[0]
            )}
          </Avatar>
          <UserInfo>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserRole>{user?.role === 'user' ? 'Miembro' : user?.role}</UserRole>
          </UserInfo>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ef4444',
              fontSize: '18px'
            }}
            title="Cerrar Sesión"
          >
            ↪️
          </button>
        </UserProfile>
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>

      <MusicPlayer />
    </Layout>
  );
};

export default SidebarLayout;
