# Agora - Mental Health Platform

## Descripción del Proyecto

Agora es una plataforma integral de salud mental que combina evaluación psicológica, soporte comunitario, ejercicios terapéuticos y recursos educativos. La aplicación permite a los usuarios realizar cuestionarios de evaluación (DASS-21), participar en chats grupales, acceder a ejercicios personalizados y recibir consejos basados en su estado emocional.

## Tecnologías Utilizadas

### Frontend
- **React 19.2.0**: Framework principal para la interfaz de usuario
- **TypeScript 4.9.5**: Lenguaje de programación con tipado estático
- **Styled Components 6.1.19**: Librería para estilos CSS-in-JS
- **React Router DOM 7.9.4**: Manejo de rutas y navegación
- **Leaflet 1.9.4**: Librería para mapas interactivos de servicios de salud
- **Axios 1.12.2**: Cliente HTTP para comunicación con el backend
- **React Testing Library**: Framework para pruebas unitarias

### Backend
- **Node.js**: Entorno de ejecución JavaScript del lado servidor
- **Express 5.1.0**: Framework web minimalista para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose 8.19.2**: ODM (Object Data Modeling) para MongoDB
- **JWT (JSON Web Tokens) 9.0.2**: Autenticación y autorización
- **Socket.io 4.8.1**: Comunicación en tiempo real para chats
- **bcryptjs 3.0.2**: Hashing de contraseñas
- **CORS 2.8.5**: Manejo de políticas de origen cruzado
- **Helmet 8.1.0**: Seguridad HTTP
- **Express Rate Limit 8.1.0**: Limitación de tasa de solicitudes

### Servicios Externos y Despliegue
- **Vercel**: Plataforma de despliegue para el frontend
- **Railway**: Plataforma de despliegue para servicios auxiliares
- **Render**: Plataforma de despliegue para el backend
- **Google Maps API**: Integración para mapas de servicios de salud

### Control de Versiones y Desarrollo
- **Git**: Sistema de control de versiones
- **Nodemon**: Herramienta para reinicio automático del servidor en desarrollo

## Arquitectura de la Aplicación

### Mapa Mental de Relaciones Funcionales

```
Agora Platform
├── Frontend (React/TypeScript)
│   ├── Autenticación
│   │   ├── Login/Register
│   │   └── AuthContext (Gestión de estado global)
│   ├── Cuestionario DASS-21
│   │   ├── Formulario de evaluación
│   │   └── Resultados y recomendaciones
│   ├── Chat Comunitario
│   │   ├── Socket.io (Tiempo real)
│   │   ├── Grupos de chat
│   │   └── Mensajes en tiempo real
│   ├── Ejercicios Terapéuticos
│   │   ├── Lista de ejercicios
│   │   ├── Detalles individuales
│   │   └── Recomendaciones personalizadas
│   ├── Consejos y Tips
│   │   ├── Biblioteca de consejos
│   │   └── Categorización por temas
│   ├── Mapa de Servicios de Salud
│   │   ├── Leaflet integration
│   │   └── Ubicación de servicios cercanos
│   └── Panel de Administración
│       ├── Gestión de usuarios
│       ├── Moderación de contenido
│       └── Análisis de datos
│
├── Backend (Node.js/Express)
│   ├── API REST
│   │   ├── /api/auth (Autenticación)
│   │   ├── /api/questionnaire (Cuestionarios)
│   │   ├── /api/exercises (Ejercicios)
│   │   ├── /api/tips (Consejos)
│   │   ├── /api/chat (Mensajes)
│   │   └── /api/admin (Administración)
│   ├── Servicios
│   │   ├── dassAnalysis.js (Análisis DASS-21)
│   │   └── Validación y procesamiento
│   ├── Middleware
│   │   ├── auth.js (Autenticación JWT)
│   │   ├── admin.js (Permisos administrativos)
│   │   └── Validación de datos
│   ├── Modelos de Datos (MongoDB)
│   │   ├── User (Usuarios)
│   │   ├── QuestionnaireResult (Resultados)
│   │   ├── Exercise (Ejercicios)
│   │   ├── Tip (Consejos)
│   │   ├── ChatGroup/ChatMessage (Chats)
│   │   └── Feedback (Comentarios)
│   └── Socket.io Server
│       ├── Autenticación de sockets
│       ├── Salas de chat grupal
│       └── Indicadores de escritura
│
└── Base de Datos (MongoDB)
    ├── Usuarios y autenticación
    ├── Resultados de evaluaciones
    ├── Contenido educativo
    ├── Historial de chats
    └── Datos analíticos
```

### Flujo de Datos Principal

1. **Registro/Login** → JWT Token → Estado global (AuthContext)
2. **Cuestionario** → Validación → Análisis DASS-21 → Recomendaciones → Base de datos
3. **Chat** → Socket.io → Validación → Base de datos → Broadcast en tiempo real
4. **Ejercicios/Tips** → API REST → Base de datos → Frontend
5. **Mapa** → Google Maps API → Ubicaciones → Leaflet rendering

## Mapa de Viaje del Usuario (User Journey)

### Viaje Típico de un Usuario Nuevo

```
Inicio
    ↓
Registro/Login
    ↓
Evaluación Inicial (DASS-21)
    ├── 21 preguntas sobre depresión, ansiedad y estrés
    ↓
Análisis Automático
    ├── Cálculo de puntuaciones
    ├── Determinación de niveles de severidad
    └── Generación de recomendaciones personalizadas
    ↓
Dashboard Personal
    ├── Resumen de resultados
    ├── Recomendaciones prioritarias
    └── Acceso a recursos
    ↓
Exploración de Recursos
    ├── [Ruta A] Ejercicios Terapéuticos
    │   ├── Navegación por categorías
    │   ├── Lectura de ejercicios detallados
    │   └── Marcado de favoritos
    │
    ├── [Ruta B] Consejos y Tips
    │   ├── Biblioteca organizada por temas
    │   ├── Búsqueda por palabras clave
    │   └── Lectura y aplicación
    │
    └── [Ruta C] Chat Comunitario
        ├── Exploración de grupos disponibles
        ├── Unión a grupos relevantes
        └── Participación en conversaciones
            ↓
        Interacción en Tiempo Real
            ├── Envío de mensajes
            ├── Indicadores de escritura
            ├── Reacciones y respuestas
            └── Moderación automática
    ↓
Seguimiento Periódico
    ├── Recordatorios para reevaluación
    ├── Comparación de progreso
    └── Ajuste de recomendaciones
    ↓
Acceso a Servicios Profesionales
    ├── Mapa de servicios de salud cercanos
    ├── Información de contacto
    └── Referencias especializadas
```

### Escenarios Específicos

#### Usuario con Ansiedad Moderada
```
Evaluación → Severidad "Moderada" → Recomendación: "Ejercicio para Ansiedad Moderada"
    ↓
Acceso a ejercicios específicos → Práctica guiada → Seguimiento de progreso
    ↓
Participación en grupo de apoyo → Interacción con pares → Reducción de aislamiento
```

#### Usuario con Depresión Severa
```
Evaluación → Severidad "Severa" → Recomendación: "Apoyo para Depresión Severa"
    ↓
Conexión con profesionales → Referencias especializadas → Atención inmediata
    ↓
Monitoreo continuo → Ajustes de tratamiento → Recuperación gradual
```

#### Usuario de Mantenimiento
```
Evaluación → Severidad "Normal" → Recomendación: "Mantén tu bienestar"
    ↓
Recursos preventivos → Hábitos saludables → Prevención de recaídas
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB
- Git

### Instalación del Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev
```

### Instalación del Frontend
```bash
cd frontend
npm install
npm start
```

### Variables de Entorno
- `MONGODB_URI`: URI de conexión a MongoDB
- `JWT_SECRET`: Clave secreta para JWT
- `PORT`: Puerto del servidor
- `CORS_ORIGIN`: Orígenes permitidos para CORS

## Despliegue

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render)
- Conectar repositorio a Render
- Configurar variables de entorno
- Despliegue automático

## Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para preguntas o soporte, por favor contactar al equipo de desarrollo.