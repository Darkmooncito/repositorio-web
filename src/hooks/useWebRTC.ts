import { useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Peer {
  id: string;
  username: string;
  stream?: MediaStream;
}

const VIDEO_SERVER_URL = import.meta.env.VITE_VIDEO_SERVER_URL || 'http://localhost:3001';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const useWebRTC = (roomId: string, username: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [peers, setPeers] = useState<Peer[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Agregar tracks locales al peer
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    // Manejar tracks remotos
    peerConnection.ontrack = (event) => {
      console.log('Received remote track from:', peerId);
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, remoteStream);
        return newMap;
      });
    };

    // Manejar candidatos ICE
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          to: peerId
        });
      }
    };

    // Manejar cambios de conexión
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

  const connectToRoom = useCallback(async () => {
    try {
      // Obtener stream local
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

      // Conectar al servidor de video
      socketRef.current = io(VIDEO_SERVER_URL);

      socketRef.current.on('connect', () => {
        console.log('Connected to video server');
        socketRef.current!.emit('join-room', { roomId, username });
      });

      // Usuario existente en la sala
      socketRef.current.on('user-connected', async ({ userId, username: peerUsername }) => {
        console.log('User connected:', peerUsername);
        setPeers(prev => [...prev, { id: userId, username: peerUsername }]);

        // Crear oferta para el nuevo usuario
        const peerConnection = createPeerConnection(userId);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current!.emit('offer', {
          offer,
          to: userId
        });
      });

      // Recibir oferta
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

      // Recibir respuesta
      socketRef.current.on('answer', async ({ answer, from }) => {
        console.log('Received answer from:', from);
        const peerConnection = peersRef.current.get(from);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      // Recibir candidatos ICE
      socketRef.current.on('ice-candidate', async ({ candidate, from }) => {
        const peerConnection = peersRef.current.get(from);
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // Usuario desconectado
      socketRef.current.on('user-disconnected', ({ userId }) => {
        console.log('User disconnected:', userId);
        handlePeerDisconnection(userId);
      });

    } catch (error) {
      console.error('Error connecting to room:', error);
      alert('No se pudo acceder a la cámara o micrófono. Verifica los permisos.');
    }
  }, [roomId, username, createPeerConnection]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, []);

  const leaveRoom = useCallback(() => {
    // Cerrar todas las conexiones peer
    peersRef.current.forEach(peerConnection => {
      peerConnection.close();
    });
    peersRef.current.clear();

    // Detener stream local
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Desconectar socket
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