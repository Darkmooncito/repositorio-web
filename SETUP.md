# 🚀 Guía de Instalación Completa - UVMeet

Esta guía te ayudará a configurar y ejecutar todo el sistema de videoconferencias con chat en tiempo real.

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Ejecución](#ejecución)
6. [Verificación](#verificación)
7. [Resolución de Problemas](#resolución-de-problemas)

---

## 💻 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18 o superior ([Descargar](https://nodejs.org/))
- **npm** (viene con Node.js)
- **Git** ([Descargar](https://git-scm.com/))
- Un navegador moderno (Chrome, Firefox, Safari, Edge)

Verifica las versiones:
```bash
node --version  # Debe ser >= 18.0.0
npm --version   # Debe ser >= 9.0.0
```

---

## 📁 Estructura del Proyecto

El sistema consta de 3 repositorios:

```
UVMeet/
├── repositorio-web/        # Frontend (React + TypeScript)
├── repositorio-video/      # Servidor WebRTC (señalización)
└── repositorio-chat/       # Servidor de Chat (WebSocket)
```

---

## 📥 Instalación

### 1. Clonar los Repositorios

```bash
# Crear carpeta principal
mkdir UVMeet
cd UVMeet

# Clonar frontend
git clone https://github.com/Darkmooncito/repositorio-web.git

# Clonar servidor de video
git clone https://github.com/Darkmooncito/repositorio-video.git

# Clonar servidor de chat
git clone https://github.com/Darkmooncito/repositorio-chat.git
```

### 2. Instalar Dependencias

#### Frontend (repositorio-web)
```bash
cd repositorio-web
npm install
cd ..
```

#### Servidor de Video
```bash
cd repositorio-video
npm install
cd ..
```

#### Servidor de Chat
```bash
cd repositorio-chat
npm install
cd ..
```

---

## ⚙️ Configuración

### 1. Servidor de Video (repositorio-video)

```bash
cd repositorio-video
cp .env.example .env
```

Edita el archivo `.env`:
```env
PORT=3001
ORIGIN=http://localhost:5173,http://localhost:3000
```

### 2. Servidor de Chat (repositorio-chat)

```bash
cd ../repositorio-chat
cp .env.example .env
```

Edita el archivo `.env`:
```env
PORT=3002
ORIGIN=http://localhost:5173,http://localhost:3000
```

### 3. Frontend (repositorio-web)

```bash
cd ../repositorio-web
cp .env.example .env
```

Edita el archivo `.env`:
```env
VITE_VIDEO_SERVER_URL=http://localhost:3001
VITE_CHAT_SERVER_URL=http://localhost:3002
```

---

## 🏃 Ejecución

### Opción 1: Ejecutar en Terminales Separadas (Recomendado)

**Terminal 1 - Servidor de Video:**
```bash
cd repositorio-video
npm run dev
```
Deberías ver: `🚀 Video Server running on port 3001`

**Terminal 2 - Servidor de Chat:**
```bash
cd repositorio-chat
npm run dev
```
Deberías ver: `🚀 Chat Server running on port 3002`

**Terminal 3 - Frontend:**
```bash
cd repositorio-web
npm run dev
```
Deberías ver: `➜ Local: http://localhost:5173/`

### Opción 2: Script de Inicio (Linux/Mac)

Crea un archivo `start-all.sh` en la carpeta principal:

```bash
#!/bin/bash

# Iniciar servidor de video
cd repositorio-video
npm run dev &
VIDEO_PID=$!

# Iniciar servidor de chat
cd ../repositorio-chat
npm run dev &
CHAT_PID=$!

# Iniciar frontend
cd ../repositorio-web
npm run dev &
WEB_PID=$!

echo "Servidores iniciados:"
echo "Video Server PID: $VIDEO_PID"
echo "Chat Server PID: $CHAT_PID"
echo "Web Server PID: $WEB_PID"

# Esperar a que terminen
wait
```

Dale permisos y ejecútalo:
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## ✅ Verificación

### 1. Verificar Servidores

**Servidor de Video:**
```bash
curl http://localhost:3001/health
```
Debe responder: `{"status":"ok","rooms":0,"totalPeers":0}`

**Servidor de Chat:**
```bash
curl http://localhost:3002/health
```
Debe responder: `{"status":"ok","rooms":0,"totalUsers":0,"totalMessages":0}`

### 2. Probar la Aplicación
1. Abre tu navegador en `http://localhost:5173`
2. Ingresa tu nombre (ej: "Usuario1")
3. Haz clic en "Generar" para crear una sala
4. Haz clic en "Unirse a la sala"
5. Permite acceso a cámara y micrófono

### 3. Probar con Múltiples Usuarios

1. Copia el ID de la sala (aparece en la URL)
2. Abre una ventana de incógnito o otro navegador
3. Ve a `http://localhost:5173`
4. Ingresa otro nombre (ej: "Usuario2")
5. Pega el ID de la sala
6. Haz clic en "Unirse a la sala"

Deberías ver:
- ✅ Videos de ambos usuarios
- ✅ Chat funcionando
- ✅ Controles de mute funcionando

---

## 🔧 Resolución de Problemas

### Problema: "Cannot access camera or microphone"

**Solución:**
- Verifica que ningún otro programa esté usando la cámara/micrófono
- Asegúrate de dar permisos en el navegador
- En Chrome: Settings → Privacy and security → Site settings → Camera/Microphone

### Problema: "Connection failed" o "Socket disconnected"

**Solución:**
1. Verifica que los 3 servidores estén corriendo
2. Verifica los puertos en `.env`:
   - Video: 3001
   - Chat: 3002
   - Web: 5173
3. Revisa las URLs en `repositorio-web/.env`

### Problema: "CORS error"

**Solución:**
1. Verifica `ORIGIN` en `.env` de los servidores
2. Debe incluir: `http://localhost:5173`
3. Reinicia los servidores después de cambiar `.env`

### Problema: "No video/audio" pero conexión exitosa

**Solución:**
1. Verifica la consola del navegador (F12)
2. Revisa los logs de los servidores
3. Prueba en modo incógnito
4. Desactiva extensiones del navegador

### Problema: Puertos ya en uso

**Solución:**

**Linux/Mac:**
```bash
# Encontrar proceso usando el puerto
lsof -i :3001
lsof -i :3002
lsof -i :5173

# Matar proceso
kill -9 <PID>
```

**Windows:**
```bash
# Encontrar proceso
netstat -ano | findstr :3001

# Matar proceso
taskkill /PID <PID> /F
```

---

## 📦 Build para Producción

### Frontend
```bash
cd repositorio-web
npm run build
# Los archivos estarán en dist/
```

### Servidores
```bash
# Video
cd repositorio-video
npm run build
npm start

# Chat
cd repositorio-chat
npm run build
npm start
```

---

## 📚 Recursos Adicionales

- [Documentación WebRTC](https://webrtc.org/)
- [Socket.IO Docs](https://socket.io/docs/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

---

## 👥 Soporte

¿Problemas? 
1. Revisa la consola del navegador (F12)
2. Revisa los logs de los servidores
3. Abre un issue en GitHub

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Repositorios clonados
- [ ] Dependencias instaladas en los 3 proyectos
- [ ] Archivos `.env` configurados
- [ ] Servidor de video corriendo en puerto 3001
- [ ] Servidor de chat corriendo en puerto 3002
- [ ] Frontend corriendo en puerto 5173
- [ ] Health checks respondiendo correctamente
- [ ] Permisos de cámara/micrófono otorgados
- [ ] Prueba con múltiples usuarios exitosa

¡Listo! 🎉
