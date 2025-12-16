import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  currentUser: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isConnected,
  currentUser
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <h3>Chat</h3>
        <span className={`chat-panel__status ${isConnected ? 'chat-panel__status--connected' : ''}`}>
          {isConnected ? '● Conectado' : '○ Desconectado'}
        </span>
      </div>

      <div className="chat-panel__messages">
        {messages.length === 0 ? (
          <div className="chat-panel__empty">
            <p>No hay mensajes aún</p>
            <p className="chat-panel__empty-hint">Inicia la conversación 👋</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.username === currentUser ? 'chat-message--own' : ''
              }`}
            >
              <div className="chat-message__header">
                <span className="chat-message__username">{message.username}</span>
                <span className="chat-message__time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="chat-message__text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-panel__input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-panel__input"
          placeholder="Escribe un mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={!isConnected}
        />
        <button
          type="submit"
          className="chat-panel__send-button"
          disabled={!isConnected || !inputMessage.trim()}
        >
          ➤
        </button>
      </form>
    </div>
  );
};