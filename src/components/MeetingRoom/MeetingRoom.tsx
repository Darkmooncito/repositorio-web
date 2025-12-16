import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoGrid } from '../VideoGrid/VideoGrid';
import { ChatPanel } from '../ChatPanel/ChatPanel';
import { MediaControls } from '../MediaControls/MediaControls';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useScreenShare } from '../../hooks/useScreenShare';
import { useChat } from '../../hooks/useChat';
import './MeetingRoom.css';

interface MeetingRoomProps {
  roomId: string;
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

  const handleToggleMic = () => {
    toggleAudio();
    setIsMicMuted(!isMicMuted);
  };

  const handleToggleCamera = () => {
    toggleVideo();
    setIsCameraOff(!isCameraOff);
  };

  const handleToggleScreenShare = async () => {
    if (isSharing) {
      stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleLeaveClick = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    leaveRoom();
    navigate('/');
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  return (
    <div className="meeting-room">
      <div className="meeting-room__header">
        <h2>Sala: {roomId}</h2>
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
      >
        {isChatOpen ? '→' : '←'}
      </button>

      {showLeaveModal && (
        <div className="leave-modal-overlay" onClick={handleCancelLeave}>
          <div className="leave-modal" onClick={(e) => e.stopPropagation()}>
            <div className="leave-modal__icon">📞</div>
            <h3 className="leave-modal__title">¿Terminar llamada?</h3>
            <p className="leave-modal__text">
              Estás a punto de salir de la sala. Esta acción no se puede deshacer.
            </p>
            <div className="leave-modal__buttons">
              <button
                className="leave-modal__button leave-modal__button--cancel"
                onClick={handleCancelLeave}
              >
                Cancelar
              </button>
              <button
                className="leave-modal__button leave-modal__button--confirm"
                onClick={handleConfirmLeave}
              >
                Terminar llamada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};