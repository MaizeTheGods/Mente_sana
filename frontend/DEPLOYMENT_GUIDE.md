# 🚀 Guía de Despliegue - Mente Sana

## Resumen
- **Frontend**: Vercel (GRATIS)
- **Backend**: Render (GRATIS)
- **Database**: MongoDB Atlas (GRATIS)
- **Total Costo**: $0/mes ✅

---

## ✅ ACTUALIZACIÓN: Despliegue 100% GRATIS

**Ya no necesitas Railway.** He migrado toda la lógica de análisis Python al backend Node.js, eliminando la dependencia de Python/Railway completamente.

### Arquitectura Simplificada:
```
Usuario → Vercel (Frontend) → Render (Backend + Análisis) → MongoDB Atlas
```

### Servicios Necesarios:
- ✅ **Vercel**: Frontend (GRATIS)
- ✅ **Render**: Backend (GRATIS)
- ✅ **MongoDB Atlas**: Database (GRATIS)

---

## 1. 🗄️ MongoDB Atlas - Base de Datos (Primero)

### Paso 1: Preparar el código
```bash
# Asegurarse de que requirements.txt esté actualizado
cd python-service
pip freeze > requirements.txt
```

### Paso 2: Crear proyecto en Railway
1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio `mente-sana`
5. Railway detectará automáticamente `railway.json` y `requirements.txt`

### Paso 3: Configurar Railway
- **Build Command**: Automático (NIXPACKS)
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
- **Health Check**: `/health`

### Paso 4: Obtener URL
Después del despliegue, copia la URL generada:
```
https://mente-sana-python.railway.app
```

---

## 2. 🟦 Render - Backend Node.js (Segundo)

### Paso 1: Preparar el código
```bash
cd backend
# Asegurarse de que render.yaml esté presente
```

### Paso 2: Crear proyecto en Render
1. Ve a https://render.com
2. Login con GitHub
3. Click "New" → "Web Service"
4. Conecta tu repositorio GitHub
5. Configura:
   - **Name**: `mente-sana-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Paso 3: Variables de Entorno en Render
Ve a "Environment" y configura:

| Variable | Valor |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://usuario:password@cluster.mongodb.net/mente_sana` |
| `JWT_SECRET` | `tu_clave_jwt_segura_32_chars_min` |
| `GOOGLE_MAPS_API_KEY` | `tu_api_key_google_maps` (opcional) |
| `CORS_ORIGIN` | `https://mente-sana.vercel.app` |
| `ENCRYPTION_KEY` | `tu_clave_encriptacion_32_chars` |

### Paso 4: Obtener URL
Después del despliegue, copia la URL:
```
https://mente-sana-backend.onrender.com
```

---

## 3. ▲ Vercel - Frontend React (Último)

### Paso 1: Preparar el código
```bash
cd frontend
# vercel.json ya está configurado
```

### Paso 2: Desplegar en Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
cd frontend
vercel --prod
```

### Paso 3: Configurar Variables de Entorno en Vercel
En el dashboard de Vercel → Project Settings → Environment Variables:

| Variable | Valor |
|----------|--------|
| `REACT_APP_API_URL` | `https://mente-sana-backend.onrender.com/api` |

### Paso 4: Obtener URL Final
```
https://mente-sana.vercel.app
```

---

## 🔧 Servicios Externos Requeridos

### MongoDB Atlas
1. Ve a https://cloud.mongodb.com
2. Crea cluster gratuito
3. Crea usuario de base de datos
4. Configura Network Access (IP: 0.0.0.0/0)
5. Copia el connection string

### Google Maps API (Opcional)
1. Ve a https://console.cloud.google.com
2. Crea proyecto
3. Habilita "Maps JavaScript API"
4. Crea API Key con restricciones

---

## 📋 Checklist de Despliegue

- [ ] MongoDB Atlas configurado y connection string obtenido
- [ ] Render (Backend) desplegado con variables configuradas
- [ ] Vercel (Frontend) desplegado con API_URL configurada
- [ ] Probar registro de usuario
- [ ] Probar cuestionario DASS-21 completo
- [ ] Probar análisis de resultados y recomendaciones
- [ ] Google Maps API (opcional) configurada

---

## 🐛 Solución de Problemas

### Error de CORS
- Verificar `CORS_ORIGIN` en Render apunta a Vercel URL

### Error de conexión a Python service
- Verificar `PYTHON_SERVICE_URL` en Render apunta a Railway URL

### Error de base de datos
- Verificar `MONGODB_URI` en Render es correcta
- Verificar IP whitelist en MongoDB Atlas

### Error de JWT
- Verificar `JWT_SECRET` tiene al menos 32 caracteres

---

## 💰 Costos

- **Railway**: ❌ NO NECESARIO
- **Render**: ✅ GRATIS (750 horas/mes)
- **Vercel**: ✅ GRATIS (Hobby plan)
- **MongoDB Atlas**: ✅ GRATIS (512MB)

**Total mensual**: $0 USD ✅

---

## 🔄 Actualizaciones

Para actualizar el código:
1. Push cambios a GitHub
2. Railway y Render se actualizan automáticamente
3. Vercel requiere `vercel --prod` o push a branch conectado

---

## 📞 URLs Finales Esperadas

- **Sitio Web**: https://mente-sana.vercel.app
- **API Backend**: https://mente-sana-backend.onrender.com
- **Servicio Python**: https://mente-sana-python.railway.app