const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const Tip = require('../models/Tip');
const ChatGroup = require('../models/ChatGroup');
const AvatarCategory = require('../models/AvatarCategory');

const exercisesData = [
  // EJERCICIOS DE DIARIO (7 ejercicios)
  {
    title: 'Diario de Gratitud — 3 cosas positivas',
    description: 'Actividad para mejorar el ánimo identificando cosas positivas del día.',
    duration: 5,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Escribe tres cosas que agradeces hoy.', duration: 0 },
      { step: 2, text: 'Explica por qué las elegiste.', duration: 0 },
      { step: 3, text: 'Describe cómo te hicieron sentir.', duration: 0 }
    ],
    benefits: [
      'Mejora el estado de ánimo',
      'Aumenta la positividad',
      'Reduce síntomas de depresión',
      'Fortalece la resiliencia emocional'
    ],
    media: {
      videoUrl: 'MTmYVgIMG2w'
    }
  },
  {
    title: '¿Cómo me siento hoy? — Escala emocional',
    description: 'Registro breve para identificar emociones predominantes.',
    duration: 5,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Escribe tu emoción principal del día.', duration: 0 },
      { step: 2, text: 'Describe qué la generó.', duration: 0 },
      { step: 3, text: 'Anota qué necesitas para sentirte mejor.', duration: 0 }
    ],
    benefits: [
      'Mejora la inteligencia emocional',
      'Ayuda a identificar patrones emocionales',
      'Facilita la autorregulación',
      'Promueve la autoconciencia'
    ],
    media: {
      videoUrl: 'ALv9xU5iQPg'
    }
  },
  {
    title: 'Lo que puedo controlar vs. lo que no puedo',
    description: 'Ejercicio para manejar ansiedad y pensamientos excesivos.',
    duration: 7,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Divide tu página en dos columnas.', duration: 0 },
      { step: 2, text: 'Escribe lo que puedes controlar.', duration: 0 },
      { step: 3, text: 'Escribe lo que está fuera de tu control.', duration: 0 },
      { step: 4, text: 'Enfócate en acciones reales que sí dependan de ti.', duration: 0 }
    ],
    benefits: [
      'Reduce la ansiedad',
      'Mejora el locus de control',
      'Ayuda a priorizar acciones efectivas',
      'Disminuye la rumiación mental'
    ],
    media: {
      videoUrl: '0Qz-h1l_tH4'
    }
  },
  {
    title: 'Descarga mental — vaciar la mente',
    description: 'Ideal para liberar estrés acumulado.',
    duration: 5,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Escribe sin parar todo lo que tengas en la mente.', duration: 0 },
      { step: 2, text: 'No te preocupes por ortografía o coherencia.', duration: 0 },
      { step: 3, text: 'Cuando termines, subraya solo lo más importante.', duration: 0 }
    ],
    benefits: [
      'Libera estrés acumulado',
      'Aclara pensamientos confusos',
      'Reduce la sobrecarga mental',
      'Mejora la claridad cognitiva'
    ],
    media: {
      videoUrl: 'XOHgYVd0A2Q'
    }
  },
  {
    title: 'Diario de metas pequeñas',
    description: 'Ayuda a establecer micro-logros diarios.',
    duration: 6,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Escribe una meta muy simple para hoy.', duration: 0 },
      { step: 2, text: 'Anota qué necesitas para lograrla.', duration: 0 },
      { step: 3, text: 'Evalúa al final si la cumpliste y cómo te sentiste.', duration: 0 }
    ],
    benefits: [
      'Aumenta la motivación',
      'Construye confianza gradual',
      'Desarrolla hábitos positivos',
      'Reduce la procrastinación'
    ],
    media: {
      videoUrl: 'L2z8f0TQ8Qw'
    }
  },
  {
    title: 'Diario del estrés — identificando detonantes',
    description: 'Reflexión sobre momentos tensos del día.',
    duration: 7,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Escribe una situación que te estresó hoy.', duration: 0 },
      { step: 2, text: 'Describe qué pensaste y qué sentiste.', duration: 0 },
      { step: 3, text: 'Escribe una alternativa más saludable de reaccionar.', duration: 0 }
    ],
    benefits: [
      'Identifica patrones de estrés',
      'Desarrolla respuestas más saludables',
      'Mejora la autorregulación emocional',
      'Reduce reacciones automáticas negativas'
    ],
    media: {
      videoUrl: '5NLPxv0FZWU'
    }
  },
  {
    title: 'Me hablo con amabilidad',
    description: 'Escritura para mejorar autoestima y autocompasión.',
    duration: 5,
    category: 'diary',
    instructions: [
      { step: 1, text: 'Escribe una frase amable dirigida a ti.', duration: 0 },
      { step: 2, text: 'Explica por qué la necesitas hoy.', duration: 0 },
      { step: 3, text: 'Anota cómo te hace sentir leerla.', duration: 0 }
    ],
    benefits: [
      'Mejora la autoestima',
      'Desarrolla autocompasión',
      'Reduce la autocrítica',
      'Fortalece la relación consigo mismo'
    ],
    media: {
      videoUrl: 'K4YkZ9B7pFM'
    }
  },

  // EJERCICIOS FÍSICOS (7 ejercicios)
  {
    title: 'Estiramiento completo para relajar tensión',
    description: 'Rutina corta para liberar el cuerpo después de la escuela.',
    duration: 5,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Estira brazos arriba profundamente.', duration: 0 },
      { step: 2, text: 'Rota cuello despacio a ambos lados.', duration: 0 },
      { step: 3, text: 'Flexiona el torso hacia adelante.', duration: 0 }
    ],
    benefits: [
      'Libera tensión muscular',
      'Mejora la circulación',
      'Reduce el estrés físico',
      'Aumenta la flexibilidad'
    ],
    media: {
      videoUrl: '2L2lnxIcNmo'
    }
  },
  {
    title: 'Movilidad de cuello y hombros',
    description: 'Ideal para jóvenes con estrés o rigidez por tareas.',
    duration: 4,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Gira el cuello lentamente.', duration: 0 },
      { step: 2, text: 'Lleva hombros arriba y atrás.', duration: 0 },
      { step: 3, text: 'Relaja y respira profundo.', duration: 0 }
    ],
    benefits: [
      'Alivia tensión en cuello y hombros',
      'Mejora la postura',
      'Reduce dolores de cabeza tensionales',
      'Aumenta la relajación'
    ],
    media: {
      videoUrl: '4BOTvaRaDjI'
    }
  },
  {
    title: 'Estiramiento de espalda baja',
    description: 'Libera tensión de la espalda por estar sentado.',
    duration: 5,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Siéntate en el piso.', duration: 0 },
      { step: 2, text: 'Abraza tus rodillas hacia el pecho.', duration: 0 },
      { step: 3, text: 'Mantén por 20 segundos.', duration: 0 }
    ],
    benefits: [
      'Alivia dolor de espalda baja',
      'Mejora la flexibilidad lumbar',
      'Reduce tensión postural',
      'Promueve relajación general'
    ],
    media: {
      videoUrl: '5T9hVVF6wBs'
    }
  },
  {
    title: 'Activación corporal rápida',
    description: 'Mejora energía y reduce sensación de cansancio mental.',
    duration: 3,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Realiza 10 saltos suaves.', duration: 0 },
      { step: 2, text: 'Agita brazos y piernas.', duration: 0 },
      { step: 3, text: 'Respira profundamente 3 veces.', duration: 0 }
    ],
    benefits: [
      'Aumenta la energía física',
      'Mejora la circulación',
      'Reduce la somnolencia',
      'Activa el sistema nervioso'
    ],
    media: {
      videoUrl: 'WPv6GV3kGkE'
    }
  },
  {
    title: 'Estiramiento para liberar ansiedad',
    description: 'Secuencia suave diseñada para calmar el sistema nervioso.',
    duration: 6,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Extiende brazos hacia adelante.', duration: 0 },
      { step: 2, text: 'Inhala profundo mientras extiendes torso.', duration: 0 },
      { step: 3, text: 'Exhala doblando columna suavemente.', duration: 0 }
    ],
    benefits: [
      'Reduce la ansiedad física',
      'Calma el sistema nervioso',
      'Mejora la respiración',
      'Promueve relajación profunda'
    ],
    media: {
      videoUrl: 'UT0U0ZxF8y8'
    }
  },
  {
    title: 'Yoga básico para relajar la mente',
    description: 'Poses sencillas diseñadas para adolescentes.',
    duration: 7,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Postura del niño 20 segundos.', duration: 0 },
      { step: 2, text: 'Perro boca abajo.', duration: 0 },
      { step: 3, text: 'Postura de montaña con respiración lenta.', duration: 0 }
    ],
    benefits: [
      'Reduce el estrés mental',
      'Mejora la concentración',
      'Fortalece el cuerpo',
      'Promueve equilibrio mente-cuerpo'
    ],
    media: {
      videoUrl: 'dF7bAwAwb94'
    }
  },
  {
    title: 'Liberación de tensión en hombros',
    description: 'Ideal después de clases o emociones fuertes.',
    duration: 5,
    category: 'physical',
    instructions: [
      { step: 1, text: 'Lleva hombros hacia atrás suavemente.', duration: 0 },
      { step: 2, text: 'Presiona brazos hacia el cuerpo.', duration: 0 },
      { step: 3, text: 'Respira profundo durante el movimiento.', duration: 0 }
    ],
    benefits: [
      'Libera tensión acumulada en hombros',
      'Mejora la postura',
      'Reduce estrés físico',
      'Aumenta la relajación'
    ],
    media: {
      videoUrl: 'zExRQYycKEM'
    }
  },

  // EJERCICIOS COGNITIVOS (7 ejercicios)
  {
    title: 'Reencuadre de pensamientos negativos',
    description: 'Ejercicio cognitivo para transformar ideas pesimistas.',
    duration: 6,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'Escribe un pensamiento negativo.', duration: 0 },
      { step: 2, text: 'Cámbialo por uno más realista.', duration: 0 },
      { step: 3, text: 'Evalúa cómo te hace sentir el nuevo pensamiento.', duration: 0 }
    ],
    benefits: [
      'Transforma pensamientos negativos',
      'Mejora el realismo cognitivo',
      'Reduce la depresión',
      'Aumenta la resiliencia mental'
    ],
    media: {
      videoUrl: 'crpXAGsV2uk'
    }
  },
  {
    title: 'Entrenamiento de concentración — 5 objetos',
    description: 'Mejora la atención plena seleccionando objetos a observar.',
    duration: 5,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'Elige un objeto cerca de ti.', duration: 0 },
      { step: 2, text: 'Obsérvalo a detalle durante 1 minuto.', duration: 0 },
      { step: 3, text: 'Repite con 4 objetos más.', duration: 0 }
    ],
    benefits: [
      'Mejora la concentración',
      'Desarrolla atención plena',
      'Reduce la dispersión mental',
      'Fortalece el enfoque'
    ],
    media: {
      videoUrl: 'c-2E3c3TdU9DM'
    }
  },
  {
    title: 'Identificación de distorsiones cognitivas',
    description: 'Ayuda a reconocer pensamientos extremos.',
    duration: 7,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'Piensa en una situación reciente estresante.', duration: 0 },
      { step: 2, text: 'Identifica si exageraste algo.', duration: 0 },
      { step: 3, text: 'Escribe una interpretación más equilibrada.', duration: 0 }
    ],
    benefits: [
      'Identifica distorsiones cognitivas',
      'Promueve pensamiento equilibrado',
      'Reduce ansiedad irracional',
      'Mejora la toma de decisiones'
    ],
    media: {
      videoUrl: 'iZ3c3TdU9DM'
    }
  },
  {
    title: 'Técnica STOP',
    description: 'Método rápido para detener pensamientos obsesivos.',
    duration: 3,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'S = Stop (Detente).', duration: 0 },
      { step: 2, text: 'T = Toma una respiración.', duration: 0 },
      { step: 3, text: 'O = Observa tu mente.', duration: 0 },
      { step: 4, text: 'P = Prosigue conscientemente.', duration: 0 }
    ],
    benefits: [
      'Detiene pensamientos obsesivos',
      'Proporciona pausa mental',
      'Reduce impulsividad',
      'Mejora el control cognitivo'
    ],
    media: {
      videoUrl: '_RZzG0u2cQY'
    }
  },
  {
    title: 'Orden mental — mapa de ideas',
    description: 'Ejercicio para organizar pensamientos y prioridades.',
    duration: 6,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'Toma una hoja.', duration: 0 },
      { step: 2, text: 'Escribe el tema central en medio.', duration: 0 },
      { step: 3, text: 'Extiende ideas alrededor con líneas.', duration: 0 }
    ],
    benefits: [
      'Organiza pensamientos complejos',
      'Mejora la claridad mental',
      'Facilita la resolución de problemas',
      'Reduce la sobrecarga cognitiva'
    ],
    media: {
      videoUrl: 'uQ7z_SBKFQI'
    }
  },
  {
    title: 'Técnica del "si esto pasara…"',
    description: 'Reduce ansiedad anticipatoria analizando escenarios.',
    duration: 7,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'Escribe tu miedo principal.', duration: 0 },
      { step: 2, text: 'Describe el peor escenario posible.', duration: 0 },
      { step: 3, text: 'Después, uno realista y probable.', duration: 0 }
    ],
    benefits: [
      'Reduce ansiedad anticipatoria',
      'Promueve pensamiento realista',
      'Mejora la tolerancia a la incertidumbre',
      'Desarrolla perspectiva equilibrada'
    ],
    media: {
      videoUrl: '8_lS9u-wyQ4'
    }
  },
  {
    title: 'Atención plena en sonidos',
    description: 'Entrenar tu enfoque con estímulos auditivos.',
    duration: 5,
    category: 'cognitive',
    instructions: [
      { step: 1, text: 'Cierra los ojos.', duration: 0 },
      { step: 2, text: 'Escucha sonidos alrededor sin juzgar.', duration: 0 },
      { step: 3, text: 'Identifica 5 sonidos diferentes.', duration: 0 }
    ],
    benefits: [
      'Desarrolla atención plena',
      'Mejora la concentración auditiva',
      'Reduce el ruido mental',
      'Aumenta la consciencia sensorial'
    ],
    media: {
      videoUrl: 'qcNG_doqh0E'
    }
  }
];

const chatGroupsData = [
  {
    name: 'Grupo de Apoyo contra la Depresión',
    description: 'Un espacio seguro para compartir experiencias con la depresión, encontrar apoyo emocional y aprender estrategias de manejo. Recuerda que no estás solo en este camino.',
    category: 'depression',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Acompañamiento para la Ansiedad',
    description: 'Comparte tus experiencias con la ansiedad, aprende técnicas de manejo y encuentra apoyo en personas que entienden lo que vives. Un espacio seguro para hablar abiertamente.',
    category: 'anxiety',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Red de Apoyo para Estrés Crónico',
    description: 'Aprende a manejar el estrés diario, comparte técnicas que funcionan y encuentra apoyo en momentos difíciles. Un oasis de calma en tu rutina.',
    category: 'stress',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Círculo de Bienestar Emocional',
    description: 'Un espacio para trabajar en tu bienestar emocional general, compartir experiencias y aprender herramientas para una vida más equilibrada.',
    category: 'general',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Grupo de Manejo de Emociones',
    description: 'Aprende a identificar, entender y manejar tus emociones de manera saludable. Comparte estrategias que te han funcionado.',
    category: 'general',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Apoyo para Autoestima y Autoconfianza',
    description: 'Trabaja en fortalecer tu autoestima y confianza personal. Comparte tus logros y recibe apoyo para superar inseguridades.',
    category: 'general',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Espacio para Duelo y Pérdida',
    description: 'Un lugar compasivo para procesar el duelo y la pérdida. Comparte tus sentimientos y encuentra comprensión en otros que han pasado por experiencias similares.',
    category: 'general',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
  },
  {
    name: 'Grupo para apoyo en Relaciones Personales',
    description: 'Habla sobre relaciones interpersonales, amor propio y autoestima. Un espacio para procesar emociones y crecer en tus relaciones contigo mismo y con otros.',
    category: 'general',
    createdBy: null,
    currentMembers: [],
    maxMembers: 50,
    isActive: true
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

const avatarCategoriesData = [
  {
    name: 'general',
    label: 'General',
    icon: '👤',
    color: '#2e7d32',
    description: 'Avatares generales para todos los usuarios',
    order: 1,
    isActive: true
  },
  {
    name: 'profesional',
    label: 'Profesional',
    icon: '💼',
    color: '#1976d2',
    description: 'Avatares para entornos profesionales',
    order: 2,
    isActive: true
  },
  {
    name: 'estudiante',
    label: 'Estudiante',
    icon: '🎓',
    color: '#388e3c',
    description: 'Avatares para estudiantes y académicos',
    order: 3,
    isActive: true
  },
  {
    name: 'familiar',
    label: 'Familiar',
    icon: '👨‍👩‍👧‍👦',
    color: '#f57c00',
    description: 'Avatares para contextos familiares',
    order: 4,
    isActive: true
  },
  {
    name: 'deportivo',
    label: 'Deportivo',
    icon: '🏃‍♂️',
    color: '#7b1fa2',
    description: 'Avatares para entusiastas del deporte',
    order: 5,
    isActive: true
  }
];

const categoriesData = {
  exercises: [
    { id: 'all', label: 'Todos', icon: '🧘' },
    { id: 'diary', label: 'Diario', icon: '📓' },
    { id: 'physical', label: 'Físico', icon: '🏃‍♂️' },
    { id: 'cognitive', label: 'Cognitivo', icon: '🧠' }
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
    await ChatGroup.deleteMany({});
    await AvatarCategory.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert avatar categories
    const avatarCategories = await AvatarCategory.insertMany(avatarCategoriesData);
    console.log(`✅ Inserted ${avatarCategories.length} avatar categories`);

    // Insert exercises
    const exercises = await Exercise.insertMany(exercisesData);
    console.log(`✅ Inserted ${exercises.length} exercises`);

    // Insert tips
    const tips = await Tip.insertMany(tipsData);
    console.log(`✅ Inserted ${tips.length} tips`);

    // Create a default admin user for chat groups if it doesn't exist
    let defaultUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@mentesana.com' });
    if (!defaultUser) {
      defaultUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'admin',
        email: 'admin@mentesana.com',
        firstName: 'Admin',
        lastName: 'Agora',
        role: 'admin',
        questionnaireCompleted: true,
        preferences: { language: 'es', theme: 'light', notifications: true },
        progressTracking: { streakDays: 0, lastActivity: new Date() }
      };
      await mongoose.connection.db.collection('users').insertOne(defaultUser);
      console.log('✅ Created default admin user for chat groups');
    }

    // Update chat groups with createdBy
    const chatGroupsWithCreator = chatGroupsData.map(group => ({
      ...group,
      createdBy: defaultUser._id
    }));

    // Insert chat groups
    const chatGroups = await ChatGroup.insertMany(chatGroupsWithCreator);
    console.log(`✅ Inserted ${chatGroups.length} chat groups`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Avatar Categories: ${avatarCategories.length}`);
    console.log(`   Exercises: ${exercises.length}`);
    console.log(`   Tips: ${tips.length}`);
    console.log(`   Chat Groups: ${chatGroups.length}`);
    console.log('\n🎬 All exercises and tips now have video URLs!');
    console.log('👤 Avatar categories are ready for profile customization!');
    console.log('👥 Chat groups are ready for community support!');
    console.log('   🌟 8 amazing support groups created!');
    console.log('   🎨 5 avatar categories created!');

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

module.exports = { seedDatabase, exercisesData, tipsData, chatGroupsData, categoriesData, avatarCategoriesData };