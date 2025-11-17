const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const Tip = require('../models/Tip');

const exercisesData = [
  {
    title: 'Respiración 4-7-8',
    description: 'La técnica de respiración 4-7-8 es un ejercicio de respiración profunda desarrollado por el Dr. Andrew Weil. Esta técnica ayuda a reducir la ansiedad, promover el sueño reparador y calmar el sistema nervioso.',
    duration: '5 minutos',
    category: 'breathing',
    instructions: [
      'Siéntate cómodamente con la espalda recta en una silla o almohada en el suelo.',
      'Coloca la punta de la lengua en el paladar superior, justo detrás de los dientes frontales.',
      'Exhala completamente por la boca, haciendo un sonido de "whoosh".',
      'Inhala silenciosamente por la nariz durante 4 segundos.',
      'Retén la respiración durante 7 segundos.',
      'Exhala completamente por la boca durante 8 segundos, haciendo el sonido de "whoosh".',
      'Repite el ciclo 4 veces.'
    ],
    benefits: [
      'Reduce la ansiedad y el estrés',
      'Ayuda a conciliar el sueño más rápidamente',
      'Mejora la concentración y el enfoque',
      'Regula el sistema nervioso autónomo',
      'Puede practicarse en cualquier momento y lugar'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=4bB49F5GZsw'
  },
  {
    title: 'Meditación Mindfulness',
    description: 'La meditación mindfulness, o atención plena, es una práctica que consiste en prestar atención al momento presente de manera intencional y sin juzgar. Esta técnica ayuda a desarrollar una mayor consciencia de nuestros pensamientos, emociones y sensaciones corporales.',
    duration: '10 minutos',
    category: 'meditation',
    instructions: [
      'Siéntate en un lugar tranquilo donde no te interrumpan.',
      'Adopta una postura cómoda con la espalda recta.',
      'Cierra los ojos suavemente o mantén una mirada suave hacia abajo.',
      'Enfócate en tu respiración natural - siente como el aire entra y sale.',
      'Cuando tu mente divague (como sucederá), gentilmente regresa tu atención a la respiración.',
      'Observa tus pensamientos sin juzgarlos, como nubes pasando por el cielo.',
      'Continúa por el tiempo establecido, terminando con una respiración profunda.'
    ],
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora la concentración y la claridad mental',
      'Aumenta la capacidad de manejar emociones difíciles',
      'Mejora la calidad del sueño',
      'Desarrolla mayor resiliencia emocional'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ZToicYcHwb4'
  },
  {
    title: 'Relajación Muscular Progresiva',
    description: 'La relajación muscular progresiva es una técnica desarrollada por Edmund Jacobson que consiste en tensar y relajar grupos musculares específicos del cuerpo. Esta práctica ayuda a liberar la tensión acumulada y reduce los niveles de estrés.',
    duration: '15 minutos',
    category: 'relaxation',
    instructions: [
      'Túmbate cómodamente en una superficie plana o siéntate en una silla cómoda.',
      'Comienza por los pies: tense los músculos de los dedos y el arco del pie durante 5 segundos.',
      'Libera la tensión lentamente, sintiendo como los músculos se relajan.',
      'Continúa con las pantorrillas, glúteos, abdomen, pecho, brazos, cuello y rostro.',
      'Respira profundamente durante todo el proceso.',
      'Termina con una respiración profunda y abre los ojos lentamente.'
    ],
    benefits: [
      'Reduce la tensión muscular crónica',
      'Ayuda con dolores de cabeza tensionales',
      'Mejora la calidad del sueño',
      'Reduce la ansiedad y el estrés diario.',
      'Mejora la circulación sanguínea'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=86HUcX8TWZs'
  }
];

const tipsData = [
  {
    title: 'Practica la Gratitud Diaria',
    content: 'Cada noche, escribe 3 cosas por las que estás agradecido. Esto ayuda a cambiar el enfoque de lo negativo a lo positivo.',
    category: 'daily_habit',
    videoUrl: 'https://www.youtube.com/watch?v=WPPPFqsECz0'
  },
  {
    title: 'Establece Límites Saludables',
    content: 'Aprende a decir "no" cuando sea necesario. Proteger tu energía es fundamental para mantener el equilibrio emocional.',
    category: 'coping_strategy',
    videoUrl: 'https://www.youtube.com/watch?v=5t8xAcPK-9E'
  },
  {
    title: 'Crea una Rutina de Sueño',
    content: 'Acuéstate y levántate a la misma hora todos los días. Evita pantallas al menos 1 hora antes de dormir.',
    category: 'lifestyle',
    videoUrl: 'https://www.youtube.com/watch?v=nmFhqKHZrns'
  },
  {
    title: 'Comunicación Asertiva',
    content: 'Expresa tus sentimientos y necesidades de manera clara y respetuosa. Usa frases como "Me siento..." en lugar de "Tú me haces sentir...".',
    category: 'relationships',
    videoUrl: 'https://www.youtube.com/watch?v=3kO3q8aT1oE'
  },
  {
    title: 'Técnica Pomodoro en el Trabajo',
    content: 'Trabaja 25 minutos concentrado y toma un descanso de 5 minutos. Después de 4 ciclos, toma un descanso más largo.',
    category: 'work_life',
    videoUrl: 'https://www.youtube.com/watch?v=1h8j8F8r5lY'
  }
];

const categoriesData = {
  exercises: [
    { id: 'all', label: 'Todos', icon: '🧘' },
    { id: 'breathing', label: 'Respiración', icon: '🫁' },
    { id: 'meditation', label: 'Meditación', icon: '🧘' },
    { id: 'relaxation', label: 'Relajación', icon: '😌' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🌸' }
  ],
  tips: [
    { id: 'all', label: 'Todos', icon: '💡' },
    { id: 'daily_habit', label: 'Hábitos Diarios', icon: '🌅' },
    { id: 'coping_strategy', label: 'Estrategias de Afrontamiento', icon: '🛡️' },
    { id: 'lifestyle', label: 'Estilo de Vida', icon: '🏠' },
    { id: 'relationships', label: 'Relaciones', icon: '❤️' },
    { id: 'work_life', label: 'Vida Laboral', icon: '💼' },
    { id: 'self_care', label: 'Autocuidado', icon: '🧴' }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Exercise.deleteMany({});
    await Tip.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert exercises
    const exercises = await Exercise.insertMany(exercisesData);
    console.log(`✅ Inserted ${exercises.length} exercises`);

    // Insert tips
    const tips = await Tip.insertMany(tipsData);
    console.log(`✅ Inserted ${tips.length} tips`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Exercises: ${exercises.length}`);
    console.log(`   Tips: ${tips.length}`);
    console.log('\n🎬 All exercises and tips now have video URLs!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run seeder if called directly
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mente-sana')
    .then(() => {
      console.log('📡 Connected to MongoDB');
      return seedDatabase();
    })
    .catch(error => {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase, exercisesData, tipsData, categoriesData };