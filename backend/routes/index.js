const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { seedDatabase } = require('../scripts/seedData');

// Seed database endpoint (for development/admin use)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Seeding database via API endpoint...');
    await seedDatabase();
    res.json({
      success: true,
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Safe seed endpoint (adds data without deleting existing)
router.post('/seed-safe', async (req, res) => {
  try {
    console.log('🛡️ Safe seeding database via API endpoint...');

    const { exercisesData, tipsData, chatGroupsData, avatarCategoriesData } = require('../scripts/seedData');
    const Exercise = require('../models/Exercise');
    const Tip = require('../models/Tip');
    const ChatGroup = require('../models/ChatGroup');
    const AvatarCategory = require('../models/AvatarCategory');

    let exercisesInserted = 0, exercisesSkipped = 0;
    let tipsInserted = 0, tipsSkipped = 0;
    let chatGroupsInserted = 0, chatGroupsSkipped = 0;
    let avatarCategoriesInserted = 0, avatarCategoriesSkipped = 0;

    // Create default admin user if needed
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
      console.log('✅ Created default admin user');
    }

    // Safe insert exercises
    for (const exerciseData of exercisesData) {
      const existing = await Exercise.findOne({ title: exerciseData.title });
      if (!existing) {
        await Exercise.create(exerciseData);
        exercisesInserted++;
      } else {
        exercisesSkipped++;
      }
    }

    // Safe insert tips
    for (const tipData of tipsData) {
      const existing = await Tip.findOne({ title: tipData.title });
      if (!existing) {
        await Tip.create(tipData);
        tipsInserted++;
      } else {
        tipsSkipped++;
      }
    }

    // Safe insert chat groups
    for (const groupData of chatGroupsData) {
      const existing = await ChatGroup.findOne({ name: groupData.name });
      if (!existing) {
        await ChatGroup.create({ ...groupData, createdBy: defaultUser._id });
        chatGroupsInserted++;
      } else {
        chatGroupsSkipped++;
      }
    }

    // Safe insert avatar categories
    for (const categoryData of avatarCategoriesData) {
      const existing = await AvatarCategory.findOne({ name: categoryData.name });
      if (!existing) {
        await AvatarCategory.create(categoryData);
        avatarCategoriesInserted++;
      } else {
        avatarCategoriesSkipped++;
      }
    }

    console.log('📊 Safe seeding completed');

    res.json({
      success: true,
      message: 'Safe seeding completed successfully',
      summary: {
        exercises: { inserted: exercisesInserted, skipped: exercisesSkipped },
        tips: { inserted: tipsInserted, skipped: tipsSkipped },
        chatGroups: { inserted: chatGroupsInserted, skipped: chatGroupsSkipped },
        avatarCategories: { inserted: avatarCategoriesInserted, skipped: avatarCategoriesSkipped }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Safe seeding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to safe seed database',
      error: error.message
    });
  }
});

// Emergency exercises restore endpoint
router.post('/fix-exercises', async (req, res) => {
  try {
    console.log('🏃 Emergency exercises restore...');

    const Exercise = require('../models/Exercise');

    // Hardcoded exercises data (from original seed)
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
          { step: 7, text: 'Continúa por el tiempo establecido, terminando con una respiración profunda.', duration: 60 }
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
          { step: 5, text: 'Permite que las preocupaciones fluyan sin resistencia.', duration: 240 },
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

    let inserted = 0;
    let skipped = 0;

    // Safe insert exercises
    for (const exerciseData of exercisesData) {
      const existing = await Exercise.findOne({ title: exerciseData.title });
      if (!existing) {
        await Exercise.create(exerciseData);
        inserted++;
        console.log(`✅ Restored exercise: ${exerciseData.title}`);
      } else {
        skipped++;
        console.log(`⏭️ Exercise already exists: ${exerciseData.title}`);
      }
    }

    console.log(`📊 Exercises restore completed: ${inserted} restored, ${skipped} already existed`);

    res.json({
      success: true,
      message: `Exercises restored successfully. ${inserted} exercises added, ${skipped} already existed.`,
      inserted,
      skipped,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Exercises restore error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore exercises',
      error: error.message
    });
  }
});

// Seed tips endpoint (populate tips only - safe mode)
router.post('/seed-tips', async (req, res) => {
  try {
    console.log('📚 Seeding tips via API endpoint (safe mode)...');

    const Tip = require('../models/Tip');
    const { tipsData } = require('../scripts/seedData');

    let insertedCount = 0;
    let skippedCount = 0;

    // Insert tips one by one, skipping if title already exists
    for (const tipData of tipsData) {
      const existingTip = await Tip.findOne({ title: tipData.title });
      if (!existingTip) {
        await Tip.create(tipData);
        insertedCount++;
        console.log(`✅ Inserted tip: ${tipData.title}`);
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped existing tip: ${tipData.title}`);
      }
    }

    console.log(`📊 Summary: ${insertedCount} inserted, ${skippedCount} skipped`);

    res.json({
      success: true,
      message: `Tips seeding completed. ${insertedCount} new tips added, ${skippedCount} already existed.`,
      insertedCount,
      skippedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Seeding tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed tips',
      error: error.message
    });
  }
});

// Seed exercises endpoint (populate exercises only)
router.post('/seed-exercises', async (req, res) => {
  try {
    console.log('🏃 Seeding exercises via API endpoint...');

    const Exercise = require('../models/Exercise');
    const { exercisesData } = require('../scripts/seedData');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('🗑️ Cleared existing exercises');

    // Insert new exercises
    const exercises = await Exercise.insertMany(exercisesData);
    console.log(`✅ Inserted ${exercises.length} exercises`);

    res.json({
      success: true,
      message: `Successfully seeded ${exercises.length} exercises`,
      exercisesCount: exercises.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Seeding exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed exercises',
      error: error.message
    });
  }
});

// Health check endpoint
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agora - API Backend</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 600px;
                width: 100%;
                margin: 20px;
            }

            .logo {
                font-size: 48px;
                margin-bottom: 20px;
            }

            h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 32px;
            }

            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 18px;
            }

            .status {
                background: #d4edda;
                color: #155724;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #c3e6cb;
            }

            .endpoints {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: left;
            }

            .endpoint {
                background: white;
                padding: 10px;
                margin: 5px 0;
                border-radius: 4px;
                border: 1px solid #e9ecef;
                font-family: monospace;
                font-size: 14px;
            }

            .method {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                margin-right: 10px;
            }

            .method.get { background: #28a745; color: white; }
            .method.post { background: #007bff; color: white; }

            .footer {
                margin-top: 30px;
                color: #666;
                font-size: 14px;
            }

            .heartbeat {
                color: #28a745;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🧠</div>
            <h1>Agora</h1>
            <p class="subtitle">API Backend - Salud Mental</p>

            <div class="status">
                <strong>Estado:</strong> <span class="heartbeat">● Online</span><br>
                <strong>Timestamp:</strong> ${new Date().toLocaleString('es-ES')}<br>
                <strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}
            </div>

            <div class="endpoints">
                <h3>Endpoints Disponibles:</h3>

                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/health</strong> - Health check
                </div>

                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/auth/register</strong> - Registrar usuario
                </div>

                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/auth/login</strong> - Iniciar sesión
                </div>

                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/questionnaire/questions</strong> - Obtener preguntas DASS-21
                </div>

                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/questionnaire/submit</strong> - Enviar cuestionario
                </div>

                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/maps</strong> - Servicios de salud cercanos
                </div>

                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/seed</strong> - Poblar base de datos con datos de ejemplo
                </div>
            </div>

            <div class="footer">
                <p>🚀 Desplegado en Render | 🗄️ MongoDB Atlas | 📊 DASS-21 Analysis</p>
                <p>💡 Esta página mantiene el backend activo para evitar suspensión por inactividad</p>
            </div>
        </div>

        <script>
            // Auto-refresh every 5 minutes to keep the service alive
            setTimeout(() => {
                window.location.reload();
            }, 300000);
        </script>
    </body>
    </html>
  `);
});

module.exports = router;