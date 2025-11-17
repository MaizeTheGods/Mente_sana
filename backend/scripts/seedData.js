const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const Tip = require('../models/Tip');

const exercisesData = [
  {
    title: 'Respiración 4-7-8',
    description: 'La técnica de respiración 4-7-8 es un ejercicio de respiración profunda desarrollado por el Dr. Andrew Weil. Esta técnica ayuda a reducir la ansiedad, promover el sueño reparador y calmar el sistema nervioso.',
    duration: 5,
    category: 'breathing',
    instructions: [
      { step: 1, text: 'Siéntate cómodamente con la espalda recta en una silla o almohada en el suelo.', duration: 10 },
      { step: 2, text: 'Coloca la punta de la lengua en el paladar superior, justo detrás de los dientes frontales.', duration: 5 },
      { step: 3, text: 'Exhala completamente por la boca, haciendo un sonido de "whoosh".', duration: 8 },
      { step: 4, text: 'Inhala silenciosamente por la nariz durante 4 segundos.', duration: 4 },
      { step: 5, text: 'Retén la respiración durante 7 segundos.', duration: 7 },
      { step: 6, text: 'Exhala completamente por la boca durante 8 segundos, haciendo el sonido de "whoosh".', duration: 8 },
      { step: 7, text: 'Repite el ciclo 4 veces.', duration: 0 }
    ],
    benefits: [
      'Reduce la ansiedad y el estrés',
      'Ayuda a conciliar el sueño más rápidamente',
      'Mejora la concentración y el enfoque',
      'Regula el sistema nervioso autónomo',
      'Puede practicarse en cualquier momento y lugar'
    ],
    media: {
      videoUrl: '4bB49F5GZsw'
    }
  },
  {
    title: 'Meditación Mindfulness',
    description: 'La meditación mindfulness, o atención plena, es una práctica que consiste en prestar atención al momento presente de manera intencional y sin juzgar. Esta técnica ayuda a desarrollar una mayor consciencia de nuestros pensamientos, emociones y sensaciones corporales.',
    duration: 10,
    category: 'meditation',
    instructions: [
      { step: 1, text: 'Siéntate en un lugar tranquilo donde no te interrumpan.', duration: 30 },
      { step: 2, text: 'Adopta una postura cómoda con la espalda recta.', duration: 10 },
      { step: 3, text: 'Cierra los ojos suavemente o mantén una mirada suave hacia abajo.', duration: 5 },
      { step: 4, text: 'Enfócate en tu respiración natural - siente como el aire entra y sale.', duration: 120 },
      { step: 5, text: 'Cuando tu mente divague (como sucederá), gentilmente regresa tu atención a la respiración.', duration: 300 },
      { step: 6, text: 'Observa tus pensamientos sin juzgarlos, como nubes pasando por el cielo.', duration: 180 },
      { step: 7, text: 'Continúa por el tiempo establecido, terminando con una respiración profunda.', duration: 30 }
    ],
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora la concentración y la claridad mental',
      'Aumenta la capacidad de manejar emociones difíciles',
      'Mejora la calidad del sueño',
      'Desarrolla mayor resiliencia emocional'
    ],
    media: {
      videoUrl: 'ZToicYcHwb4'
    }
  },
  {
    title: 'Relajación Muscular Progresiva',
    description: 'La relajación muscular progresiva es una técnica desarrollada por Edmund Jacobson que consiste en tensar y relajar grupos musculares específicos del cuerpo. Esta práctica ayuda a liberar la tensión acumulada y reduce los niveles de estrés.',
    duration: 15,
    category: 'relaxation',
    instructions: [
      { step: 1, text: 'Túmbate cómodamente en una superficie plana o siéntate en una silla cómoda.', duration: 30 },
      { step: 2, text: 'Comienza por los pies: tense los músculos de los dedos y el arco del pie durante 5 segundos.', duration: 5 },
      { step: 3, text: 'Libera la tensión lentamente, sintiendo como los músculos se relajan.', duration: 10 },
      { step: 4, text: 'Continúa con las pantorrillas, glúteos, abdomen, pecho, brazos, cuello y rostro.', duration: 300 },
      { step: 5, text: 'Respira profundamente durante todo el proceso.', duration: 400 },
      { step: 6, text: 'Termina con una respiración profunda y abre los ojos lentamente.', duration: 30 }
    ],
    benefits: [
      'Reduce la tensión muscular crónica',
      'Ayuda con dolores de cabeza tensionales',
      'Mejora la calidad del sueño',
      'Reduce la ansiedad y el estrés diario',
      'Mejora la circulación sanguínea'
    ],
    media: {
      videoUrl: '86HUcX8TWZs'
    }
  },
  {
    title: 'Respiración Cuadrada (Box Breathing)',
    description: 'La respiración cuadrada, también conocida como box breathing, es una técnica de respiración que ayuda a mantener la calma y mejorar la concentración. Es utilizada por militares y atletas de élite.',
    duration: 5,
    category: 'breathing',
    instructions: [
      { step: 1, text: 'Siéntate cómodamente con la espalda recta.', duration: 10 },
      { step: 2, text: 'Inhala lentamente por la nariz durante 4 segundos.', duration: 4 },
      { step: 3, text: 'Retén la respiración durante 4 segundos.', duration: 4 },
      { step: 4, text: 'Exhala lentamente por la boca durante 4 segundos.', duration: 4 },
      { step: 5, text: 'Mantén los pulmones vacíos durante 4 segundos.', duration: 4 },
      { step: 6, text: 'Repite el ciclo 4-5 veces.', duration: 0 }
    ],
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora la concentración y el enfoque',
      'Ayuda en situaciones de alta presión',
      'Regula el ritmo cardíaco',
      'Aumenta la claridad mental'
    ],
    media: {
      videoUrl: '8T1W2q9b3E'
    }
  },
  {
    title: 'Meditación Guiada para Ansiedad',
    description: 'Esta meditación guiada está diseñada específicamente para personas que sufren de ansiedad. Te guía a través de visualizaciones calmantes y afirmaciones positivas.',
    duration: 12,
    category: 'meditation',
    instructions: [
      { step: 1, text: 'Encuentra un lugar tranquilo y cómodo.', duration: 30 },
      { step: 2, text: 'Cierra los ojos y enfócate en tu respiración.', duration: 60 },
      { step: 3, text: 'Visualiza un lugar seguro y pacífico.', duration: 180 },
      { step: 4, text: 'Repite mentalmente afirmaciones positivas.', duration: 300 },
      { step: 5, text: 'Permite que las preocupaciones fluyan sin juzgarlas.', duration: 240 },
      { step: 6, text: 'Regresa gradualmente a la consciencia plena.', duration: 60 }
    ],
    benefits: [
      'Reduce síntomas de ansiedad',
      'Promueve la relajación profunda',
      'Ayuda a manejar pensamientos intrusivos',
      'Mejora el sueño',
      'Desarrolla mayor control emocional'
    ],
    media: {
      videoUrl: 'inpok4MKVLM'
    }
  },
  {
    title: 'Ejercicio de Grounding (Anclaje)',
    description: 'El ejercicio de grounding te ayuda a reconectar con el momento presente cuando te sientes abrumado o ansioso. Es especialmente útil durante ataques de pánico.',
    duration: 3,
    category: 'mindfulness',
    instructions: [
      { step: 1, text: 'Siéntate o párate en un lugar seguro.', duration: 10 },
      { step: 2, text: 'Nombra 5 cosas que puedes ver alrededor tuyo.', duration: 15 },
      { step: 3, text: 'Nombra 4 cosas que puedes tocar.', duration: 15 },
      { step: 4, text: 'Nombra 3 cosas que puedes oír.', duration: 15 },
      { step: 5, text: 'Nombra 2 cosas que puedes oler.', duration: 15 },
      { step: 6, text: 'Nombra 1 cosa que puedes saborear.', duration: 15 }
    ],
    benefits: [
      'Ayuda durante ataques de pánico',
      'Reconecta con el momento presente',
      'Reduce la disociación',
      'Proporciona sensación de seguridad',
      'Puede practicarse en cualquier lugar'
    ],
    media: {
      videoUrl: 'YBk9-1Ce5lU'
    }
  },
  {
    title: 'Yoga Nidra (Sueño Consciente)',
    description: 'Yoga Nidra es una forma de meditación guiada que induce un estado de relajación profunda similar al sueño, pero manteniendo la consciencia. Es muy efectiva para reducir el estrés.',
    duration: 20,
    category: 'relaxation',
    instructions: [
      { step: 1, text: 'Túmbate en posición supina (boca arriba) con las piernas ligeramente separadas.', duration: 30 },
      { step: 2, text: 'Coloca los brazos a los lados del cuerpo con las palmas hacia arriba.', duration: 15 },
      { step: 3, text: 'Cierra los ojos y enfócate en tu intención para esta práctica.', duration: 60 },
      { step: 4, text: 'Sigue la guía para rotar la consciencia por diferentes partes del cuerpo.', duration: 600 },
      { step: 5, text: 'Permite que surjan visualizaciones y sensaciones sin resistencia.', duration: 480 },
      { step: 6, text: 'Regresa gradualmente a la consciencia plena.', duration: 120 }
    ],
    benefits: [
      'Reduce el estrés crónico',
      'Mejora la calidad del sueño',
      'Ayuda con la depresión y ansiedad',
      'Aumenta la creatividad',
      'Promueve la sanación emocional'
    ],
    media: {
      videoUrl: 'z6YgXE4HrKs'
    }
  },
  {
    title: 'Respiración Abdominal (Diafragmática)',
    description: 'La respiración abdominal o diafragmática es la forma natural de respirar. Esta técnica ayuda a activar el sistema nervioso parasimpático y promover la relajación.',
    duration: 8,
    category: 'breathing',
    instructions: [
      { step: 1, text: 'Túmbate boca arriba con las rodillas dobladas o siéntate cómodamente.', duration: 20 },
      { step: 2, text: 'Coloca una mano en el abdomen y otra en el pecho.', duration: 10 },
      { step: 3, text: 'Inhala lentamente por la nariz, permitiendo que el abdomen se eleve.', duration: 4 },
      { step: 4, text: 'Siente como el diafragma se expande hacia abajo.', duration: 4 },
      { step: 5, text: 'Exhala lentamente por la boca o nariz, sintiendo como el abdomen baja.', duration: 6 },
      { step: 6, text: 'Repite por 5-10 minutos, manteniendo el pecho relativamente quieto.', duration: 300 }
    ],
    benefits: [
      'Reduce la frecuencia cardíaca',
      'Mejora la oxigenación',
      'Ayuda con problemas digestivos',
      'Reduce la tensión muscular',
      'Promueve la relajación profunda'
    ],
    media: {
      videoUrl: '1cE1E8RjP8Y'
    }
  },
  {
    title: 'Meditación Metta (Bondad Amorosa)',
    description: 'La meditación Metta cultiva sentimientos de bondad amorosa hacia uno mismo y hacia los demás. Esta práctica ayuda a desarrollar compasión y reducir sentimientos de aislamiento.',
    duration: 15,
    category: 'meditation',
    instructions: [
      { step: 1, text: 'Siéntate cómodamente con la espalda recta.', duration: 30 },
      { step: 2, text: 'Comienza enviando bondad amorosa hacia ti mismo: "Que yo sea feliz, que yo esté sano".', duration: 120 },
      { step: 3, text: 'Envía bondad hacia alguien a quien amas incondicionalmente.', duration: 120 },
      { step: 4, text: 'Envía bondad hacia un amigo neutral.', duration: 120 },
      { step: 5, text: 'Envía bondad hacia alguien con quien tienes dificultades.', duration: 120 },
      { step: 6, text: 'Finalmente, envía bondad hacia todos los seres.', duration: 180 }
    ],
    benefits: [
      'Desarrolla compasión y empatía',
      'Reduce sentimientos de aislamiento',
      'Mejora las relaciones interpersonales',
      'Aumenta la autoestima',
      'Reduce la depresión y ansiedad'
    ],
    media: {
      videoUrl: 't7jovtTxqoo'
    }
  },
  {
    title: 'Escaneo Corporal Mindfulness',
    description: 'El escaneo corporal es una práctica de mindfulness que implica dirigir la atención de manera sistemática a diferentes partes del cuerpo, notando sensaciones sin juzgar.',
    duration: 20,
    category: 'mindfulness',
    instructions: [
      { step: 1, text: 'Túmbate cómodamente boca arriba con los ojos cerrados.', duration: 30 },
      { step: 2, text: 'Comienza enfocando tu atención en los dedos de los pies.', duration: 60 },
      { step: 3, text: 'Nota cualquier sensación: calor, frío, presión, hormigueo.', duration: 60 },
      { step: 4, text: 'Muévete lentamente hacia arriba: pies, tobillos, pantorrillas, rodillas.', duration: 240 },
      { step: 5, text: 'Continúa con caderas, abdomen, pecho, espalda, hombros.', duration: 300 },
      { step: 6, text: 'Finaliza con brazos, manos, cuello y cabeza.', duration: 240 },
      { step: 7, text: 'Regresa tu atención al cuerpo como un todo.', duration: 60 }
    ],
    benefits: [
      'Aumenta la consciencia corporal',
      'Ayuda a identificar y liberar tensión',
      'Mejora la conexión mente-cuerpo',
      'Reduce el estrés y la ansiedad',
      'Ayuda con problemas de sueño'
    ],
    media: {
      videoUrl: 'gJsr2V2L1Wk'
    }
  }
];

const tipsData = [
  {
    title: 'Practica la Gratitud Diaria',
    content: 'Cada noche antes de dormir, escribe 3 cosas por las que estás agradecido. Puede ser algo simple como "tu salud", "una comida deliciosa" o "un amigo que te apoya". Esta práctica ayuda a cambiar el enfoque de lo negativo a lo positivo, entrenando tu cerebro para buscar lo bueno en la vida cotidiana.',
    why: 'La gratitud ha sido científicamente probada para mejorar el bienestar mental, reducir síntomas de depresión y aumentar la satisfacción con la vida.',
    category: 'daily_habit',
    media: {
      videoUrl: 'WPPPFqsECz0'
    }
  },
  {
    title: 'Establece Límites Saludables',
    content: 'Aprende a decir "no" cuando sea necesario. Proteger tu energía es fundamental para mantener el equilibrio emocional. Establece límites claros en tus relaciones laborales y personales, comunicándolos de manera asertiva y respetuosa.',
    why: 'Los límites saludables previenen el agotamiento emocional y te permiten mantener relaciones más equilibradas y satisfactorias.',
    category: 'coping_strategy',
    media: {
      videoUrl: '5t8xAcPK-9E'
    }
  },
  {
    title: 'Crea una Rutina de Sueño Saludable',
    content: 'Acuéstate y levántate a la misma hora todos los días, incluso los fines de semana. Crea un ritual nocturno relajante: evita pantallas al menos 1 hora antes de dormir, toma un baño tibio, lee un libro o practica respiración profunda.',
    why: 'El sueño de calidad es fundamental para la salud mental. La falta de sueño puede aumentar la ansiedad, depresión y dificultar la regulación emocional.',
    category: 'lifestyle',
    media: {
      videoUrl: 'nmFhqKHZrns'
    }
  },
  {
    title: 'Comunicación Asertiva',
    content: 'Expresa tus sentimientos y necesidades de manera clara y respetuosa. Usa frases como "Me siento..." en lugar de "Tú me haces sentir...". Por ejemplo: "Me siento abrumado cuando hay mucho ruido" en vez de "Siempre haces demasiado ruido".',
    why: 'La comunicación asertiva mejora las relaciones, reduce conflictos y aumenta la autoestima al expresar tus necesidades de manera saludable.',
    category: 'relationships',
    media: {
      videoUrl: '3kO3q8aT1oE'
    }
  },
  {
    title: 'Técnica Pomodoro para Mejorar la Productividad',
    content: 'Trabaja 25 minutos concentrado en una tarea (sin distracciones) y toma un descanso de 5 minutos. Después de 4 ciclos, toma un descanso más largo de 15-30 minutos. Usa un temporizador para mantener la disciplina.',
    why: 'Esta técnica previene el agotamiento mental, mejora la concentración y hace que el trabajo sea más manejable al dividirlo en intervalos pequeños.',
    category: 'work_life',
    media: {
      videoUrl: '1h8j8F8r5lY'
    }
  },
  {
    title: 'Mindful Eating (Comer Consciente)',
    content: 'Come sin distracciones: apaga la TV, guarda el teléfono. Mastica lentamente, saborea cada bocado, nota texturas, sabores y aromas. Come solo cuando tengas hambre real, no por aburrimiento o estrés.',
    why: 'El mindful eating mejora la relación con la comida, ayuda a reconocer señales de hambre/saciedad y puede prevenir trastornos alimenticios.',
    category: 'daily_habit',
    media: {
      videoUrl: '2cC2P5V5EiI'
    }
  },
  {
    title: 'Diario de Pensamientos Automáticos',
    content: 'Cuando notes un pensamiento negativo, escríbelo en un diario junto con evidencia que lo contradiga. Por ejemplo: Pensamiento: "Soy un fracaso". Evidencia contraria: "Aprobé mis exámenes", "Tengo amigos que me quieren".',
    why: 'Identificar y cuestionar pensamientos automáticos negativos es una herramienta fundamental en terapia cognitivo-conductual para reducir la depresión y ansiedad.',
    category: 'coping_strategy',
    media: {
      videoUrl: '7Qv0X2Va5gc'
    }
  },
  {
    title: 'Ejercicio Físico Regular',
    content: 'Encuentra una actividad que disfrutes: caminar, bailar, nadar, yoga. Apunta a 30 minutos de actividad moderada la mayoría de los días. No tiene que ser intenso - lo importante es la consistencia.',
    why: 'El ejercicio libera endorfinas, reduce el estrés, mejora el sueño y aumenta la autoestima. Es tan efectivo como los antidepresivos para casos leves de depresión.',
    category: 'lifestyle',
    media: {
      videoUrl: '9L2F8mL9XE'
    }
  },
  {
    title: 'Construye una Red de Apoyo',
    content: 'Identifica personas en las que confías y con quienes puedes hablar abiertamente. Únete a grupos de apoyo, comunidades en línea o actividades sociales. Recuerda que pedir ayuda es un signo de fortaleza, no debilidad.',
    why: 'Las conexiones sociales son protectoras contra la depresión y ansiedad. Sentirse conectado reduce el aislamiento y proporciona perspectivas diferentes.',
    category: 'relationships',
    media: {
      videoUrl: 'tD8KJzOPoKw'
    }
  },
  {
    title: 'Gestión del Tiempo con Matriz Eisenhower',
    content: 'Divide tus tareas en 4 cuadrantes: 1) Urgente e importante (haz ahora), 2) Importante pero no urgente (planifica), 3) Urgente pero no importante (delegar), 4) Ni urgente ni importante (eliminar).',
    why: 'Esta técnica reduce la sobrecarga mental al priorizar efectivamente, previniendo el estrés causado por la procrastinación y la sensación de estar abrumado.',
    category: 'work_life',
    media: {
      videoUrl: 'NyXdXmznNzE'
    }
  },
  {
    title: 'Autocompasión Diaria',
    content: 'Trátate con la misma amabilidad que tratarías a un amigo querido. Cuando cometas un error, en lugar de criticarte duramente, di: "Todos cometemos errores, soy humano". Practica el abrazo propio o afirmaciones positivas.',
    why: 'La autocompasión reduce la autocrítica destructiva, mejora la resiliencia emocional y está asociada con menor depresión y ansiedad.',
    category: 'self_care',
    media: {
      videoUrl: 'V2j4_OyxhcE'
    }
  },
  {
    title: 'Desconexión Digital Saludable',
    content: 'Establece "horas sin pantalla" todos los días. Apaga notificaciones de apps no esenciales. Crea zonas libres de dispositivos (como el dormitorio). Reemplaza el tiempo en pantalla con actividades offline.',
    why: 'La sobrecarga digital aumenta la ansiedad y dificulta el sueño. Las pausas digitales permiten procesar emociones y mejorar la concentración.',
    category: 'daily_habit',
    media: {
      videoUrl: '3E7HKjA9jzg'
    }
  },
  {
    title: 'Técnica de los Cinco Sentidos',
    content: 'Cuando sientas ansiedad, nombra: 5 cosas que ves, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler, 1 que puedes saborear. Esto te ancla en el momento presente y reduce la rumiación.',
    why: 'Esta técnica de grounding interrumpe los ciclos de pensamientos ansiosos al reconectar con el entorno físico inmediato.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'YBk9-1Ce5lU'
    }
  },
  {
    title: 'Alimentación Antiinflamatoria',
    content: 'Incluye más frutas, verduras, nueces, semillas, pescado y aceite de oliva. Reduce azúcares procesados, alimentos fritos y carnes rojas. Come alimentos integrales y de colores variados.',
    why: 'La inflamación crónica está ligada a la depresión. Una dieta antiinflamatoria puede mejorar el estado de ánimo y reducir síntomas depresivos.',
    category: 'lifestyle',
    media: {
      videoUrl: '4XqKd5Vr1PE'
    }
  },
  {
    title: 'Escucha Activa en Conversaciones',
    content: 'Cuando alguien habla, enfócate completamente en lo que dice sin planear tu respuesta. Haz preguntas para clarificar, resume lo que entendiste ("¿Quieres decir que...?"). Evita interrumpir o cambiar de tema.',
    why: 'La escucha activa fortalece las relaciones, reduce malentendidos y hace que los demás se sientan valorados y comprendidos.',
    category: 'relationships',
    media: {
      videoUrl: '7wUCyKQ0p8I'
    }
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