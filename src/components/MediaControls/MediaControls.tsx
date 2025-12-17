/**
 * MediaControls component
 * Provides control buttons for microphone, camera, screen sharing, and ending call
 * 
 * @component
 * @example
 * <MediaControls
 *   isMicMuted={false}
 *   isCameraOff={false}
 *   isSharing={false}
 *   onToggleMic={() => {}}
 *   onToggleCamera={() => {}}
 *   onToggleScreenShare={() => {}}
 *   onLeaveRoom={() => {}}
 * />
 */
import React from 'react';
import { MicIcon, MicOffIcon, VideocamIcon, VideocamOffIcon, ScreenShareIcon, StopScreenShareIcon, CallEndIcon } from '../Icons/Icons';
import './MediaControls.css';

interface MediaControlsProps {
  /** Whether microphone is muted */
  isMicMuted: boolean;
  /** Whether camera is off */
  isCameraOff: boolean;
  /** Whether screen is being shared */
  isSharing: boolean;
  /** Callback for toggling microphone */
  onToggleMic: () => void;
  /** Callback for toggling camera */
  onToggleCamera: () => void;
  /** Callback for toggling screen share */
  onToggleScreenShare: () => void;
  /** Callback for leaving the room */
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
          title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMicMuted ? <MicOffIcon size={24} /> : <MicIcon size={24} />}
        </button>

        <button
          className={`media-controls__button ${isCameraOff ? 'media-controls__button--active' : ''}`}
          onClick={onToggleCamera}
          title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
          aria-label={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isCameraOff ? <VideocamOffIcon size={24} /> : <VideocamIcon size={24} />}
        </button>

        <button
          className={`media-controls__button ${isSharing ? 'media-controls__button--sharing' : ''}`}
          onClick={onToggleScreenShare}
          title={isSharing ? 'Stop presenting' : 'Present now'}
          aria-label={isSharing ? 'Stop presenting' : 'Present now'}
        >
          {isSharing ? <StopScreenShareIcon size={24} /> : <ScreenShareIcon size={24} />}
        </button>

        <button
          className="media-controls__button media-controls__button--leave"
          onClick={onLeaveRoom}
          title="Leave call"
          aria-label="Leave call"
        >
          <CallEndIcon size={24} />
        </button>
      </div>
    </div>
  );
};