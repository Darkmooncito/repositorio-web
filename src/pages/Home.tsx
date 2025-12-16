import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && username.trim()) {
      navigate(`/room/${roomId}?username=${encodeURIComponent(username)}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    setRoomId(newRoomId);
  };

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__header">
          <h1 className="home__title">📹 UVMeet</h1>
          <p className="home__subtitle">
            Videoconferencias con chat en tiempo real
          </p>
        </div>

        <form className="home__form" onSubmit={handleJoinRoom}>
          <div className="home__form-group">
            <label htmlFor="username" className="home__label">
              Tu nombre
            </label>
            <input
              id="username"
              type="text"
              className="home__input"
              placeholder="Ingresa tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={30}
            />
          </div>

          <div className="home__form-group">
            <label htmlFor="roomId" className="home__label">
              ID de la sala
            </label>
            <div className="home__room-input-group">
              <input
                id="roomId"
                type="text"
                className="home__input"
                placeholder="Ingresa o crea una sala"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
              <button
                type="button"
                className="home__create-button"
                onClick={handleCreateRoom}
              >
                Generar
              </button>
            </div>
          </div>

          <button type="submit" className="home__join-button">
            Unirse a la sala →
          </button>
        </form>

        <div className="home__features">
          <div className="home__feature">
            <span className="home__feature-icon">🎥</span>
            <p>Video y audio en tiempo real</p>
          </div>
          <div className="home__feature">
            <span className="home__feature-icon">🖥️</span>
            <p>Comparte tu pantalla</p>
          </div>
          <div className="home__feature">
            <span className="home__feature-icon">💬</span>
            <p>Chat integrado</p>
          </div>
        </div>
      </div>
    </div>
  );
};