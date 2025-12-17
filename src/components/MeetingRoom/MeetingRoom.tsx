/**
 * MeetingRoom component
 * Main component that integrates video, chat, and media controls
 * 
 * @component
 * @example
 * <MeetingRoom roomId="abc123" username="John Doe" />
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoGrid } from '../VideoGrid/VideoGrid';
import { ChatPanel } from '../ChatPanel/ChatPanel';
import { MediaControls } from '../MediaControls/MediaControls';
import { CallEndIcon } from '../Icons/Icons';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useScreenShare } from '../../hooks/useScreenShare';
import { useChat } from '../../hooks/useChat';
import './MeetingRoom.css';

interface MeetingRoomProps {
  /** Unique room identifier */
  roomId: string;
  /** User's display name */
  username: string;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({ roomId, username }) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const navigate = useNavigate();

  const {
    localStream,
    remoteStreams,
    peers,
    connectToRoom,
    toggleAudio,
    toggleVideo,
    leaveRoom
  } = useWebRTC(roomId, username);

  const {
    isSharing,
    screenStream,
    startScreenShare,
    stopScreenShare
  } = useScreenShare();

  const {
    messages,
    sendMessage,
    isConnected
  } = useChat(roomId, username);

  useEffect(() => {
    connectToRoom();

    return () => {
      leaveRoom();
    };
  }, []);

  /**
   * Toggles microphone on/off
   */
  const handleToggleMic = () => {
    toggleAudio();
    setIsMicMuted(!isMicMuted);
  };

  /**
   * Toggles camera on/off
   */
  const handleToggleCamera = () => {
    toggleVideo();
    setIsCameraOff(!isCameraOff);
  };

  /**
   * Toggles screen sharing
   */
  const handleToggleScreenShare = async () => {
    if (isSharing) {
      stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  /**
   * Sends a chat message
   */
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  /**
   * Shows leave confirmation modal
   */
  const handleLeaveClick = () => {
    setShowLeaveModal(true);
  };

  /**
   * Confirms leaving the room
   */
  const handleConfirmLeave = () => {
    leaveRoom();
    navigate('/');
  };

  /**
   * Cancels leaving the room
   */
  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  return (
    <div className="meeting-room">
      <div className="meeting-room__header">
        <h2>Room: {roomId}</h2>
        <span className="meeting-room__username">{username}</span>
      </div>

      <div className="meeting-room__content">
        <div className="meeting-room__video-section">
          <VideoGrid
            localStream={localStream}
            remoteStreams={remoteStreams}
            screenStream={screenStream}
            peers={peers}
            username={username}
            isCameraOff={isCameraOff}
          />

          <MediaControls
            isMicMuted={isMicMuted}
            isCameraOff={isCameraOff}
            isSharing={isSharing}
            onToggleMic={handleToggleMic}
            onToggleCamera={handleToggleCamera}
            onToggleScreenShare={handleToggleScreenShare}
            onLeaveRoom={handleLeaveClick}
          />
        </div>

        {isChatOpen && (
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
            currentUser={username}
          />
        )}
      </div>

      <button
        className="meeting-room__toggle-chat"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label={isChatOpen ? 'Hide chat' : 'Show chat'}
      >
        {isChatOpen ? '›' : '‹'}
      </button>

      {showLeaveModal && (
        <div className="leave-modal-overlay" onClick={handleCancelLeave}>
          <div className="leave-modal" onClick={(e) => e.stopPropagation()}>
            <div className="leave-modal__icon">
              <CallEndIcon size={32} color="white" />
            </div>
            <h3 className="leave-modal__title">Leave call?</h3>
            <p className="leave-modal__text">
              You are about to leave this call. This action cannot be undone.
            </p>
            <div className="leave-modal__buttons">
              <button
                className="leave-modal__button leave-modal__button--cancel"
                onClick={handleCancelLeave}
              >
                Cancel
              </button>
              <button
                className="leave-modal__button leave-modal__button--confirm"
                onClick={handleConfirmLeave}
              >
                Leave call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};