import React from 'react';
import './MediaControls.css';

interface MediaControlsProps {
  isMicMuted: boolean;
  isCameraOff: boolean;
  isSharing: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeaveRoom: () => void;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  isMicMuted,
  isCameraOff,
  isSharing,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onLeaveRoom
}) => {
  return (
    <div className="media-controls">
      <div className="media-controls__buttons">
        <button
          className={`media-controls__button ${isMicMuted ? 'media-controls__button--active' : ''}`}
          onClick={onToggleMic}
          title={isMicMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
        >
          {isMicMuted ? '🎤❌' : '🎤'}
        </button>

        <button
          className={`media-controls__button ${isCameraOff ? 'media-controls__button--active' : ''}`}
          onClick={onToggleCamera}
          title={isCameraOff ? 'Activar cámara' : 'Desactivar cámara'}
        >
          {isCameraOff ? '📹❌' : '📹'}
        </button>

        <button
          className={`media-controls__button ${isSharing ? 'media-controls__button--sharing' : ''}`}
          onClick={onToggleScreenShare}
          title={isSharing ? 'Detener compartir pantalla' : 'Compartir pantalla'}
        >
          {isSharing ? '🖥️✓' : '🖥️'}
        </button>

        <button
          className="media-controls__button media-controls__button--leave"
          onClick={onLeaveRoom}
          title="Salir de la sala"
        >
          📞
        </button>
      </div>
    </div>
  );
};