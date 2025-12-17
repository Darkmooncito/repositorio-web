/**
 * ChatPanel component
 * Real-time chat interface with message history and input
 * 
 * @component
 * @example
 * <ChatPanel
 *   messages={messages}
 *   onSendMessage={(msg) => console.log(msg)}
 *   isConnected={true}
 *   currentUser="John"
 * />
 */
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from '../Icons/Icons';
import './ChatPanel.css';

/**
 * Message interface
 */
interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  /** Array of chat messages */
  messages: Message[];
  /** Callback when sending a message */
  onSendMessage: (message: string) => void;
  /** Connection status to chat server */
  isConnected: boolean;
  /** Current user's username */
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

  /**
   * Scrolls to the bottom of the message list
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handles form submission for sending messages
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  /**
   * Formats timestamp to display time
   */
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <h3>Chat</h3>
        <span className={`chat-panel__status ${isConnected ? 'chat-panel__status--connected' : ''}`}>
          <span className="chat-panel__status-dot"></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="chat-panel__messages">
        {messages.length === 0 ? (
          <div className="chat-panel__empty">
            <p>No messages yet</p>
            <p className="chat-panel__empty-hint">Start the conversation</p>
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
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={!isConnected}
          aria-label="Message input"
        />
        <button
          type="submit"
          className="chat-panel__send-button"
          disabled={!isConnected || !inputMessage.trim()}
          aria-label="Send message"
        >
          <SendIcon size={20} />
        </button>
      </form>
    </div>
  );
};