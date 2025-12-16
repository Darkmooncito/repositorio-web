import { useState, useRef, useCallback } from 'react';

export const useScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        } as MediaTrackConstraints,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } as MediaTrackConstraints
      });

      screenStreamRef.current = stream;
      setScreenStream(stream);
      setIsSharing(true);

      // Detectar cuando el usuario detenga el compartir desde el navegador
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      console.log('Screen sharing started');
      return stream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Permiso denegado para compartir pantalla');
        } else if (error.name === 'NotFoundError') {
          alert('No se encontró ninguna pantalla para compartir');
        } else {
          alert('Error al compartir pantalla: ' + error.message);
        }
      }
      return null;
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      screenStreamRef.current = null;
    }

    setScreenStream(null);
    setIsSharing(false);
    console.log('Screen sharing stopped');
  }, []);

  return {
    isSharing,
    screenStream,
    startScreenShare,
    stopScreenShare
  };
};