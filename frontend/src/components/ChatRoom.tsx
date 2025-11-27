import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup, ChatMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%);
  padding: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      #f1f8e9 25%,
      #e8f5e8 25%,
      #e8f5e8 50%,
      #f1f8e9 50%,
      #f1f8e9 75%,
      #e8f5e8 75%,
      #e8f5e8
    );
    background-size: 40px 40px;
    animation: move 4s linear infinite;
    opacity: 0.3;
    pointer-events: none;
  }

  @keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 40px 40px;
    }
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 16px 20px;
    margin-bottom: 20px;
    border-radius: 12px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 12px;
    align-items: flex-start;
  }
`;

const GroupTitle = styled.h1`
  color: #2e7d32;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    line-height: 1.2;
  }
`;

const GroupDescription = styled.p`
  color: #4caf50;
  font-size: 1.125rem;
  margin: 8px 0 0 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 4px 0 0 0;
    line-height: 1.3;
  }
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
    border-radius: 10px;
    align-self: flex-start;
  }
`;

const ChatLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  min-height: 600px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 768px) {
    gap: 12px;
    min-height: calc(100vh - 200px);
  }
`;

const MessagesSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

const GroupInfoSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;

  @media (max-width: 1024px) {
    order: -1;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin-bottom: 8px;
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

  @media (max-width: 768px) {
    padding: 16px;
    min-height: 250px;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 4px;
  animation: fadeInUp 0.4s ease-out;
  padding: 0 24px;

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

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const TypingBubble = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #2c3e50;
  padding: 16px 20px;
  border-radius: 20px 20px 20px 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 200px;

  &::before {
    content: '';
    position: absolute;
    left: -8px;
    bottom: 16px;
    border-right: 8px solid #ffffff;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    border-radius: 18px 18px 18px 4px;

    &::before {
      left: -6px;
      bottom: 14px;
      border-right: 6px solid #ffffff;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
  }
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const TypingDot = styled.div<{ delay: number }>`
  width: 6px;
  height: 6px;
  background: #4caf50;
  border-radius: 50%;
  animation: typingBounce 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;

  @keyframes typingBounce {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const TypingText = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const MessageMenuButton = styled.button`
  background: rgba(149, 165, 166, 0.1);
  color: #95a5a6;
  border: 1px solid rgba(149, 165, 166, 0.3);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  top: -8px;
  right: -8px;
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: scale(0.8);

  &:hover {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.3);
    transform: scale(1);
  }

  @media (max-width: 768px) {
    padding: 3px 6px;
    font-size: 12px;
    border-radius: 10px;
    top: -6px;
    right: -6px;
  }
`;

const MessageMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: -40px;
  right: -8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 100px;
  opacity: ${props => props.isOpen ? 1 : 0};
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.8)'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: all 0.2s ease;
  z-index: 10;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }

  &:first-child {
    color: #e74c3c;
  }
`;

const Message = styled.div<{ isOwn: boolean }>`
  display: flex;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 4px;
  animation: fadeInUp 0.4s ease-out;
  position: relative;

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

  /* Show menu button on hover for desktop */
  &:hover ${MessageMenuButton} {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: 768px) {
    margin-bottom: 2px;
  }
`;

const MessageWrapper = styled.div<{ isOwn: boolean }>`
  position: relative;
  max-width: 75%;
  min-width: 120px;

  @media (max-width: 768px) {
    max-width: 85%;
    min-width: 100px;
  }
`;

const MessageSender = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 4px;
  }
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
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }

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

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 16px;
    line-height: 1.4;
    border-radius: ${props => props.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};

    &::before {
      ${props => props.isOwn
        ? 'right: -6px; border-left: 6px solid #4caf50;'
        : 'left: -6px; border-right: 6px solid #ffffff;'};
      bottom: 14px;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
  }
`;

const MessageTime = styled.div<{ isOwn: boolean }>`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
  color: ${props => props.isOwn ? 'rgba(255, 255, 255, 0.8)' : '#95a5a6'};

  @media (max-width: 768px) {
    font-size: 11px;
    margin-top: 6px;
  }
`;

const InputContainer = styled.div`
  border-top: 2px solid #e9ecef;
  padding: 24px 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 0 0 20px 20px;

  @media (max-width: 768px) {
    padding: 16px 20px;
    border-radius: 0 0 12px 12px;
  }
`;

const MessageForm = styled.form`
  display: flex;
  gap: 16px;
  align-items: center;
  max-width: 100%;

  @media (max-width: 768px) {
    gap: 12px;
    align-items: flex-end;
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 16px 24px;
  border: 2px solid #e1e8ed;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  resize: vertical;
  min-height: 20px;
  max-height: 120px;
  line-height: 1.4;

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #adb5bd;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 16px;
    border-radius: 25px;
    min-height: 48px;
    max-height: 100px;
    resize: none;
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

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
    min-width: 80px;
    border-radius: 25px;
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
  const { user } = useAuth();
  const [group, setGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>('');
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ firstName: string; lastName: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (id && user) {
      loadGroup();
      loadMessages();
    }
  }, [id, user]);

  // Poll for new messages and typing users every 5 seconds
  useEffect(() => {
    if (!id || !user) return;

    const interval = setInterval(() => {
      loadMessages();
      loadTypingUsers();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [id, user]);

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

  const loadMessages = async (page = 1, append = false) => {
    try {
      const response = await chatAPI.getMessages(id!, { limit: 30, page });
      if (append) {
        setMessages(prev => [...response.messages, ...prev]);
      } else {
        setMessages(response.messages);
      }
      setHasMoreMessages(response.messages.length === 30);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('No se pudieron cargar los mensajes.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoadingMore) return;

    setIsLoadingMore(true);
    await loadMessages(currentPage + 1, true);
  };

  const loadTypingUsers = async () => {
    try {
      const response = await chatAPI.getTypingUsers(id!);
      // Filter out current user
      const filteredUsers = response.typingUsers.filter(
        typingUser => !(user?.firstName === typingUser.firstName && user?.lastName === typingUser.lastName)
      );
      setTypingUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to load typing users:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to send message. Conditions:', {
      hasContent: !!newMessage.trim(),
      notSending: !isSending
    });

    if (!newMessage.trim()) {
      console.log('Not sending: message is empty');
      return;
    }
    if (isSending) {
      console.log('Not sending: already sending a message');
      return;
    }

    console.log('Sending message:', newMessage.trim());
    // Stop typing indicator
    try {
      await chatAPI.stopTyping(id!);
    } catch (error) {
      console.error('Failed to stop typing:', error);
    }

    setIsSending(true);
    try {
      await chatAPI.sendMessage(id!, newMessage.trim());
      setNewMessage('');
      console.log('Message sent successfully');
      // Reload messages to show the new one
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      await chatAPI.deleteMessage(id!, messageId);
      setMenuOpenFor(null); // Close menu after deletion
      // Reload messages to reflect the deletion
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
      setError('No se pudo eliminar el mensaje. Inténtalo de nuevo.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    console.log('Input changed to:', value);
    setNewMessage(value);

    // Handle typing indicator
    if (value.trim() && !isSending) {
      // Start typing
      chatAPI.startTyping(id!).catch(error => console.error('Failed to start typing:', error));

      // Clear existing timer
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }

      // Set timer to stop typing indicator after 2 seconds of no input
      typingTimer.current = setTimeout(() => {
        chatAPI.stopTyping(id!).catch(error => console.error('Failed to stop typing:', error));
      }, 2000);
    } else {
      // Stop typing
      chatAPI.stopTyping(id!).catch(error => console.error('Failed to stop typing:', error));
    }
  };

  const toggleMenu = (messageId: string) => {
    setMenuOpenFor(menuOpenFor === messageId ? null : messageId);
  };

  const handleMouseEnter = (messageId: string) => {
    // Only show menu button on hover for desktop
    if (window.innerWidth > 768) {
      // Could add hover state here if needed
    }
  };

  const handleMouseLeave = () => {
    // Close menu when mouse leaves (for desktop)
    if (window.innerWidth > 768) {
      setMenuOpenFor(null);
    }
  };

  const handleTouchStart = (messageId: string) => {
    // Start long press timer for mobile
    if (window.innerWidth <= 768) {
      longPressTimer.current = setTimeout(() => {
        setMenuOpenFor(messageId);
      }, 500); // 500ms long press
    }
  };

  const handleTouchEnd = () => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpenFor(null);
    };

    if (menuOpenFor) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpenFor]);

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
        <DashboardContainer>
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#5a6c7d',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #4caf50',
              borderRadius: '50%',
              borderTopColor: 'transparent',
              animation: 'spin 1s ease-in-out infinite',
              margin: '0 auto 20px'
            }}></div>
            Cargando sala de chat...
          </div>
        </DashboardContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <DashboardContainer>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.5
            }}>⚠️</div>
            <h3 style={{
              color: '#c0392b',
              marginBottom: '12px',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>Error al cargar el chat</h3>
            <p style={{
              color: '#5a6c7d',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>{error}</p>
            <BackButton onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </BackButton>
          </div>
        </DashboardContainer>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container>
        <DashboardContainer>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.5
            }}>🔍</div>
            <h3 style={{
              color: '#c0392b',
              marginBottom: '12px',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>Grupo no encontrado</h3>
            <p style={{
              color: '#5a6c7d',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>El grupo que buscas no existe o ha sido eliminado.</p>
            <BackButton onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </BackButton>
          </div>
        </DashboardContainer>
      </Container>
    );
  }

  return (
    <Container>
      <DashboardContainer>
        {/* Header */}
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

        {/* Main Chat Layout */}
        <ChatLayout>
          {/* Messages Section */}
          <MessagesSection>
            <MessagesContainer
              ref={messagesContainerRef}
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
                  loadMoreMessages();
                }
              }}
            >
              {isLoadingMore && (
                <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
                  Cargando más mensajes...
                </div>
              )}
              {messages.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>💬</EmptyIcon>
                  <EmptyText>¡Sé el primero en enviar un mensaje!</EmptyText>
                  <EmptySubtext>Comparte tus pensamientos y conecta con otros miembros del grupo.</EmptySubtext>
                </EmptyState>
              ) : (
                <MessageList>
                  {messages.map(message => {
                    const isOwn = user?._id === message.senderId._id;
                    return (
                      <Message
                        key={message._id}
                        isOwn={isOwn}
                        onMouseEnter={() => handleMouseEnter(message._id)}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={() => handleTouchStart(message._id)}
                        onTouchEnd={handleTouchEnd}
                      >
                        <MessageWrapper isOwn={isOwn}>
                          {!isOwn && (
                            <MessageSender>{message.senderId.firstName} {message.senderId.lastName}</MessageSender>
                          )}
                          <MessageBubble isOwn={isOwn}>
                            {message.content}
                          </MessageBubble>
                          <MessageTime isOwn={isOwn}>{formatTime(message.createdAt)}</MessageTime>
                          {isOwn && (
                            <>
                              <MessageMenuButton onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(message._id);
                              }}>
                                ⋯
                              </MessageMenuButton>
                              <MessageMenu isOpen={menuOpenFor === message._id}>
                                <MenuItem onClick={() => handleDeleteMessage(message._id)}>
                                  🗑️ Eliminar
                                </MenuItem>
                              </MessageMenu>
                            </>
                          )}
                        </MessageWrapper>
                      </Message>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </MessageList>
              )}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <TypingIndicator>
                  <TypingBubble>
                    <TypingDots>
                      <TypingDot delay={0} />
                      <TypingDot delay={0.2} />
                      <TypingDot delay={0.4} />
                    </TypingDots>
                    <TypingText>
                      {typingUsers.length === 1
                        ? `${typingUsers[0].firstName} ${typingUsers[0].lastName} está escribiendo...`
                        : `${typingUsers.length} personas están escribiendo...`
                      }
                    </TypingText>
                  </TypingBubble>
                </TypingIndicator>
              )}

            </MessagesContainer>

            <InputContainer>
              <MessageForm onSubmit={handleSendMessage}>
                <MessageInput
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={handleInputChange}
                  disabled={isSending}
                />
                <SendButton type="submit" disabled={!newMessage.trim() || isSending}>
                  {isSending ? 'Enviando...' : 'Enviar'}
                </SendButton>
              </MessageForm>
            </InputContainer>
          </MessagesSection>

          {/* Group Info Sidebar */}
          <GroupInfoSection>
            <h3 style={{ color: '#2e7d32', marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600' }}>
              👥 Información del Grupo
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4caf50', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                Descripción
              </h4>
              <p style={{ color: '#5a6c7d', lineHeight: '1.5', fontSize: '0.9rem' }}>
                {group.description}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4caf50', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                Reglas del Grupo
              </h4>
              <ul style={{ color: '#5a6c7d', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>Respeta a todos los miembros</li>
                <li>Mantén la confidencialidad</li>
                <li>Sé empático y comprensivo</li>
                <li>Si necesitas ayuda urgente, contacta servicios profesionales</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4caf50', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                Consejos Útiles
              </h4>
              <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <p style={{ color: '#5a6c7d', fontSize: '0.85rem', margin: '0', lineHeight: '1.4' }}>
                  💡 <strong>Recuerda:</strong> Este espacio es para compartir experiencias y apoyarnos mutuamente.
                  Si sientes que necesitas ayuda profesional, no dudes en buscarla.
                </p>
              </div>
            </div>
          </GroupInfoSection>
        </ChatLayout>
      </DashboardContainer>
    </Container>
  );
};

export default ChatRoom;