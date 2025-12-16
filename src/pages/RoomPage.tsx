import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MeetingRoom } from '../components/MeetingRoom/MeetingRoom';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get('username');

  useEffect(() => {
    if (!roomId || !username) {
      navigate('/');
    }
  }, [roomId, username, navigate]);

  if (!roomId || !username) {
    return null;
  }

  return <MeetingRoom roomId={roomId} username={username} />;
};