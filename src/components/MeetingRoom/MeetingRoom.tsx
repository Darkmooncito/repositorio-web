import React, { useState, useEffect } from 'react';
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
            onLeaveRoom={leaveRoom}
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
    </div>
  );
};