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