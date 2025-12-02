const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const Tip = require('../models/Tip');
const ChatGroup = require('../models/ChatGroup');
const AvatarCategory = require('../models/AvatarCategory');

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

const chatGroupsData = [
  {
    name: '🌟 Ansiedad y Preocupaciones',
    description: 'Comparte tus experiencias con la ansiedad, aprende técnicas de manejo y encuentra apoyo en personas que entienden lo que vives. Un espacio seguro para hablar abiertamente.',
    type: 'peer_support',
    disorderCategory: 'anxiety',
    createdBy: null, // Will be set to a default admin user
    currentMembers: [],
    rules: [
      { rule: 'Sé respetuoso con las experiencias de los demás', priority: 'high' },
      { rule: 'Mantén la confidencialidad de lo compartido', priority: 'high' },
      { rule: 'No des consejos médicos profesionales', priority: 'medium' }
    ]
  },
  {
    name: '💙 Apoyo en Depresión',
    description: 'Conecta con personas que han pasado por depresión. Comparte tus sentimientos, recibe apoyo emocional y descubre que no estás solo en este camino.',
    type: 'peer_support',
    disorderCategory: 'depression',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Comparte tus sentimientos sin juzgar a otros', priority: 'high' },
      { rule: 'Recuerda que la recuperación es posible', priority: 'medium' },
      { rule: 'Ofrece apoyo, no soluciones médicas', priority: 'medium' }
    ]
  },
  {
    name: '😌 Manejo del Estrés',
    description: 'Aprende a manejar el estrés diario, comparte técnicas que funcionan y encuentra apoyo en momentos difíciles. Un oasis de calma en tu rutina.',
    type: 'peer_support',
    disorderCategory: 'stress',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Comparte técnicas que te han funcionado', priority: 'medium' },
      { rule: 'Respeta los límites de los demás', priority: 'high' },
      { rule: 'Mantén un tono positivo y de apoyo', priority: 'medium' }
    ]
  },
  {
    name: '🌈 Jóvenes en Transición',
    description: 'Para jóvenes adultos (18-35 años) enfrentando cambios de vida, presión laboral, relaciones y crecimiento personal. Comparte tus desafíos y encuentra comprensión.',
    type: 'general',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Este espacio es para jóvenes adultos (18-35 años)', priority: 'medium' },
      { rule: 'Sé empático con las experiencias de transición', priority: 'high' },
      { rule: 'Comparte recursos útiles para jóvenes', priority: 'low' }
    ]
  },
  {
    name: '💪 Camino a la Recuperación',
    description: 'Para quienes están en proceso de recuperación. Comparte tus victorias, pide consejos y motiva a otros. Cada paso cuenta, ¡estamos orgullosos de ti!',
    type: 'peer_support',
    disorderCategory: 'general',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Celebra los pequeños logros', priority: 'high' },
      { rule: 'Ofrece esperanza y motivación', priority: 'medium' },
      { rule: 'Comparte estrategias de afrontamiento', priority: 'medium' }
    ]
  },
  {
    name: '👨‍👩‍👧‍👦 Familiares y Cuidadores',
    description: 'Apoyo para familiares y cuidadores. Comparte experiencias, obtén consejos sobre cómo apoyar a tus seres queridos y cuida de tu propio bienestar.',
    type: 'general',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Respeta la privacidad de tus seres queridos', priority: 'high' },
      { rule: 'Comparte consejos prácticos de cuidado', priority: 'medium' },
      { rule: 'Recuerda cuidar también de tu bienestar', priority: 'high' }
    ]
  },
  {
    name: '🧘 Mindfulness y Meditación',
    description: 'Comparte experiencias con meditación, mindfulness y prácticas de atención plena. Aprende nuevas técnicas y encuentra motivación para mantener tu práctica.',
    type: 'general',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Comparte técnicas que has probado', priority: 'medium' },
      { rule: 'Sé paciente con principiantes', priority: 'medium' },
      { rule: 'Mantén el enfoque en experiencias personales', priority: 'low' }
    ]
  },
  {
    name: '❤️ Relaciones y Amor Propio',
    description: 'Habla sobre relaciones interpersonales, amor propio y autoestima. Un espacio para procesar emociones y crecer en tus relaciones contigo mismo y con otros.',
    type: 'general',
    createdBy: null,
    currentMembers: [],
    rules: [
      { rule: 'Practica la compasión hacia ti mismo', priority: 'high' },
      { rule: 'Comparte experiencias de crecimiento personal', priority: 'medium' },
      { rule: 'Mantén un ambiente de apoyo y respeto', priority: 'high' }
    ]
  }
];

const tipsData = [
  // 🌿 CATEGORÍA: ESTILO DE VIDA (7 consejos)
  {
    title: 'Cómo dormir mejor',
    content: 'Hábitos simples para descansar profundamente y recuperar energía.',
    why: 'El sueño reparador es fundamental para la salud mental y el rendimiento diario.',
    category: 'lifestyle',
    media: {
      videoUrl: 'vkQQCclKzxo'
    }
  },
  {
    title: 'Maneja tu estrés del día a día',
    content: 'Técnicas rápidas para calmar tu mente en momentos tensos.',
    why: 'El manejo efectivo del estrés previene problemas de salud mental a largo plazo.',
    category: 'lifestyle',
    media: {
      videoUrl: 'doZeCiT5Rh8'
    }
  },
  {
    title: 'Mañanas sin ansiedad',
    content: 'Comienza tu día con una rutina que te dé calma y claridad.',
    why: 'Un buen inicio de día establece el tono emocional para toda la jornada.',
    category: 'lifestyle',
    media: {
      videoUrl: 'AWjI0mBpIIo'
    }
  },
  {
    title: 'Cómo tener un día más equilibrado',
    content: 'Aprende a organizar tus actividades sin sentirte abrumado(a).',
    why: 'El equilibrio diario reduce el estrés y mejora la calidad de vida.',
    category: 'lifestyle',
    media: {
      videoUrl: 'S6CmxoIkHd4'
    }
  },
  {
    title: 'Dormir mejor después de clases',
    content: 'Guía rápida para soltar tensión y descansar tras tareas y exámenes.',
    why: 'El descanso adecuado después del estudio mejora la retención y reduce la ansiedad.',
    category: 'lifestyle',
    media: {
      videoUrl: 'cvflhGzINJ4'
    }
  },
  {
    title: 'Recupera tu energía emocional',
    content: 'Mini consejos para evitar agotamiento mental.',
    why: 'La recuperación emocional es esencial para mantener el bienestar mental.',
    category: 'lifestyle',
    media: {
      videoUrl: 'yKNd9FJDVis'
    }
  },
  {
    title: 'Construye una vida más saludable',
    content: 'Cambios pequeños que mejoran tu bienestar a largo plazo.',
    why: 'Los hábitos saludables construyen resiliencia emocional y física.',
    category: 'lifestyle',
    media: {
      videoUrl: '7Ep5mKuRmAA'
    }
  },

  // ❤️ CATEGORÍA: RELACIONES (7 consejos)
  {
    title: 'Superar el rechazo',
    content: 'Aprende a manejar el dolor emocional y fortalecer tu autoestima.',
    why: 'Superar el rechazo construye resiliencia emocional y autoestima saludable.',
    category: 'relationships',
    media: {
      videoUrl: 'aLu7vllKXDw'
    }
  },
  {
    title: 'Cómo expresar lo que sientes',
    content: 'Hablar con claridad reduce conflictos y mejora vínculos.',
    why: 'La expresión emocional saludable fortalece las relaciones interpersonales.',
    category: 'relationships',
    media: {
      videoUrl: '0CME0v2JqLg'
    }
  },
  {
    title: 'Poner límites sin culpa',
    content: 'Proteger tu paz también es un acto de amor propio.',
    why: 'Los límites saludables protegen tu bienestar emocional y mental.',
    category: 'relationships',
    media: {
      videoUrl: 'tYjD9oxB6Vw'
    }
  },
  {
    title: 'Detectar y alejarte de amistades tóxicas',
    content: 'Señales para identificar relaciones dañinas.',
    why: 'Identificar relaciones tóxicas protege tu salud mental y emocional.',
    category: 'relationships',
    media: {
      videoUrl: 'iO0_SsxH7iE'
    }
  },
  {
    title: 'Mejorar la comunicación con tus padres',
    content: 'Estrategias para evitar discusiones y llegar a acuerdos.',
    why: 'Una buena comunicación familiar reduce conflictos y mejora el apoyo emocional.',
    category: 'relationships',
    media: {
      videoUrl: '80UVszvdy5U'
    }
  },
  {
    title: 'Resolver conflictos sin explotar',
    content: 'Aprende a calmarte antes de reaccionar.',
    why: 'La resolución pacífica de conflictos mejora las relaciones y reduce el estrés.',
    category: 'relationships',
    media: {
      videoUrl: 'GJQjOMGEYTk'
    }
  },
  {
    title: 'Sanar una amistad rota',
    content: 'Aceptar, valorar y seguir adelante sin rencor.',
    why: 'La sanación emocional permite cerrar ciclos y abrir espacio para relaciones saludables.',
    category: 'relationships',
    media: {
      videoUrl: '3t6T2cBS0Dc'
    }
  },

  // 🧩 CATEGORÍA: ESTRATEGIAS DE AFRONTAMIENTO (7 consejos)
  {
    title: 'Deja de sobrepensar',
    content: 'Técnicas para frenar pensamientos repetitivos.',
    why: 'Controlar el sobrepensar reduce la ansiedad y mejora la claridad mental.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'OMoRh6bqSHo'
    }
  },
  {
    title: 'Qué hacer en una crisis emocional',
    content: 'Pasos para recuperar control en momentos difíciles.',
    why: 'Tener un plan para crisis emocionales proporciona seguridad y control.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'wfDTp2GogaQ'
    }
  },
  {
    title: 'Manejo de ansiedad escolar',
    content: 'Ideas para reducir presión académica.',
    why: 'Manejar la ansiedad escolar mejora el rendimiento y el bienestar estudiantil.',
    category: 'coping_strategy',
    media: {
      videoUrl: '7i9x1McMz1M'
    }
  },
  {
    title: 'Control de pensamientos negativos',
    content: 'Cambia el diálogo interior por uno más sano.',
    why: 'Los pensamientos negativos afectan el estado de ánimo y la autoestima.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'm4tYDhTQ3aI'
    }
  },
  {
    title: 'Haz una pausa antes de saturarte',
    content: 'Detenerte a tiempo puede evitar ansiedad acumulada.',
    why: 'Las pausas preventivas evitan el agotamiento emocional y mental.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'w_bmCKMrLYs'
    }
  },
  {
    title: 'Qué hacer cuando el estrés te supera',
    content: 'Movimiento + respiración para calmar tu sistema nervioso.',
    why: 'Técnicas físicas ayudan a regular el sistema nervioso autónomo.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'UaYZgPE97Xc'
    }
  },
  {
    title: 'Sé más resiliente',
    content: 'Aprende a levantar la mente ante retos y fracasos.',
    why: 'La resiliencia emocional es clave para afrontar desafíos de la vida.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'AWjI0mBpIIo'
    }
  },

  // 🌱 CATEGORÍA: AUTOCUIDADO (7 consejos)
  {
    title: 'Rutina simple de autocuidado',
    content: 'Acciones pequeñas para sentirte mejor cada día.',
    why: 'El autocuidado diario construye bienestar emocional sostenible.',
    category: 'self_care',
    media: {
      videoUrl: 'h_xI6WJ7R1w'
    }
  },
  {
    title: 'Cuida tu salud digital',
    content: 'Reduce el impacto emocional del uso excesivo del celular.',
    why: 'La desconexión digital mejora el sueño y reduce la ansiedad.',
    category: 'self_care',
    media: {
      videoUrl: 'rMmH0kG0mR4'
    }
  },
  {
    title: 'Pequeños hábitos que levantan tu ánimo',
    content: 'Ajustes diarios para mejorar tu estado emocional.',
    why: 'Los hábitos positivos crean cambios significativos en el estado de ánimo.',
    category: 'self_care',
    media: {
      videoUrl: 'pHoojJHW5mg'
    }
  },
  {
    title: 'Cómo reconectar contigo',
    content: 'Aprende a escucharte cuando te sientes desconectado.',
    why: 'La reconexión consigo mismo mejora la toma de decisiones y el bienestar.',
    category: 'self_care',
    media: {
      videoUrl: '5KEs7zJ2fQo'
    }
  },
  {
    title: 'Descanso mental intencional',
    content: 'Dale un respiro a tu mente sin sentir culpa.',
    why: 'El descanso mental es tan importante como el físico para la salud mental.',
    category: 'self_care',
    media: {
      videoUrl: 'UEYhxPUwC9E'
    }
  },
  {
    title: 'Journaling para liberar emociones',
    content: 'Escribir lo que sientes ayuda a ordenar tu vida interior.',
    why: 'El journaling facilita el procesamiento emocional y reduce el estrés.',
    category: 'self_care',
    media: {
      videoUrl: 'gTOc2qLT4n0'
    }
  },
  {
    title: 'Cómo cuidar tu energía emocional',
    content: 'Aprende a no entregarte más de lo que puedes dar.',
    why: 'Gestionar la energía emocional previene el agotamiento y mejora las relaciones.',
    category: 'self_care',
    media: {
      videoUrl: 'YjJQzNtAUB8'
    }
  },

  // ⚠️ CATEGORÍA: HÁBITOS DAÑINOS (7 consejos)
  {
    title: 'Cómo dejar de compararte en redes',
    content: 'Evita que Instagram/TikTok afecten tu autoestima.',
    why: 'La comparación social en redes sociales aumenta la ansiedad y depresión.',
    category: 'daily_habit',
    media: {
      videoUrl: '3FkjwMTHyS0'
    }
  },
  {
    title: 'Adiós al autosabotaje',
    content: 'Deja de ponerte trabas sin darte cuenta.',
    why: 'Identificar y eliminar el autosabotaje mejora el éxito personal.',
    category: 'daily_habit',
    media: {
      videoUrl: '1fFh7W3zQCY'
    }
  },
  {
    title: 'Rompe el ciclo de procrastinación',
    content: 'Técnicas rápidas para dejar de posponer todo.',
    why: 'La procrastinación crónica aumenta el estrés y reduce la productividad.',
    category: 'daily_habit',
    media: {
      videoUrl: 'cJx5rQCZAL8'
    }
  },
  {
    title: 'Dejar la dependencia emocional',
    content: 'Aprende a no basar tu bienestar en otra persona.',
    why: 'La independencia emocional fortalece la autoestima y las relaciones saludables.',
    category: 'daily_habit',
    media: {
      videoUrl: 'Kk31B7xW06g'
    }
  },
  {
    title: 'Controlar impulsos y reacciones fuertes',
    content: 'Estrategias para no perder el control.',
    why: 'Controlar impulsos mejora las relaciones y reduce conflictos.',
    category: 'daily_habit',
    media: {
      videoUrl: '_fKxJgEDzJE'
    }
  },
  {
    title: 'Dejar hábitos que dañan tu mente',
    content: 'Identifica conductas que te hacen daño sin darte cuenta.',
    why: 'Eliminar hábitos dañinos mejora significativamente la salud mental.',
    category: 'daily_habit',
    media: {
      videoUrl: 'q7HUPoH7JDs'
    }
  },
  {
    title: 'Cómo romper ciclos tóxicos personales',
    content: 'Aprende a identificar patrones y cambiar.',
    why: 'Romper ciclos tóxicos libera energía para crecimiento personal.',
    category: 'daily_habit',
    media: {
      videoUrl: 'd2QcozHnXMQ'
    }
  },

  // 💼 CATEGORÍA: VIDA ESTUDIANTIL (7 consejos)
  {
    title: 'Cómo organizar tus tareas sin estrés',
    content: 'Distribuye tu tiempo para evitar ansiedad académica.',
    why: 'La organización efectiva reduce el estrés académico y mejora el rendimiento.',
    category: 'student_life',
    media: {
      videoUrl: 'V1O2B8-Fvpo'
    }
  },
  {
    title: 'Técnicas de estudio sin presión',
    content: 'Aprende a estudiar sin sentir que te ahogas.',
    why: 'Las técnicas de estudio efectivas mejoran la retención y reducen la ansiedad.',
    category: 'student_life',
    media: {
      videoUrl: '8Yz1tCyt0bk'
    }
  },
  {
    title: 'Cómo mejorar tu concentración',
    content: 'Tips para mantener tu mente enfocada.',
    why: 'La concentración mejorada aumenta la productividad y reduce la frustración.',
    category: 'student_life',
    media: {
      videoUrl: 'dHxuVvTNfhA'
    }
  },
  {
    title: 'Maneja el estrés por exámenes',
    content: 'Lo que necesitas para evitar crisis antes de un examen.',
    why: 'Manejar el estrés pre-examen mejora el rendimiento y la salud mental.',
    category: 'student_life',
    media: {
      videoUrl: 'AWoXo5a9j_g'
    }
  },
  {
    title: 'Cómo equilibrar escuela y descanso',
    content: 'Aprende a no saturarte y respetar tus tiempos.',
    why: 'El equilibrio entre estudio y descanso previene el burnout académico.',
    category: 'student_life',
    media: {
      videoUrl: 'mXAAlEaVtGY'
    }
  },
  {
    title: 'Evita el burnout académico',
    content: 'Señales de alerta y cómo prevenir agotamiento extremo.',
    why: 'Prevenir el burnout académico mantiene la motivación y el rendimiento.',
    category: 'student_life',
    media: {
      videoUrl: '5E6qtjlD2Bw'
    }
  },
  {
    title: 'Tips para mejorar tus hábitos de estudio',
    content: 'Pequeños cambios que hacen una gran diferencia.',
    why: 'Los buenos hábitos de estudio mejoran el aprendizaje y reducen el estrés.',
    category: 'student_life',
    media: {
      videoUrl: 'WHWZ2p5Xh8E'
    }
  },

  // 🌀 CATEGORÍA: TODOS (7 consejos globales)
  {
    title: 'Respira para calmar tu mente',
    content: 'Todo empieza con un minuto de respiración consciente.',
    why: 'La respiración consciente es la base de todas las técnicas de manejo del estrés.',
    category: 'daily_habit',
    media: {
      videoUrl: 'wfDTp2GogaQ'
    }
  },
  {
    title: 'Cómo superar días difíciles',
    content: 'Consejos para recuperar tu estabilidad emocional.',
    why: 'Tener herramientas para días difíciles aumenta la resiliencia emocional.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'UaYZgPE97Xc'
    }
  },
  {
    title: 'Evita el autosabotaje diario',
    content: 'Tú puedes ser tu mejor aliado, no tu enemigo.',
    why: 'Eliminar el autosabotaje libera potencial y mejora la autoestima.',
    category: 'self_care',
    media: {
      videoUrl: '1fFh7W3zQCY'
    }
  },
  {
    title: 'Expresa lo que sientes sin miedo',
    content: 'Hablar ayuda más de lo que imaginas.',
    why: 'La expresión emocional saludable mejora las relaciones y el bienestar.',
    category: 'relationships',
    media: {
      videoUrl: '0CME0v2JqLg'
    }
  },
  {
    title: 'Reconecta contigo mismo',
    content: 'Cuando te sientes perdido, respira y vuelve a ti.',
    why: 'La reconexión personal es fundamental para el bienestar mental.',
    category: 'lifestyle',
    media: {
      videoUrl: '5KEs7zJ2fQo'
    }
  },
  {
    title: 'Superar el rechazo',
    content: 'Tu valor no depende de lo que otros opinen.',
    why: 'Superar el rechazo construye autoestima y resiliencia.',
    category: 'relationships',
    media: {
      videoUrl: 'aLu7vllKXDw'
    }
  },
  {
    title: 'Construye resiliencia día a día',
    content: 'Aprende a levantarte incluso cuando no tienes fuerzas.',
    why: 'La resiliencia es la clave para afrontar los desafíos de la vida.',
    category: 'coping_strategy',
    media: {
      videoUrl: 'AWjI0mBpIIo'
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
    { id: 'student_life', label: 'Vida Estudiantil', icon: '📚' },
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