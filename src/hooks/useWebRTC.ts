import { useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Peer information interface
 */
interface Peer {
  id: string;
  username: string;
  stream?: MediaStream;
}

/**
 * WebRTC ICE servers configuration
 */
const VIDEO_SERVER_URL = import.meta.env.VITE_VIDEO_SERVER_URL || 'http://localhost:3001';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

/**
 * Custom hook for managing WebRTC connections and peer-to-peer communication
 * 
 * @param {string} roomId - Unique identifier for the room
 * @param {string} username - Display name of the current user
 * @returns {Object} WebRTC connection state and control functions
 * 
 * @example
 * const { localStream, remoteStreams, peers, connectToRoom, toggleAudio } = useWebRTC('room123', 'John');
 */
export const useWebRTC = (roomId: string, username: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [peers, setPeers] = useState<Peer[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  /**
   * Creates a new RTCPeerConnection for a specific peer
   * 
   * @param {string} peerId - Unique identifier of the peer
   * @returns {RTCPeerConnection} Configured peer connection instance
   */
  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnection.ontrack = (event) => {
      console.log('Received remote track from:', peerId);
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, remoteStream);
        return newMap;
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          to: peerId
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(`Peer ${peerId} connection state:`, peerConnection.connectionState);
      if (peerConnection.connectionState === 'disconnected' || 
          peerConnection.connectionState === 'failed') {
        handlePeerDisconnection(peerId);
      }
    };

    peersRef.current.set(peerId, peerConnection);
    return peerConnection;
  }, []);

  /**
   * Handles peer disconnection by cleaning up resources
   * 
   * @param {string} peerId - ID of the disconnected peer
   */
  const handlePeerDisconnection = (peerId: string) => {
    const peerConnection = peersRef.current.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      peersRef.current.delete(peerId);
    }

    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });

    setPeers(prev => prev.filter(p => p.id !== peerId));
  };

  /**
   * Connects to a video room and establishes WebRTC connections
   * Requests user media permissions and sets up socket event listeners
   */
  const connectToRoom = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      localStreamRef.current = stream;

      socketRef.current = io(VIDEO_SERVER_URL);

      socketRef.current.on('connect', () => {
        console.log('Connected to video server');
        socketRef.current!.emit('join-room', { roomId, username });
      });

      socketRef.current.on('user-connected', async ({ userId, username: peerUsername }) => {
        console.log('User connected:', peerUsername);
        setPeers(prev => [...prev, { id: userId, username: peerUsername }]);

        const peerConnection = createPeerConnection(userId);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current!.emit('offer', {
          offer,
          to: userId
        });
      });

      socketRef.current.on('offer', async ({ offer, from, username: peerUsername }) => {
        console.log('Received offer from:', peerUsername);
        setPeers(prev => {
          if (!prev.find(p => p.id === from)) {
            return [...prev, { id: from, username: peerUsername }];
          }
          return prev;
        });

        const peerConnection = createPeerConnection(from);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socketRef.current!.emit('answer', {
          answer,
          to: from
        });
      });

      socketRef.current.on('answer', async ({ answer, from }) => {
        console.log('Received answer from:', from);
        const peerConnection = peersRef.current.get(from);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socketRef.current.on('ice-candidate', async ({ candidate, from }) => {
        const peerConnection = peersRef.current.get(from);
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socketRef.current.on('user-disconnected', ({ userId }) => {
        console.log('User disconnected:', userId);
        handlePeerDisconnection(userId);
      });

    } catch (error) {
      console.error('Error connecting to room:', error);
      alert('Could not access camera or microphone. Please check permissions.');
    }
  }, [roomId, username, createPeerConnection]);

  /**
   * Toggles the audio track on/off
   */
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, []);

  /**
   * Toggles the video track on/off
   */
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, []);

  /**
   * Leaves the room and cleans up all connections
   */
  const leaveRoom = useCallback(() => {
    peersRef.current.forEach(peerConnection => {
      peerConnection.close();
    });
    peersRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (socketRef.current) {
      socketRef.current.emit('leave-room');
      socketRef.current.disconnect();
    }

    setLocalStream(null);
    setRemoteStreams(new Map());
    setPeers([]);
  }, []);

  return {
    localStream,
    remoteStreams,
    peers,
    connectToRoom,
    toggleAudio,
    toggleVideo,
    leaveRoom
  };
};