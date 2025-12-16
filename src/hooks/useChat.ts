import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3002';

export const useChat = (roomId: string, username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conectar al servidor de chat
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

    // Recibir mensajes
    socketRef.current.on('message', (data: { id: string; username: string; text: string; timestamp: string }) => {
      const message: Message = {
        id: data.id,
        username: data.username,
        text: data.text,
        timestamp: new Date(data.timestamp)
      };
      setMessages(prev => [...prev, message]);
    });

    // Recibir historial de mensajes
    socketRef.current.on('message-history', (history: Array<{ id: string; username: string; text: string; timestamp: string }>) => {
      const messagesHistory = history.map(msg => ({
        id: msg.id,
        username: msg.username,
        text: msg.text,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesHistory);
    });

    // Usuario se unió
    socketRef.current.on('user-joined', ({ username: joinedUser }) => {
      if (joinedUser !== username) {
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          username: 'Sistema',
          text: `${joinedUser} se ha unido a la sala`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    });

    // Usuario se fue
    socketRef.current.on('user-left', ({ username: leftUser }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        username: 'Sistema',
        text: `${leftUser} ha salido de la sala`,
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