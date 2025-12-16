# 🌐 Guía Completa de Despliegue - UVMeet

Esta guía te ayudará a desplegar toda la aplicación en producción.

## 📊 Orden de Despliegue

1. ✅ Servidor de Video (Backend)
2. ✅ Servidor de Chat (Backend)
3. ✅ Frontend (Vercel)

---

## 1️⃣ Desplegar Servidor de Video

### Opción A: Railway (Recomendado - Gratis)

1. **Ir a [Railway.app](https://railway.app)**
   - Login con GitHub

2. **Crear nuevo proyecto**
   - Click "New Project" → "Deploy from GitHub repo"
   - Selecciona `repositorio-video`

3. **Configurar variables de entorno**
   - Click en tu servicio → "Variables"
   - Agrega:
     ```
     PORT=3001
     ORIGIN=*
     ```
   - (Actualizaremos ORIGIN después)

4. **Generar dominio**
   - Ve a "Settings" → "Networking"
   - Click "Generate Domain"
   - **Guarda esta URL** (ej: `uvmeet-video.up.railway.app`)

5. **Verificar**
   ```bash
   curl https://tu-video-server.up.railway.app/health
   ```

### Opción B: Render.com

1. **Ir a [Render.com](https://render.com)**
2. **New + → Web Service**
3. **Conectar `repositorio-video`**
4. **Configurar:**
   - Name: `uvmeet-video`
   - Environment: `Node`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Add Environment Variables:
     - `PORT=3001`
     - `ORIGIN=*`

---

## 2️⃣ Desplegar Servidor de Chat

### Opción A: Railway

1. **Ir a [Railway.app](https://railway.app)**
2. **Crear nuevo proyecto**
   - "Deploy from GitHub repo" → `repositorio-chat`

3. **Configurar variables**
   ```
   PORT=3002
   ORIGIN=*
   ```

4. **Generar dominio**
   - Settings → Networking → Generate Domain
   - **Guarda esta URL** (ej: `uvmeet-chat.up.railway.app`)

5. **Verificar**
   ```bash
   curl https://tu-chat-server.up.railway.app/health
   ```

### Opción B: Render.com

Sigue los mismos pasos que el servidor de video, pero:
- Name: `uvmeet-chat`
- Repositorio: `repositorio-chat`
- Variables: `PORT=3002`, `ORIGIN=*`

---

## 3️⃣ Desplegar Frontend en Vercel

### Paso 1: Preparar el proyecto

```bash
cd repositorio-web
git pull origin main
```

### Paso 2: Desplegar con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Sigue las preguntas:
- Set up and deploy? **Y**
- Which scope? (tu cuenta)
- Link to existing project? **N**
- Project name? **uvmeet**
- In which directory? **./**
- Override settings? **N**

### Paso 3: Configurar variables de entorno en Vercel

**Opción A - Desde el Dashboard:**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto "uvmeet"
3. Settings → Environment Variables
4. Agrega:
   ```
   VITE_VIDEO_SERVER_URL = https://tu-video-server.up.railway.app
   VITE_CHAT_SERVER_URL = https://tu-chat-server.up.railway.app
   ```
5. Marca las 3 opciones: Production, Preview, Development
6. Click "Save"

**Opción B - Desde CLI:**
```bash
vercel env add VITE_VIDEO_SERVER_URL
# Pega la URL de tu servidor de video

vercel env add VITE_CHAT_SERVER_URL
# Pega la URL de tu servidor de chat
```

### Paso 4: Re-deploy con las variables

```bash
vercel --prod
```

**Guarda la URL de producción** (ej: `uvmeet.vercel.app`)

---

## 4️⃣ Actualizar CORS en Servidores

### Servidor de Video

1. Ve a Railway/Render dashboard
2. Abre tu proyecto de video
3. Variables → Edita `ORIGIN`:
   ```
   ORIGIN=https://uvmeet.vercel.app,http://localhost:5173
   ```
4. Save (se re-deplegará automáticamente)

### Servidor de Chat

1. Ve a Railway/Render dashboard
2. Abre tu proyecto de chat
3. Variables → Edita `ORIGIN`:
   ```
   ORIGIN=https://uvmeet.vercel.app,http://localhost:5173
   ```
4. Save

---

## ✅ Verificación Final

### 1. Verificar servidores

```bash
# Servidor de video
curl https://tu-video-server.up.railway.app/health
# Debe responder: {"status":"ok",...}

# Servidor de chat
curl https://tu-chat-server.up.railway.app/health
# Debe responder: {"status":"ok",...}
```

### 2. Probar la aplicación
1. Ve a `https://uvmeet.vercel.app`
2. Ingresa tu nombre
3. Genera/une a una sala
4. Permite permisos de cámara/mic
5. Abre en otra pestaña/navegador
6. Únete con otro nombre
7. Verifica:
   - ✅ Video funcionando
   - ✅ Audio funcionando
   - ✅ Chat conectado (verde)
   - ✅ Compartir pantalla funciona
   - ✅ Colgar/terminar llamada funciona

---

## 🔧 Troubleshooting

### Error: "Failed to connect to video server"

**Solución:**
1. Verifica que el servidor de video esté corriendo
2. Verifica `VITE_VIDEO_SERVER_URL` en Vercel
3. Verifica CORS en servidor de video
4. Revisa logs en Railway/Render

### Error: "Chat disconnected"

**Solución:**
1. Verifica que el servidor de chat esté corriendo
2. Verifica `VITE_CHAT_SERVER_URL` en Vercel
3. Verifica CORS en servidor de chat
4. WebSocket debe estar habilitado (Railway/Render lo soportan)

### Error: "No video/audio"

**Solución:**
1. Verifica permisos en el navegador
2. Usa **HTTPS** (Vercel lo proporciona automáticamente)
3. WebRTC requiere HTTPS o localhost

### Servidores se duermen (Free tier)

**Railway/Render free tier:**
- Los servidores se duermen después de inactividad
- Primera conexión puede tardar 30-60 segundos
- Solución: Upgrade a plan pago o usar pings periódicos

---

## 💰 Costos

### Plan Gratuito
- **Vercel**: Gratis (100GB bandwidth/mes)
- **Railway**: $5 crédito gratis/mes
- **Render**: Gratis (750 horas/mes por servicio)

### Recomendación para producción real
- Frontend: Vercel Pro ($20/mes)
- Backend: Railway Pro ($5/mes por servicio)
- O Render Starter ($7/mes por servicio)

---

## 🚀 Actualizaciones Futuras

### Para actualizar el frontend:
```bash
git pull origin main
vercel --prod
```

### Para actualizar los servidores:
- Railway/Render re-deplegarán automáticamente al hacer push a GitHub

---

## 📝 Resumen de URLs

Después del despliegue, tendrás:

```
Frontend:  https://uvmeet.vercel.app
Video:     https://uvmeet-video.up.railway.app
Chat:      https://uvmeet-chat.up.railway.app
```

---

## ❓ Soporte

¿Problemas?
1. Revisa logs en Railway/Render/Vercel
2. Verifica variables de entorno
3. Verifica health endpoints
4. Abre un issue en GitHub

¡Listo para producción! 🎉
