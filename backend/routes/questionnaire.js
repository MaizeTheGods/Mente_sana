const express = require('express');
const { body, validationResult } = require('express-validator');
const QuestionnaireResult = require('../models/QuestionnaireResult');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { analyzeQuestionnaire } = require('../services/dassAnalysis');

const router = express.Router();

// DASS-21 questionnaire structure in Spanish (corrected translations)
const DASS_QUESTIONS = [
  "Me resulta difícil relajarme",
  "Noté la sequedad en mi boca",
  "Pareciera que no puedo experimentar ningún sentimiento positivo",
  "Tuve dificultades al respirar (por ej.: respiración excesivamente rápida, dificultad para respirar sin ningún esfuerzo físico)",
  "Me resultó difícil tener iniciativa para hacer cosas",
  "Tendía a reaccionar en exceso ante las situaciones",
  "Tuve temblores (por ej.: en las manos)",
  "Sentí que estaba usando mucha energía nerviosa",
  "Estuve preocupado por situaciones en las que podría entrar en pánico y parecer un tonto",
  "Sentí que no tenía nada que esperar",
  "Me encontré agitado",
  "Tuve dificultades para relajarme",
  "Me sentí abatido y triste",
  "No toleraba nada que me impidiera continuar con lo que estaba haciendo",
  "Sentí que estaba cerca del pánico",
  "No pude entusiasmarme con nada",
  "Sentí que no valía mucho como persona",
  "Sentí que estaba bastante susceptible",
  "Fui consciente del trabajo de mi corazón en ausencia de esfuerzo físico (por ej.: sensación de aumento de la frecuencia cardíaca, falta de latido del corazón)",
  "Sentí miedo sin ninguna razón",
  "Sentí que la vida no valía nada"
];

// Validation for questionnaire submission
const questionnaireValidation = [
  body('responses').isObject().withMessage('Responses must be an object'),
  body('responses.*').isInt({ min: 0, max: 3 }).withMessage('Each response must be between 0 and 3')
];

// @route   POST /api/questionnaire/submit
// @desc    Submit questionnaire responses and get analysis
// @access  Private
router.post('/submit', authenticateToken, questionnaireValidation, async (req, res) => {
  try {
    console.log('Questionnaire submission request received');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user._id);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { responses } = req.body;
    const userId = req.user._id;

    console.log('Responses received:', responses);

    // Validate that we have responses for all DASS-21 questions
    const questionCount = Object.keys(responses).length;
    console.log('Question count:', questionCount);
    if (questionCount !== 21) {
      console.log('Invalid question count');
      return res.status(400).json({
        error: 'Invalid questionnaire',
        message: `Expected 21 responses, received ${questionCount}`
      });
    }

    // Allow multiple submissions - users can retake the questionnaire
    // No time restrictions for retaking

    console.log('Analyzing questionnaire...');
    // Analyze questionnaire using local DASS service (migrated from Python)
    const analysisResult = analyzeQuestionnaire({
      responses,
      userId: userId.toString()
    });
    console.log('Analysis result:', analysisResult);

    console.log('Creating questionnaire result document...');
    // Create questionnaire result document
    const questionnaireResult = new QuestionnaireResult({
      userId,
      questionnaireType: 'DASS-21',
      responses,
      scores: analysisResult.scores,
      severityLevels: analysisResult.severityLevels,
      recommendations: analysisResult.recommendations,
      analysisMetadata: {
        processedBy: 'python-service',
        processingTime: analysisResult.processingTime,
        algorithmVersion: analysisResult.algorithmVersion
      }
    });

    console.log('Saving questionnaire result...');
    await questionnaireResult.save();
    console.log('Questionnaire result saved with ID:', questionnaireResult._id);

    console.log('Updating user with questionnaire result...');
    // Update user's questionnaire results array and increment count
    // Set questionnaireCompleted to true on first completion
    const userUpdate = {
      $push: { questionnaireResults: questionnaireResult._id },
      $inc: { questionnaireCount: 1 }
    };

    // Check if this is the first questionnaire completion
    const user = await User.findById(userId);
    if (!user.questionnaireCompleted) {
      userUpdate.$set = { questionnaireCompleted: true };
    }

    await User.findByIdAndUpdate(userId, userUpdate);
    console.log('User updated successfully');

    // Return the analysis result
    res.status(201).json({
      message: 'Questionnaire submitted and analyzed successfully',
      resultId: questionnaireResult._id,
      scores: analysisResult.scores,
      severityLevels: analysisResult.severityLevels,
      recommendations: analysisResult.recommendations,
      createdAt: questionnaireResult.createdAt
    });

  } catch (error) {
    console.error('Questionnaire submission error:', error);
    console.error('Error details:', error.stack);

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
      return res.status(503).json({
        error: 'Database temporarily unavailable',
        message: 'Please try again in a few moments'
      });
    }

    res.status(500).json({
      error: 'Submission failed',
      message: error.message || 'An error occurred while processing your questionnaire'
    });
  }
});

// @route   GET /api/questionnaire/questions
// @desc    Get questionnaire questions
// @access  Public
router.get('/questions', (req, res) => {
  res.json({
    questionnaireType: 'DASS-21',
    questions: DASS_QUESTIONS,
    instructions: "Por favor lee cada declaración y selecciona un número 0, 1, 2 o 3 que indique cuánto se aplicó la declaración a ti durante la semana pasada. No hay respuestas correctas o incorrectas. No pases demasiado tiempo en cada declaración.",
    scale: {
      0: "No se aplicó a mí en absoluto",
      1: "Se aplicó a mí en cierto grado, o parte del tiempo",
      2: "Se aplicó a mí en un grado considerable, o buena parte del tiempo",
      3: "Se aplicó a mí mucho, o la mayor parte del tiempo"
    }
  });
});

// @route   GET /api/questionnaire/results
// @desc    Get user's questionnaire results
// @access  Private
router.get('/results', authenticateToken, async (req, res) => {
  const requestId = `QUESTIONNAIRE_RESULTS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`📊 [${requestId}] QUESTIONNAIRE ROUTE - Get results request by user:`, req.user._id);

    console.log(`📊 [${requestId}] QUESTIONNAIRE ROUTE - Fetching questionnaire results from database...`);

    const results = await QuestionnaireResult.find({
      userId: req.user._id,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .select('-responses'); // Don't send raw responses back

    console.log(`📊 [${requestId}] QUESTIONNAIRE ROUTE - Found ${results.length} questionnaire results`);

    res.json({
      results,
      count: results.length
    });

  } catch (error) {
    console.error(`📊 [${requestId}] QUESTIONNAIRE ROUTE - ❌ Results fetch error:`, error);

    // Don't crash server - return error response with fallback
    res.status(500).json({
      error: 'Failed to fetch results',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      results: [],
      count: 0
    });
  }
});

// @route   GET /api/questionnaire/results/:id
// @desc    Get specific questionnaire result
// @access  Private
router.get('/results/:id', authenticateToken, async (req, res) => {
  try {
    const result = await QuestionnaireResult.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({ result });
  } catch (error) {
    console.error('Result fetch error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid result ID' });
    }
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

module.exports = router;