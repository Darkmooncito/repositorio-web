import React, { useEffect, useRef } from 'react';
import './VideoTile.css';

interface VideoTileProps {
  stream: MediaStream | null;
  username: string;
  isLocal: boolean;
  isMuted: boolean;
  isCameraOff?: boolean;
  isScreenShare?: boolean;
}

export const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  username,
  isLocal,
  isMuted,
  isCameraOff = false,
  isScreenShare = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`video-tile ${isScreenShare ? 'video-tile--screen' : ''}`}>
      {stream && !isCameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className={`video-tile__video ${isLocal ? 'video-tile__video--mirror' : ''}`}
        />
      ) : (
        <div className="video-tile__avatar">
          <span className="video-tile__initials">{getInitials(username)}</span>
        </div>
      )}

      <div className="video-tile__info">
        <span className="video-tile__username">{username}</span>
        {isCameraOff && !isScreenShare && (
          <span className="video-tile__status">📹</span>
        )}
      </div>
    </div>
  );
};