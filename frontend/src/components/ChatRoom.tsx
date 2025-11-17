import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup, ChatMessage } from '../services/api';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(
    to right,
    #2c3e50 0%,
    #2c3e50 33.33%,
    #34495e 33.33%,
    #34495e 66.66%,
    #2c3e50 66.66%,
    #2c3e50 100%
  );
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(52, 73, 94, 0.1) 0%,
      rgba(52, 73, 94, 0.1) 33.33%,
      rgba(44, 62, 80, 0.1) 33.33%,
      rgba(44, 62, 80, 0.1) 66.66%,
      rgba(52, 73, 94, 0.1) 66.66%,
      rgba(52, 73, 94, 0.1) 100%
    );
    pointer-events: none;
  }
`;

const ChatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  height: 85vh;
  overflow: hidden;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  padding: 24px 28px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
`;

const GroupTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  flex: 1;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const GroupDescription = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
  font-weight: 400;
  line-height: 1.4;
  color: white;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 300px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    border-radius: 10px;

    &:hover {
      background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
    }
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Message = styled.div<{ isOwn: boolean }>`
  display: flex;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 4px;
  animation: fadeInUp 0.4s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageWrapper = styled.div`
  max-width: 75%;
  min-width: 120px;
`;

const MessageSender = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  background: ${props => props.isOwn
    ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'};
  color: ${props => props.isOwn ? 'white' : '#2c3e50'};
  padding: 16px 20px;
  border-radius: ${props => props.isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: ${props => props.isOwn ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'};
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 15px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    ${props => props.isOwn
      ? 'right: -8px; border-left: 8px solid #4caf50;'
      : 'left: -8px; border-right: 8px solid #ffffff;'};
    bottom: 16px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
`;

const MessageTime = styled.div<{ isOwn: boolean }>`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
  color: ${props => props.isOwn ? 'rgba(255, 255, 255, 0.8)' : '#95a5a6'};
`;

const InputContainer = styled.div`
  border-top: 2px solid #e9ecef;
  padding: 24px 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 0 0 20px 20px;
`;

const MessageForm = styled.form`
  display: flex;
  gap: 16px;
  align-items: center;
  max-width: 100%;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 16px 24px;
  border: 2px solid #e1e8ed;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #adb5bd;
    font-weight: 400;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  padding: 16px 28px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
  min-width: 100px;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(76, 175, 80, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #5a6c7d;
  font-size: 18px;
  font-weight: 500;

  &::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #4caf50;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
    margin-left: 12px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee 0%, #fdd 100%);
  color: #c0392b;
  padding: 20px 24px;
  border-radius: 12px;
  margin: 24px;
  border: 1px solid #f5c6cb;
  text-align: center;
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.1);
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #5a6c7d;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.6) 100%);
  border-radius: 16px;
  margin: 20px;
  border: 2px dashed #e9ecef;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const EmptyText = styled.p`
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #2c3e50;
`;

const EmptySubtext = styled.p`
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
`;


const ChatRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (id) {
      loadGroup();
      loadMessages();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadGroup = async () => {
    try {
      const response = await chatAPI.getGroup(id!);
      setGroup(response.group);
    } catch (error) {
      console.error('Failed to load group:', error);
      setError('No se pudo cargar el grupo de chat.');
    }
  };

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMessages(id!);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('No se pudieron cargar los mensajes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await chatAPI.sendMessage(id!, newMessage.trim());
      setNewMessage('');
      // Reload messages to show the new one
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Container>
        <ChatCard>
          <LoadingMessage>Cargando chat...</LoadingMessage>
        </ChatCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ChatCard>
          <ErrorMessage>{error}</ErrorMessage>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <BackButton onClick={() => navigate('/chat')}>
              ← Volver a Grupos
            </BackButton>
          </div>
        </ChatCard>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container>
        <ChatCard>
          <ErrorMessage>Grupo no encontrado</ErrorMessage>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <BackButton onClick={() => navigate('/chat')}>
              ← Volver a Grupos
            </BackButton>
          </div>
        </ChatCard>
      </Container>
    );
  }

  return (
    <Container>
      <ChatCard>
        <Header>
          <HeaderContent>
            <div>
              <GroupTitle>{group.name}</GroupTitle>
              <GroupDescription>{group.description}</GroupDescription>
            </div>
            <BackButton onClick={() => navigate('/chat')}>
              ← Grupos
            </BackButton>
          </HeaderContent>
        </Header>

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <EmptyIcon>💬</EmptyIcon>
              <EmptyText>¡Sé el primero en enviar un mensaje!</EmptyText>
              <EmptySubtext>Comparte tus pensamientos y conecta con otros miembros del grupo.</EmptySubtext>
            </EmptyState>
          ) : (
            <MessageList>
              {messages.map(message => (
                <Message key={message._id} isOwn={false}>
                  <MessageWrapper>
                    <MessageSender>{message.senderId.firstName} {message.senderId.lastName}</MessageSender>
                    <MessageBubble isOwn={false}>
                      {message.content}
                    </MessageBubble>
                    <MessageTime isOwn={false}>{formatTime(message.createdAt)}</MessageTime>
                  </MessageWrapper>
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </MessageList>
          )}
        </MessagesContainer>

        <InputContainer>
          <MessageForm onSubmit={handleSendMessage}>
            <MessageInput
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending}
            />
            <SendButton type="submit" disabled={!newMessage.trim() || isSending}>
              {isSending ? 'Enviando...' : 'Enviar'}
            </SendButton>
          </MessageForm>
        </InputContainer>
      </ChatCard>
    </Container>
  );
};

export default ChatRoom;