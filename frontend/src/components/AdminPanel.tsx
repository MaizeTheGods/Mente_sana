import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const Title = styled.h1`
  color: #2e7d32;
  margin-bottom: 10px;
  font-size: 32px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 16px;
  opacity: 0.9;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #2e7d32;
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
`;

const UsersTable = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr;
  gap: 15px;
  padding: 15px 20px;
  background: #2e7d32;
  color: white;
  font-weight: 600;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr;
  gap: 15px;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  align-items: center;

  &:hover {
    background: #f1f8e9;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2e7d32;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #666;
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch (props.role) {
      case 'owner':
        return 'background: #ffd700; color: #333;';
      case 'admin':
        return 'background: #ff6b6b; color: white;';
      default:
        return 'background: #4caf50; color: white;';
    }
  }}
`;

const StatusBadge = styled.span<{ active: boolean }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  ${props => props.active
    ? 'background: #4caf50; color: white;'
    : 'background: #ff6b6b; color: white;'
  }
`;

const ActionButton = styled.button<{ variant: 'primary' | 'danger' | 'success' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => {
    switch (props.variant) {
      case 'danger':
        return 'background: #dc3545; color: white; &:hover { background: #c82333; }';
      case 'success':
        return 'background: #28a745; color: white; &:hover { background: #218838; }';
      default:
        return 'background: #007bff; color: white; &:hover { background: #0056b3; }';
    }
  }}
`;

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 12px;
  background: white;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const Error = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (!statsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to load admin data') as never;
      }

      const statsData = await statsResponse.json();
      const usersData = await usersResponse.json();

      setStats(statsData);
      setUsers(usersData.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'owner') {
      loadAdminData();
    }
  }, [user]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role') as never;
      }

      // Reload data
      loadAdminData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user status') as never;
      }

      // Reload data
      loadAdminData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user') as never;
      }

      // Reload data
      loadAdminData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return (
      <Container>
        <Error>Acceso denegado. Solo administradores pueden acceder a este panel.</Error>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Loading>Cargando datos del panel de administración...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Panel de Administración</Title>
        <Subtitle>Gestión de usuarios y contenido de Mente Sana</Subtitle>
      </Header>

      {error && <Error>{error}</Error>}

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.stats.totalUsers}</StatNumber>
            <StatLabel>Usuarios Totales</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.stats.activeUsers}</StatNumber>
            <StatLabel>Usuarios Activos</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.stats.adminUsers}</StatNumber>
            <StatLabel>Administradores</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.stats.totalExercises}</StatNumber>
            <StatLabel>Ejercicios</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.stats.totalTips}</StatNumber>
            <StatLabel>Consejos</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <Section>
        <SectionTitle>Gestión de Usuarios</SectionTitle>
        <UsersTable>
          <TableHeader>
            <div>Usuario</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Estado</div>
            <div>Acciones</div>
          </TableHeader>

          {users.map(user => (
            <TableRow key={user._id}>
              <UserInfo>
                <UserName>{user.firstName} {user.lastName}</UserName>
                <UserEmail>{user.username}</UserEmail>
              </UserInfo>

              <div>{user.email}</div>

              <div>
                {user.role === 'owner' ? (
                  <RoleBadge role={user.role}>Owner</RoleBadge>
                ) : (
                  <Select
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    disabled={user.role === 'owner'}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </Select>
                )}
              </div>

              <div>
                <StatusBadge active={user.isActive}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </StatusBadge>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  variant={user.isActive ? 'danger' : 'success'}
                  onClick={() => toggleUserStatus(user._id, user.isActive)}
                  disabled={user.role === 'owner'}
                >
                  {user.isActive ? 'Desactivar' : 'Activar'}
                </ActionButton>

                {user.role !== 'owner' && (
                  <ActionButton
                    variant="danger"
                    onClick={() => deleteUser(user._id)}
                  >
                    Eliminar
                  </ActionButton>
                )}
              </div>
            </TableRow>
          ))}
        </UsersTable>
      </Section>
    </Container>
  );
};

export default AdminPanel;