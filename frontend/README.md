# Mente Sana - Mental Health Assessment Platform

Una plataforma web completa para evaluación y apoyo en salud mental, diseñada para proporcionar evaluaciones preliminares de salud mental y conectar a los usuarios con recursos de apoyo.

## 🚀 Características Principales

- **Evaluación DASS-21**: Cuestionario validado científicamente para medir depresión, ansiedad y estrés
- **Análisis Inteligente**: Servicio Python dedicado para procesamiento de evaluaciones
- **Recomendaciones Personalizadas**: Sugerencias basadas en resultados de evaluación
- **Sistema de Autenticación Seguro**: Registro y login con JWT
- **Interfaz Amigable**: Diseño responsive optimizado para usuarios de salud mental
- **Arquitectura Escalable**: Separación clara entre frontend, backend y servicios de análisis

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Backend│    │ Python Analysis │
│    (Vercel)     │◄──►│    (Render)     │◄──►│   Service       │
│                 │    │                 │    │  (Railway)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB Atlas │
                    │   Database      │
                    └─────────────────┘
```

## 🛠️ Tecnologías Utilizadas

### Frontend (Vercel)
- **React 19** con TypeScript
- **Styled Components** para estilos
- **React Router** para navegación
- **Axios** para llamadas API
- **Context API** para manejo de estado

### Backend (Render)
- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcrypt** para hashing de contraseñas
- **Helmet, CORS, Rate Limiting** para seguridad

### Servicio de Análisis (Railway)
- **Python Flask** API
- **DASS-21** algoritmo de evaluación
- **NumPy & Scikit-learn** para procesamiento
- **Gunicorn** para producción

## 📋 Requisitos del Sistema

- Node.js 18+
- Python 3.8+
- MongoDB Atlas account
- Vercel account
- Render account
- Railway account

## 🚀 Despliegue

### 1. Preparación del Entorno

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Instalar dependencias del servicio Python
cd ../python-service
pip install -r requirements.txt
```

### 2. Configuración de Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PYTHON_SERVICE_URL=https://mente-sana-python.railway.app
GOOGLE_MAPS_API_KEY=your_maps_key
# ... otras variables
```

#### Frontend (vercel.json ya configurado)
- API URL apuntando a Render backend
- CORS configurado para producción

### 3. Despliegue por Servicio

#### Frontend - Vercel
```bash
cd frontend
npm run build
vercel --prod
```

#### Backend - Render
1. Conectar repositorio GitHub a Render
2. Usar `render.yaml` para configuración automática
3. Configurar variables de entorno en Render dashboard

#### Servicio Python - Railway
1. Conectar repositorio GitHub a Railway
2. Usar `railway.json` para configuración
3. Railway detectará automáticamente Python/Flask

## 🔧 Configuración de Servicios Externos

### MongoDB Atlas
1. Crear cluster gratuito
2. Configurar usuario de base de datos
3. Whitelist IPs (0.0.0.0/0 para desarrollo)
4. Obtener connection string

### Google Maps API
1. Crear proyecto en Google Cloud Console
2. Habilitar Maps JavaScript API
3. Crear API key con restricciones
4. Configurar billing (capa gratuita disponible)

## 📊 Base de Datos

### Colecciones Principales
- **users**: Información de usuarios y autenticación
- **questionnaire_results**: Resultados de evaluaciones DASS-21
- **chat_groups**: Grupos de chat y comunidades
- **chat_messages**: Mensajes del sistema de chat
- **exercises**: Ejercicios de mindfulness y relajación
- **tips**: Consejos y recomendaciones
- **feedback**: Retroalimentación de usuarios

## 🔒 Seguridad

- **Autenticación JWT** con expiración
- **Hashing de contraseñas** con bcrypt
- **Rate limiting** para prevenir abuso
- **CORS** configurado para dominios específicos
- **Helmet** para headers de seguridad
- **Validación de entrada** en todos los endpoints

## 🧪 Pruebas

```bash
# Ejecutar tests del frontend
cd frontend
npm test

# El backend incluye validación automática
# El servicio Python incluye health checks
```

## 📈 Monitoreo

- **Health checks** en todos los servicios
- **Logging** de errores y actividades
- **Rate limiting** monitoring
- **Uptime monitoring** recomendado para producción

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ⚠️ Descargo de Responsabilidad

Esta plataforma proporciona evaluaciones preliminares basadas en cuestionarios validados científicamente, pero **NO reemplaza el diagnóstico profesional**. Los usuarios deben buscar ayuda de profesionales de la salud mental calificados para diagnósticos y tratamientos apropiados.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, por favor crear un issue en el repositorio de GitHub.
=======
# Agora - Mental Health Assessment Platform

Una plataforma web completa para evaluación y apoyo en salud mental, diseñada para proporcionar evaluaciones preliminares de salud mental y conectar a los usuarios con recursos de apoyo.

## 🚀 Características Principales

- **Evaluación DASS-21**: Cuestionario validado científicamente para medir depresión, ansiedad y estrés
- **Análisis Inteligente**: Servicio Python dedicado para procesamiento de evaluaciones
- **Recomendaciones Personalizadas**: Sugerencias basadas en resultados de evaluación
- **Sistema de Autenticación Seguro**: Registro y login con JWT
- **Interfaz Amigable**: Diseño responsive optimizado para usuarios de salud mental
- **Arquitectura Escalable**: Separación clara entre frontend, backend y servicios de análisis

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Backend│    │ Python Analysis │
│    (Vercel)     │◄──►│    (Render)     │◄──►│   Service       │
│                 │    │                 │    │  (Railway)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB Atlas │
                    │   Database      │
                    └─────────────────┘
```

## 🛠️ Tecnologías Utilizadas

### Frontend (Vercel)
- **React 19** con TypeScript
- **Styled Components** para estilos
- **React Router** para navegación
- **Axios** para llamadas API
- **Context API** para manejo de estado

### Backend (Render)
- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcrypt** para hashing de contraseñas
- **Helmet, CORS, Rate Limiting** para seguridad

### Servicio de Análisis (Railway)
- **Python Flask** API
- **DASS-21** algoritmo de evaluación
- **NumPy & Scikit-learn** para procesamiento
- **Gunicorn** para producción

## 📋 Requisitos del Sistema

- Node.js 18+
- Python 3.8+
- MongoDB Atlas account
- Vercel account
- Render account
- Railway account

## 🚀 Despliegue

### 1. Preparación del Entorno

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Instalar dependencias del servicio Python
cd ../python-service
pip install -r requirements.txt
```

### 2. Configuración de Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PYTHON_SERVICE_URL=https://mente-sana-python.railway.app
GOOGLE_MAPS_API_KEY=your_maps_key
# ... otras variables
```

#### Frontend (vercel.json ya configurado)
- API URL apuntando a Render backend
- CORS configurado para producción

### 3. Despliegue por Servicio

#### Frontend - Vercel
```bash
cd frontend
npm run build
vercel --prod
```

#### Backend - Render
1. Conectar repositorio GitHub a Render
2. Usar `render.yaml` para configuración automática
3. Configurar variables de entorno en Render dashboard

#### Servicio Python - Railway
1. Conectar repositorio GitHub a Railway
2. Usar `railway.json` para configuración
3. Railway detectará automáticamente Python/Flask

## 🔧 Configuración de Servicios Externos

### MongoDB Atlas
1. Crear cluster gratuito
2. Configurar usuario de base de datos
3. Whitelist IPs (0.0.0.0/0 para desarrollo)
4. Obtener connection string

### Google Maps API
1. Crear proyecto en Google Cloud Console
2. Habilitar Maps JavaScript API
3. Crear API key con restricciones
4. Configurar billing (capa gratuita disponible)

## 📊 Base de Datos

### Colecciones Principales
- **users**: Información de usuarios y autenticación
- **questionnaire_results**: Resultados de evaluaciones DASS-21
- **chat_groups**: Grupos de chat y comunidades
- **chat_messages**: Mensajes del sistema de chat
- **exercises**: Ejercicios de mindfulness y relajación
- **tips**: Consejos y recomendaciones
- **feedback**: Retroalimentación de usuarios

## 🔒 Seguridad

- **Autenticación JWT** con expiración
- **Hashing de contraseñas** con bcrypt
- **Rate limiting** para prevenir abuso
- **CORS** configurado para dominios específicos
- **Helmet** para headers de seguridad
- **Validación de entrada** en todos los endpoints

## 🧪 Pruebas

```bash
# Ejecutar tests del frontend
cd frontend
npm test

# El backend incluye validación automática
# El servicio Python incluye health checks
```

## 📈 Monitoreo

- **Health checks** en todos los servicios
- **Logging** de errores y actividades
- **Rate limiting** monitoring
- **Uptime monitoring** recomendado para producción

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ⚠️ Descargo de Responsabilidad

Esta plataforma proporciona evaluaciones preliminares basadas en cuestionarios validados científicamente, pero **NO reemplaza el diagnóstico profesional**. Los usuarios deben buscar ayuda de profesionales de la salud mental calificados para diagnósticos y tratamientos apropiados.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, por favor crear un issue en el repositorio de GitHub.
>>>>>>> 13bd6a92a58674d9bebf8fd9b4e29172b8385612
