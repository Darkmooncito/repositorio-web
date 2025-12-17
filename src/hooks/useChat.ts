import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Message interface for chat messages
 */
interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3002';

/**
 * Custom hook for managing real-time chat functionality
 * 
 * @param {string} roomId - Unique identifier for the chat room
 * @param {string} username - Display name of the current user
 * @returns {Object} Chat state and control functions
 * 
 * @example
 * const { messages, sendMessage, isConnected } = useChat('room123', 'John');
 */
export const useChat = (roomId: string, username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(CHAT_SERVER_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      socketRef.current!.emit('join-room', { roomId, username });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    socketRef.current.on('message', (data: { id: string; username: string; text: string; timestamp: string }) => {
      const message: Message = {
        id: data.id,
        username: data.username,
        text: data.text,
        timestamp: new Date(data.timestamp)
      };
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('message-history', (history: Array<{ id: string; username: string; text: string; timestamp: string }>) => {
      const messagesHistory = history.map(msg => ({
        id: msg.id,
        username: msg.username,
        text: msg.text,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesHistory);
    });

    socketRef.current.on('user-joined', ({ username: joinedUser }) => {
      if (joinedUser !== username) {
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          username: 'System',
          text: `${joinedUser} joined the room`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    });

    socketRef.current.on('user-left', ({ username: leftUser }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        username: 'System',
        text: `${leftUser} left the room`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-room');
        socketRef.current.disconnect();
      }
    };
  }, [roomId, username]);

  /**
   * Sends a text message to the chat room
   * 
   * @param {string} text - Message content to send
   */
  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', {
        roomId,
        username,
        text
      });
    }
  }, [roomId, username, isConnected]);

  return {
    messages,
    sendMessage,
    isConnected
  };
};