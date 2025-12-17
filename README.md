# UVMeet - Video Conferencing Platform

A real-time video conferencing application with integrated chat, screen sharing, and professional audio/video controls.

## Features

- Real-time video and audio streaming (WebRTC)
- Screen sharing capability
- Integrated real-time chat
- Professional UI with intuitive controls
- Multi-participant support
- Responsive design

## Tech Stack

- React 18 + TypeScript
- Vite
- WebRTC API
- Socket.io Client
- CSS3

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
VITE_VIDEO_SERVER_URL=http://localhost:3001
VITE_CHAT_SERVER_URL=http://localhost:3002
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Architecture

This frontend connects to two backend services:
- **Video Server** - WebRTC signaling server
- **Chat Server** - WebSocket chat server

## License

MIT
