import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup, ChatMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
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

const ChatLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  height: calc(100vh - 140px);
  min-height: 500px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }
`;

const MessagesSection = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  height: 100%;
  border: 1px solid #e2e8f0;
`;

const GroupInfoSection = styled(Card)`
  height: fit-content;
  border: 1px solid #e2e8f0;

  @media (max-width: 1024px) {
    order: -1;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  background: ${props => props.isOwn ? '#2e7d32' : 'white'};
  color: ${props => props.isOwn ? 'white' : '#1e293b'};
  padding: 12px 16px;
  border-radius: 16px;
  border-bottom-right-radius: ${props => props.isOwn ? '4px' : '16px'};
  border-bottom-left-radius: ${props => props.isOwn ? '16px' : '4px'};
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  position: relative;
  word-wrap: break-word;
`;

const MessageSender = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #64748b;
`;

const MessageTime = styled.div<{ isOwn: boolean }>`
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.8;
  text-align: right;
`;

const InputContainer = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: none;
  height: 48px;
  min-height: 48px;
  max-height: 120px;
  font-family: inherit;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const ChatRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!id) return;
      try {
        const [groupRes, messagesRes] = await Promise.all([
          chatAPI.getGroup(id),
          chatAPI.getMessages(id)
        ]);
        setGroup(groupRes.group);
        setMessages(messagesRes.messages);
      } catch (error) {
        console.error('Failed to load chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGroupData();

    // Poll for new messages every 5 seconds
    const interval = setInterval(async () => {
      if (!id) return;
      try {
        const response = await chatAPI.getMessages(id);
        setMessages(response.messages);
      } catch (error) {
        console.error('Failed to poll messages:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;

    setIsSending(true);
    try {
      const response = await chatAPI.sendMessage(id, newMessage);
      setMessages([...messages, response.messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
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
        <LoadingText>Cargando chat...</LoadingText>
      </div>
    );
  }

  if (!group) return <div>Grupo no encontrado</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="outline" onClick={() => navigate('/chat')} style={{ padding: '8px 12px' }}>
            ←
          </Button>
          <div>
            <PageTitle>{group.name}</PageTitle>
            <PageSubtitle>{group.category} • {group.members.length} miembros</PageSubtitle>
          </div>
        </div>
      </PageHeader>

      <ChatLayout>
        <MessagesSection>
          <MessagesContainer>
            {messages.map((msg) => {
              const isOwn = msg.senderId._id === user?._id;
              return (
                <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                  {!isOwn && <MessageSender>{msg.senderId.firstName} {msg.senderId.lastName}</MessageSender>}
                  <MessageBubble isOwn={isOwn}>
                    {msg.content}
                    <MessageTime isOwn={isOwn}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </MessageTime>
                  </MessageBubble>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <MessageInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              style={{ height: '48px', width: '48px', padding: 0, borderRadius: '50%' }}
            >
              ➤
            </Button>
          </InputContainer>
        </MessagesSection>

        <GroupInfoSection>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>
            Sobre este grupo
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
            {group.description}
          </p>

          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
            Normas del grupo
          </h4>
          <ul style={{ fontSize: '13px', color: '#64748b', paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '4px' }}>Sé respetuoso y amable</li>
            <li style={{ marginBottom: '4px' }}>Mantén la confidencialidad</li>
            <li style={{ marginBottom: '4px' }}>No compartas información médica</li>
            <li>Apoya a los demás</li>
          </ul>
        </GroupInfoSection>
      </ChatLayout>
    </div>
  );
};

export default ChatRoom;