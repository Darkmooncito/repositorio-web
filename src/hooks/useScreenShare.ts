import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for managing screen sharing functionality
 * 
 * @returns {Object} Screen sharing state and control functions
 * 
 * @example
 * const { isSharing, screenStream, startScreenShare, stopScreenShare } = useScreenShare();
 */
export const useScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  /**
   * Starts screen sharing by requesting display media
   * Automatically stops when user ends sharing from browser controls
   * 
   * @returns {Promise<MediaStream | null>} The screen sharing stream or null if failed
   */
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

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      console.log('Screen sharing started');
      return stream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Permission denied for screen sharing');
        } else if (error.name === 'NotFoundError') {
          alert('No screen found to share');
        } else {
          alert('Error sharing screen: ' + error.message);
        }
      }
      return null;
    }
  }, []);

  /**
   * Stops screen sharing and cleans up the stream
   */
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