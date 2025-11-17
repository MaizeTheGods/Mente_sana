import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup, ChatMessage } from '../services/api';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  padding: 20px;
`;

const ChatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  padding: 20px;
  border-radius: 16px 16px 0 0;
`;

const GroupTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
`;

const GroupInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  opacity: 0.9;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: 400px;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div<{ isOwn: boolean }>`
  display: flex;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 8px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  background: ${props => props.isOwn ? '#4caf50' : '#f1f1f1'};
  color: ${props => props.isOwn ? 'white' : '#333'};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageSender = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #666;
`;

const MessageTime = styled.div`
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  border-top: 1px solid #e9ecef;
  padding: 20px;
  background: white;
  border-radius: 0 0 16px 16px;
`;

const MessageForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4caf50;
  }

  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 8px;
  margin: 20px;
  border: 1px solid #fcc;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  opacity: 0.7;
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
          <GroupTitle>{group.name}</GroupTitle>
          <GroupInfo>
            <span>{group.description}</span>
            <BackButton onClick={() => navigate('/chat')}>
              ← Grupos
            </BackButton>
          </GroupInfo>
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
                  <div>
                    <MessageSender>{message.sender.firstName} {message.sender.lastName}</MessageSender>
                    <MessageBubble isOwn={false}>
                      {message.content}
                      <MessageTime>{formatTime(message.createdAt)}</MessageTime>
                    </MessageBubble>
                  </div>
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