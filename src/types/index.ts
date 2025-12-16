export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

export interface Peer {
  id: string;
  username: string;
  stream?: MediaStream;
}

export interface MediaState {
  isMicMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
}

export interface RoomInfo {
  roomId: string;
  participants: User[];
  createdAt: Date;
}