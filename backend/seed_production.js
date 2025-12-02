const mongoose = require('mongoose');
const ChatGroup = require('./models/ChatGroup');
const Exercise = require('./models/Exercise');

// Datos de seed
// First, find an admin user to use as createdBy
const User = require('./models/User');
let adminUser = await User.findOne({ role: 'admin' });

if (!adminUser) {
  // Create a temporary admin user if none exists
  adminUser = new User({
    username: 'admin_seed',
    email: 'admin@seed.local',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkI0qQcO8m5m', // 'seedpassword'
    firstName: 'Admin',
    lastName: 'Seed',
    role: 'admin',
    isActive: true,
    questionnaireCompleted: true
  });
  await adminUser.save();
  console.log('✅ Created temporary admin user for seeding');
}

const chatGroups = [
  {
    name: 'Grupo de Apoyo contra la Depresión',
    description: 'Espacio seguro para compartir experiencias y recibir apoyo mutuo en el camino hacia la recuperación de la depresión.',
    type: 'peer_support',
    disorderCategory: 'depression',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Acompañamiento para la Ansiedad',
    description: 'Grupo de apoyo para personas que lidian con ansiedad, donde podemos compartir estrategias y experiencias.',
    type: 'peer_support',
    disorderCategory: 'anxiety',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Red de Apoyo para Estrés Crónico',
    description: 'Conecta con personas que entienden el estrés crónico y comparte formas de manejarlo.',
    type: 'peer_support',
    disorderCategory: 'stress',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Círculo de Bienestar Emocional',
    description: 'Un espacio para explorar y mejorar nuestra salud emocional colectiva.',
    type: 'general',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Grupo de Manejo de Emociones',
    description: 'Aprende técnicas para identificar, comprender y gestionar tus emociones de manera saludable.',
    type: 'general',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Espacio para Autoestima y Autoconfianza',
    description: 'Trabajemos juntos en construir una autoestima sólida y confianza en nosotros mismos.',
    type: 'general',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Grupo para Duelo y Pérdida',
    description: 'Apoyo compasivo para quienes atraviesan procesos de duelo y pérdida.',
    type: 'general',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  },
  {
    name: 'Apoyo para Relaciones Personales',
    description: 'Explora y mejora tus relaciones interpersonales con el apoyo de la comunidad.',
    type: 'general',
    maxMembers: 50,
    isActive: true,
    createdBy: adminUser._id
  }
];

const exercises = [
  // Ejercicios Diarios
  {
    title: 'Diario de Gratitud',
    description: 'Escribe 3 cosas por las que estás agradecido cada día',
    category: 'daily',
    duration: 10,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Toma tu diario o una hoja de papel' },
      { step: 2, text: 'Escribe la fecha en la parte superior' },
      { step: 3, text: 'Lista 3 cosas por las que estás agradecido hoy' },
      { step: 4, text: 'Reflexiona por qué te hacen sentir agradecido' }
    ],
    targetDisorders: ['depression', 'anxiety', 'stress'],
    isActive: true
  },
  {
    title: 'Registro de Emociones',
    description: 'Identifica y registra tus emociones a lo largo del día',
    category: 'daily',
    duration: 15,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Lleva una libreta o usa una app de notas' },
      { step: 2, text: 'Cada 2-3 horas, registra cómo te sientes' },
      { step: 3, text: 'Describe la emoción y qué la provocó' },
      { step: 4, text: 'Busca patrones en tus emociones' }
    ],
    targetDisorders: ['anxiety', 'depression'],
    isActive: true
  },
  {
    title: 'Control de Pensamientos',
    description: 'Practica detener pensamientos negativos y reemplazarlos',
    category: 'daily',
    duration: 20,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Siéntate en un lugar tranquilo' },
      { step: 2, text: 'Cuando llegue un pensamiento negativo, di "STOP"' },
      { step: 3, text: 'Reemplaza el pensamiento con uno positivo o neutral' },
      { step: 4, text: 'Repite durante 20 minutos' }
    ],
    targetDisorders: ['anxiety', 'depression'],
    isActive: true
  },
  {
    title: 'Descarga Mental',
    description: 'Libera tensiones mentales escribiendo tus preocupaciones',
    category: 'daily',
    duration: 15,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Prepara papel y bolígrafo' },
      { step: 2, text: 'Escribe todas tus preocupaciones sin filtro' },
      { step: 3, text: 'No te detengas hasta que no tengas más que escribir' },
      { step: 4, text: 'Rompe o quema el papel como símbolo de liberación' }
    ],
    targetDisorders: ['stress', 'anxiety'],
    isActive: true
  },
  {
    title: 'Metas Diarias Positivas',
    description: 'Establece pequeñas metas alcanzables para el día',
    category: 'daily',
    duration: 10,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Piensa en 3 cosas que quieres lograr hoy' },
      { step: 2, text: 'Asegúrate de que sean realistas y positivas' },
      { step: 3, text: 'Escribe cada meta con detalle' },
      { step: 4, text: 'Revisa tu progreso al final del día' }
    ],
    targetDisorders: ['depression', 'stress'],
    isActive: true
  },
  {
    title: 'Técnica Anti-Estrés',
    description: 'Ejercicio de respiración para reducir el estrés inmediato',
    category: 'daily',
    duration: 5,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Siéntate cómodamente con la espalda recta' },
      { step: 2, text: 'Inhala profundamente por la nariz durante 4 segundos' },
      { step: 3, text: 'Mantén el aire durante 4 segundos' },
      { step: 4, text: 'Exhala lentamente por la boca durante 6 segundos' },
      { step: 5, text: 'Repite 5 veces' }
    ],
    targetDisorders: ['stress', 'anxiety'],
    isActive: true
  },
  {
    title: 'Autocompasión Diaria',
    description: 'Practica ser amable contigo mismo como lo harías con un amigo',
    category: 'daily',
    duration: 10,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Piensa en algo que te preocupa' },
      { step: 2, text: 'Pregúntate: "¿Qué le diría a un amigo en esta situación?"' },
      { step: 3, text: 'Repite esas palabras amables para ti mismo' },
      { step: 4, text: 'Siente la compasión que generarías' }
    ],
    targetDisorders: ['depression', 'anxiety'],
    isActive: true
  },

  // Ejercicios Físicos
  {
    title: 'Estiramientos Matutinos',
    description: 'Rutina de estiramientos para comenzar el día con energía',
    category: 'physical',
    duration: 15,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Párate derecho con los pies separados al ancho de hombros' },
      { step: 2, text: 'Levanta los brazos por encima de la cabeza y estírate' },
      { step: 3, text: 'Inclínate hacia un lado, luego hacia el otro' },
      { step: 4, text: 'Tócate los dedos de los pies manteniendo las piernas rectas' },
      { step: 5, text: 'Gira el torso suavemente hacia ambos lados' }
    ],
    targetDisorders: ['stress', 'depression'],
    isActive: true
  },
  {
    title: 'Ejercicios de Movilidad',
    description: 'Mejora la movilidad articular con movimientos suaves',
    category: 'physical',
    duration: 20,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Siéntate o párate cómodo' },
      { step: 2, text: 'Rota los hombros hacia adelante y atrás' },
      { step: 3, text: 'Mueve el cuello suavemente en círculos' },
      { step: 4, text: 'Rota las muñecas y los tobillos' },
      { step: 5, text: 'Haz círculos con las caderas' }
    ],
    targetDisorders: ['stress', 'anxiety'],
    isActive: true
  },
  {
    title: 'Liberación de Tensión en la Espalda',
    description: 'Ejercicios específicos para liberar tensión acumulada',
    category: 'physical',
    duration: 15,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Túmbate boca arriba en el suelo' },
      { step: 2, text: 'Dobla las rodillas y mantén los pies planos' },
      { step: 3, text: 'Levanta las caderas ligeramente del suelo' },
      { step: 4, text: 'Mantén la posición durante 5 segundos' },
      { step: 5, text: 'Baja lentamente y repite 10 veces' }
    ],
    targetDisorders: ['stress', 'anxiety'],
    isActive: true
  },
  {
    title: 'Activación Energética',
    description: 'Movimientos para despertar el cuerpo y la mente',
    category: 'physical',
    duration: 10,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Párate derecho con los brazos a los lados' },
      { step: 2, text: 'Sacude las manos y los brazos vigorosamente' },
      { step: 3, text: 'Salta ligeramente en el lugar' },
      { step: 4, text: 'Gira el torso de lado a lado' },
      { step: 5, text: 'Termina con respiraciones profundas' }
    ],
    targetDisorders: ['depression', 'stress'],
    isActive: true
  },
  {
    title: 'Relajación para Ansiedad',
    description: 'Secuencia de movimientos para calmar la ansiedad física',
    category: 'physical',
    duration: 12,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Siéntate cómodamente' },
      { step: 2, text: 'Tensa los músculos de los hombros durante 5 segundos' },
      { step: 3, text: 'Libera la tensión lentamente' },
      { step: 4, text: 'Repite con brazos, manos y piernas' },
      { step: 5, text: 'Termina respirando profundamente' }
    ],
    targetDisorders: ['anxiety', 'stress'],
    isActive: true
  },
  {
    title: 'Yoga para Principiantes',
    description: 'Posiciones básicas de yoga para relajación',
    category: 'physical',
    duration: 25,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Comienza con la postura del niño (balasana)' },
      { step: 2, text: 'Pasa a la postura del gato-vaca' },
      { step: 3, text: 'Haz la postura del árbol (vrksasana)' },
      { step: 4, text: 'Termina con savasana (relajación)' }
    ],
    targetDisorders: ['stress', 'anxiety'],
    isActive: true
  },
  {
    title: 'Liberación de Hombros',
    description: 'Ejercicios específicos para hombros tensos',
    category: 'physical',
    duration: 8,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Siéntate o párate derecho' },
      { step: 2, text: 'Levanta los hombros hacia las orejas' },
      { step: 3, text: 'Mantén durante 5 segundos y libera' },
      { step: 4, text: 'Rota los hombros hacia atrás en círculos' },
      { step: 5, text: 'Repite hacia adelante' }
    ],
    targetDisorders: ['stress', 'anxiety'],
    isActive: true
  },

  // Ejercicios Cognitivos
  {
    title: 'Reencuadre Cognitivo',
    description: 'Aprende a cambiar perspectivas negativas por positivas',
    category: 'cognitive',
    duration: 20,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Identifica un pensamiento negativo' },
      { step: 2, text: 'Pregúntate: "¿Hay evidencia que lo contradiga?"' },
      { step: 3, text: 'Busca explicaciones alternativas más positivas' },
      { step: 4, text: 'Escribe el nuevo pensamiento reencuadrado' }
    ],
    targetDisorders: ['depression', 'anxiety'],
    isActive: true
  },
  {
    title: 'Ejercicio de Concentración',
    description: 'Entrena tu capacidad de atención plena',
    category: 'cognitive',
    duration: 15,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Siéntate en un lugar tranquilo' },
      { step: 2, text: 'Enfócate en tu respiración' },
      { step: 3, text: 'Cuando tu mente divague, regresa gentilmente a la respiración' },
      { step: 4, text: 'Practica durante 15 minutos' }
    ],
    targetDisorders: ['anxiety', 'stress'],
    isActive: true
  },
  {
    title: 'Identificación de Distorsiones',
    description: 'Reconoce patrones de pensamiento distorsionado',
    category: 'cognitive',
    duration: 25,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Revisa pensamientos recientes' },
      { step: 2, text: 'Identifica si contienen distorsiones cognitivas' },
      { step: 3, text: 'Comunes: pensamiento todo-o-nada, catastrofización' },
      { step: 4, text: 'Reemplaza con pensamientos más balanceados' }
    ],
    targetDisorders: ['depression', 'anxiety'],
    isActive: true
  },
  {
    title: 'Técnica STOP',
    description: 'Detén pensamientos compulsivos inmediatamente',
    category: 'cognitive',
    duration: 5,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Cuando llegue un pensamiento intrusivo, di STOP' },
      { step: 2, text: 'Toma una respiración profunda' },
      { step: 3, text: 'Observa el pensamiento sin juzgarlo' },
      { step: 4, text: 'Continúa con tu actividad normal' }
    ],
    targetDisorders: ['anxiety', 'ocd'],
    isActive: true
  },
  {
    title: 'Mapas Mentales de Preocupaciones',
    description: 'Organiza tus preocupaciones de forma visual',
    category: 'cognitive',
    duration: 20,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Dibuja un círculo en el centro con tu preocupación principal' },
      { step: 2, text: 'Agrega ramas con preocupaciones relacionadas' },
      { step: 3, text: 'Para cada rama, piensa en soluciones posibles' },
      { step: 4, text: 'Identifica qué puedes controlar y qué no' }
    ],
    targetDisorders: ['anxiety', 'stress'],
    isActive: true
  },
  {
    title: 'Visualización de Escenarios',
    description: 'Practica escenarios positivos para reducir ansiedad',
    category: 'cognitive',
    duration: 15,
    difficulty: 'intermediate',
    instructions: [
      { step: 1, text: 'Cierra los ojos y relájate' },
      { step: 2, text: 'Visualiza una situación que te preocupa' },
      { step: 3, text: 'Imagina el mejor resultado posible' },
      { step: 4, text: 'Siente las emociones positivas del resultado' }
    ],
    targetDisorders: ['anxiety', 'stress'],
    isActive: true
  },
  {
    title: 'Atención a Sonidos',
    description: 'Ejercicio de atención plena con sonidos ambientales',
    category: 'cognitive',
    duration: 10,
    difficulty: 'beginner',
    instructions: [
      { step: 1, text: 'Siéntate cómodamente en un lugar tranquilo' },
      { step: 2, text: 'Cierra los ojos y enfócate en los sonidos' },
      { step: 3, text: 'Identifica cada sonido sin juzgarlo' },
      { step: 4, text: 'Deja que los sonidos vengan y vayan' }
    ],
    targetDisorders: ['anxiety', 'stress'],
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');

    // Conectar usando las variables de entorno
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connected to MongoDB');

    // Insertar grupos de chat
    console.log('📝 Inserting chat groups...');
    for (const groupData of chatGroups) {
      const existingGroup = await ChatGroup.findOne({ name: groupData.name });
      if (!existingGroup) {
        const group = new ChatGroup(groupData);
        await group.save();
        console.log(`✅ Created group: ${groupData.name}`);
      } else {
        console.log(`⏭️  Skipped existing group: ${groupData.name}`);
      }
    }

    // Insertar ejercicios
    console.log('🏃 Inserting exercises...');
    for (const exerciseData of exercises) {
      const existingExercise = await Exercise.findOne({ title: exerciseData.title });
      if (!existingExercise) {
        const exercise = new Exercise(exerciseData);
        await exercise.save();
        console.log(`✅ Created exercise: ${exerciseData.title}`);
      } else {
        console.log(`⏭️  Skipped existing exercise: ${exerciseData.title}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Added ${chatGroups.length} chat groups and ${exercises.length} exercises`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  // Intentar cargar variables de entorno de producción
  require('dotenv').config({ path: './.env' });

  // Forzar uso de base de datos de producción (asumiendo que está configurada en Render)
  // Si no está configurada, intentar con una URI de producción típica
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('xxxxx')) {
    console.log('⚠️  MONGODB_URI no configurada o es placeholder. Intentando con URI de producción...');
    // Aquí puedes reemplazar con la URI real de producción si la conoces
    // process.env.MONGODB_URI = 'mongodb+srv://tu_usuario_real:tu_password_real@cluster0.xxxxx.mongodb.net/mente_sana?retryWrites=true&w=majority';
    console.log('❌ No se puede determinar la URI de producción automáticamente.');
    console.log('💡 Opción 1: Configura MONGODB_URI en backend/.env con la URI real de producción');
    console.log('💡 Opción 2: Ejecuta: node seed_production.js "tu_mongodb_uri_real_aqui"');
    process.exit(1);
  }

  console.log('🔗 Usando MongoDB URI:', process.env.MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@'));
  seedDatabase();
}

module.exports = { seedDatabase };