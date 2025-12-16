# UVMeet - Interfaz Web Unificada

Interfaz web para videoconferencias con chat en tiempo real, compartir pantalla y controles de audio/video.

## 🚀 Características

- 🎥 **Video y audio en tiempo real** - Transmisión WebRTC peer-to-peer
- 🖥️ **Compartir pantalla** - Comparte tu pantalla con todos los participantes
- 💬 **Chat integrado** - Mensajería en tiempo real con WebSocket
- 🎤 **Control de micrófono** - Mutear/activar audio
- 📹 **Control de cámara** - Activar/desactivar video
- 📞 **Colgar llamada** - Terminar llamada con confirmación
- 👥 **Múltiples participantes** - Soporta salas con varios usuarios
- 📡 **Tiempo real** - Sincronización instantánea de mensajes y video

## 📚 Arquitectura

Este proyecto se conecta con dos servidores backend:

1. **repositorio-video** - Servidor WebRTC para streaming de video/audio
2. **repositorio-chat** - Servidor WebSocket para mensajería

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite
- WebRTC API
- Socket.io Client
- CSS3 (Grid & Flexbox)

## 💻 Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/Darkmooncito/repositorio-web.git
cd repositorio-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con las URLs de tus servidores:
```env
VITE_VIDEO_SERVER_URL=http://localhost:3001
VITE_CHAT_SERVER_URL=http://localhost:3002
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🌐 Desplegar en Vercel

### Prerequisitos
- Cuenta en [Vercel](https://vercel.com)
- Servidores backend desplegados (Railway, Render, etc.)

### Pasos:

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Login en Vercel**
```bash
vercel login
```

3. **Configurar variables de entorno en Vercel**

En el dashboard de Vercel:
- Ve a tu proyecto → Settings → Environment Variables
- Agrega:
  - `VITE_VIDEO_SERVER_URL` = URL de tu servidor de video
  - `VITE_CHAT_SERVER_URL` = URL de tu servidor de chat

4. **Desplegar**
```bash
vercel --prod
```

O conecta tu repositorio de GitHub a Vercel para deploys automáticos.

### Configuración CORS en Servidores

No olvides actualizar los `.env` de tus servidores backend con la URL de Vercel:

```env
ORIGIN=https://tu-app.vercel.app,http://localhost:5173
```

## 📝 Estructura del Proyecto

```
src/
├── components/
│   ├── MeetingRoom/      # Componente principal de la sala
│   ├── VideoGrid/        # Grid de videos
│   ├── VideoTile/        # Tile individual de video
│   ├── MediaControls/    # Controles de media (mic, cam, screen)
│   └── ChatPanel/        # Panel de chat
├── hooks/
│   ├── useWebRTC.ts      # Hook para WebRTC
│   ├── useScreenShare.ts # Hook para compartir pantalla
│   └── useChat.ts        # Hook para chat
├── pages/
│   ├── Home.tsx          # Página de inicio
│   └── RoomPage.tsx      # Página de sala
└── types/
    └── index.ts          # Tipos TypeScript
```

## 🔧 Uso

### Unirse a una sala

1. Ingresa tu nombre
2. Ingresa el ID de la sala o genera uno nuevo
3. Haz clic en "Unirse a la sala"

### Controles disponibles

- 🎤 **Micrófono** - Click para mutear/activar
- 📹 **Cámara** - Click para activar/desactivar video
- 🖥️ **Pantalla** - Click para compartir/detener compartir pantalla
- 📞 **Colgar** - Click para terminar la llamada (con confirmación)
- ←/→ **Chat** - Toggle para mostrar/ocultar chat

## 📝 Licencia

MIT
