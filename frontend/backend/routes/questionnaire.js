const express = require('express');
const { body, validationResult } = require('express-validator');
const QuestionnaireResult = require('../models/QuestionnaireResult');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { analyzeQuestionnaire } = require('../services/dassAnalysis');

const router = express.Router();

// DASS-21 questionnaire structure (simplified for this example)
const DASS_QUESTIONS = [
  "I found it hard to wind down",
  "I was aware of dryness of my mouth",
  "I couldn't seem to experience any positive feeling at all",
  "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
  "I found it difficult to work up the initiative to do things",
  "I tended to over-react to situations",
  "I experienced trembling (e.g., in the hands)",
  "I felt that I was using a lot of nervous energy",
  "I was worried about situations in which I might panic and make a fool of myself",
  "I felt that I had nothing to look forward to",
  "I found myself getting agitated",
  "I found it difficult to relax",
  "I felt down-hearted and blue",
  "I was intolerant of anything that kept me from getting on with what I was doing",
  "I felt I was close to panic",
  "I was unable to become enthusiastic about anything",
  "I felt I wasn't worth much as a person",
  "I felt that I was rather touchy",
  "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)",
  "I felt scared without any good reason",
  "I felt that life was meaningless"
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

    // Check if user has already submitted a questionnaire recently (within 24 hours)
    const recentSubmission = await QuestionnaireResult.findOne({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentSubmission) {
      return res.status(429).json({
        error: 'Too many submissions',
        message: 'You can only submit the questionnaire once every 24 hours'
      });
    }

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
    instructions: "Please read each statement and select a number 0, 1, 2 or 3 that indicates how much the statement applied to you over the past week. There are no right or wrong answers. Do not spend too much time on any statement.",
    scale: {
      0: "Did not apply to me at all",
      1: "Applied to me to some degree, or some of the time",
      2: "Applied to me to a considerable degree, or a good part of time",
      3: "Applied to me very much, or most of the time"
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