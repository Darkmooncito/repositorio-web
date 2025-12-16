# UVMeet - Interfaz Web Unificada

Interfaz web para videoconferencias con chat en tiempo real, compartir pantalla y controles de audio/video.

## 🚀 Características

- 🎥 **Video y audio en tiempo real** - Transmisión WebRTC peer-to-peer
- 🖥️ **Compartir pantalla** - Comparte tu pantalla con todos los participantes
- 💬 **Chat integrado** - Mensajería en tiempo real con WebSocket
- 🎤 **Control de micrófono** - Mutear/activar audio
- 📹 **Control de cámara** - Activar/desactivar video
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

## 💻 Instalación

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

4. **Instalar dependencias faltantes**
```bash
npm install socket.io-client react-router-dom
```

## 🏃 Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build para producción
```bash
npm run build
```

Los archivos estarán en la carpeta `dist/`

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
- 📞 **Salir** - Click para abandonar la sala
- ←/→ **Chat** - Toggle para mostrar/ocultar chat

## 🔌 API de los Servidores

### Servidor de Video (WebRTC)

Eventos emitidos:
- `join-room` - Unirse a una sala
- `offer` - Enviar oferta WebRTC
- `answer` - Enviar respuesta WebRTC
- `ice-candidate` - Enviar candidato ICE
- `leave-room` - Salir de la sala

Eventos recibidos:
- `user-connected` - Nuevo usuario conectado
- `offer` - Oferta WebRTC recibida
- `answer` - Respuesta WebRTC recibida
- `ice-candidate` - Candidato ICE recibido
- `user-disconnected` - Usuario desconectado

### Servidor de Chat (WebSocket)

Eventos emitidos:
- `join-room` - Unirse a sala de chat
- `send-message` - Enviar mensaje
- `leave-room` - Salir de sala de chat

Eventos recibidos:
- `message` - Nuevo mensaje
- `message-history` - Historial de mensajes
- `user-joined` - Usuario se unió
- `user-left` - Usuario salió

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

MIT

## ❓ Soporte

¿Problemas o preguntas? Abre un issue en GitHub.
