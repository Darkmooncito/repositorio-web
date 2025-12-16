import React from 'react';
import { VideoTile } from '../VideoTile/VideoTile';
import './VideoGrid.css';

interface Peer {
  id: string;
  username: string;
  stream?: MediaStream;
}

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  screenStream: MediaStream | null;
  peers: Peer[];
  username: string;
  isCameraOff: boolean;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  localStream,
  remoteStreams,
  screenStream,
  peers,
  username,
  isCameraOff
}) => {
  const getGridClass = () => {
    const totalVideos = 1 + peers.length + (screenStream ? 1 : 0);
    if (totalVideos === 1) return 'video-grid--single';
    if (totalVideos === 2) return 'video-grid--two';
    if (totalVideos <= 4) return 'video-grid--four';
    return 'video-grid--many';
  };

  return (
    <div className={`video-grid ${getGridClass()}`}>
      {/* Pantalla compartida - prioridad máxima */}
      {screenStream && (
        <div className="video-grid__screen-share">
          <VideoTile
            stream={screenStream}
            username="Pantalla compartida"
            isLocal={false}
            isMuted={true}
            isScreenShare={true}
          />
        </div>
      )}

      <div className={`video-grid__participants ${screenStream ? 'video-grid__participants--sidebar' : ''}`}>
        {/* Video local */}
        <VideoTile
          stream={localStream}
          username={`${username} (Tú)`}
          isLocal={true}
          isMuted={true}
          isCameraOff={isCameraOff}
        />

        {/* Videos remotos */}
        {peers.map((peer) => {
          const stream = remoteStreams.get(peer.id);
          return (
            <VideoTile
              key={peer.id}
              stream={stream || null}
              username={peer.username}
              isLocal={false}
              isMuted={false}
            />
          );
        })}
      </div>
    </div>
  );
};