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
  "Tengo conciencia de la sequedad de mi boca",
  "No puedo experimentar ningún sentimiento positivo",
  "Experimento dificultad para respirar (ej. respiración excesivamente rápida, falta de aliento sin esfuerzo físico)",
  "Me resulta difícil iniciar las cosas",
  "Tiende a reaccionar de manera exagerada ante las situaciones",
  "Experimento temblor (ej. en las manos)",
  "Siento que estoy usando mucha energía nerviosa",
  "Me preocupo por situaciones en las que podría entrar en pánico y hacer el ridículo",
  "Siento que no tengo nada que esperar con ilusión",
  "Me encuentro poniéndome agitado",
  "Me resulta difícil relajarme",
  "Me siento abatido y triste",
  "Soy intolerante con cualquier cosa que me impida continuar con lo que estoy haciendo",
  "Siento que estoy cerca del pánico",
  "Soy incapaz de entusiasmarme por cualquier cosa",
  "Siento que no valgo mucho como persona",
  "Siento que soy bastante irritable",
  "Tengo conciencia de la acción de mi corazón sin esfuerzo físico (ej. sensación de aumento del ritmo cardíaco, corazón perdiendo un latido)",
  "Me siento asustado sin ninguna buena razón",
  "Siento que la vida no tiene sentido"
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
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { responses } = req.body;
    const userId = req.user._id;

    // Validate that we have responses for all DASS-21 questions
    const questionCount = Object.keys(responses).length;
    if (questionCount !== 21) {
      return res.status(400).json({
        error: 'Invalid questionnaire',
        message: `Expected 21 responses, received ${questionCount}`
      });
    }

    // Allow multiple submissions - users can retake the questionnaire
    // No time restrictions for retaking

    // Analyze questionnaire using local DASS service (migrated from Python)
    const analysisResult = analyzeQuestionnaire({
      responses,
      userId: userId.toString()
    });

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

    await questionnaireResult.save();

    // Update user's questionnaire results array
    await User.findByIdAndUpdate(userId, {
      $push: { questionnaireResults: questionnaireResult._id }
    });

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
  try {
    const results = await QuestionnaireResult.find({
      userId: req.user._id,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .select('-responses'); // Don't send raw responses back

    res.json({
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Results fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
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