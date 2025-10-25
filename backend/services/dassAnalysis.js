// DASS-21 Analysis Service - Migrated from Python to Node.js
// This service handles the psychological assessment calculations

// DASS-21 subscale item mappings (0-indexed)
const DASS_DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16, 20];  // Questions 3,5,10,13,16,17,21
const DASS_ANXIETY_ITEMS = [1, 3, 6, 8, 14, 18, 19];      // Questions 2,4,7,9,15,19,20
const DASS_STRESS_ITEMS = [0, 5, 7, 10, 11, 13, 17];      // Questions 1,6,8,11,12,14,18

/**
 * Calculate score for a DASS subscale
 * @param {Object} responses - User responses object
 * @param {Array} subscaleItems - Array of item indices for the subscale
 * @returns {number} Calculated score
 */
function calculateDassScore(responses, subscaleItems) {
  let score = 0;
  subscaleItems.forEach(item => {
    const key = item.toString();
    if (responses[key] !== undefined) {
      score += responses[key];
    }
  });
  return score;
}

/**
 * Determine severity level based on score and subscale
 * @param {number} score - Calculated score
 * @param {string} subscale - 'depression', 'anxiety', or 'stress'
 * @returns {string} Severity level
 */
function getSeverityLevel(score, subscale) {
  switch (subscale) {
    case 'depression':
      if (score <= 9) return 'normal';
      if (score <= 13) return 'mild';
      if (score <= 20) return 'moderate';
      if (score <= 27) return 'severe';
      return 'extremely_severe';

    case 'anxiety':
      if (score <= 7) return 'normal';
      if (score <= 9) return 'mild';
      if (score <= 14) return 'moderate';
      if (score <= 19) return 'severe';
      return 'extremely_severe';

    case 'stress':
      if (score <= 14) return 'normal';
      if (score <= 18) return 'mild';
      if (score <= 25) return 'moderate';
      if (score <= 33) return 'severe';
      return 'extremely_severe';

    default:
      return 'normal';
  }
}

/**
 * Generate personalized recommendations based on scores and severity levels
 * @param {Object} scores - Object with depression, anxiety, stress scores
 * @param {Object} severityLevels - Object with severity levels
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations(scores, severityLevels) {
  const recommendations = [];

  // Depression recommendations
  if (severityLevels.depression === 'moderate' ||
      severityLevels.depression === 'severe' ||
      severityLevels.depression === 'extremely_severe') {
    recommendations.push({
      type: 'exercise',
      title: 'Respiración mindful para depresión',
      description: 'Ejercicio de respiración para reducir síntomas depresivos',
      resourceId: 'breathing_depression',
      priority: 'high'
    });
    recommendations.push({
      type: 'group_chat',
      title: 'Grupo de apoyo para depresión',
      description: 'Conecta con otros que enfrentan síntomas similares',
      resourceId: 'depression_support_group',
      priority: 'high'
    });
  }

  // Anxiety recommendations
  if (severityLevels.anxiety === 'moderate' ||
      severityLevels.anxiety === 'severe' ||
      severityLevels.anxiety === 'extremely_severe') {
    recommendations.push({
      type: 'exercise',
      title: 'Relajación muscular para ansiedad',
      description: 'Técnicas para reducir la ansiedad física',
      resourceId: 'muscle_relaxation',
      priority: 'high'
    });
    recommendations.push({
      type: 'tip',
      title: 'Consejos para manejar ataques de pánico',
      description: 'Estrategias prácticas para momentos de alta ansiedad',
      resourceId: 'panic_management_tips',
      priority: 'high'
    });
  }

  // Stress recommendations
  if (severityLevels.stress === 'moderate' ||
      severityLevels.stress === 'severe' ||
      severityLevels.stress === 'extremely_severe') {
    recommendations.push({
      type: 'exercise',
      title: 'Meditación guiada para el estrés',
      description: 'Sesión de 10 minutos para reducir el estrés diario',
      resourceId: 'stress_meditation',
      priority: 'high'
    });
    recommendations.push({
      type: 'tip',
      title: 'Hábitos para reducir el estrés',
      description: 'Cambios diarios para mejorar el manejo del estrés',
      resourceId: 'stress_reduction_habits',
      priority: 'medium'
    });
  }

  // General recommendations for all users
  const maxScore = Math.max(scores.depression, scores.anxiety, scores.stress);
  if (maxScore <= 21) { // If no severe symptoms
    recommendations.push({
      type: 'exercise',
      title: 'Rutina diaria de bienestar',
      description: 'Ejercicios diarios para mantener la salud mental',
      resourceId: 'daily_wellness',
      priority: 'medium'
    });
  }

  // Professional help for severe cases
  if (severityLevels.depression === 'severe' || severityLevels.depression === 'extremely_severe' ||
      severityLevels.anxiety === 'severe' || severityLevels.anxiety === 'extremely_severe' ||
      severityLevels.stress === 'severe' || severityLevels.stress === 'extremely_severe') {
    recommendations.push({
      type: 'professional_help',
      title: 'Buscar ayuda profesional',
      description: 'Considera consultar con un especialista en salud mental',
      resourceId: 'professional_help',
      priority: 'high'
    });
  }

  // Limit to 5 recommendations max
  return recommendations.slice(0, 5);
}

/**
 * Main analysis function - equivalent to Python service
 * @param {Object} data - Request data with responses and userId
 * @returns {Object} Analysis results
 */
function analyzeQuestionnaire(data) {
  const startTime = Date.now();

  const { responses, userId } = data;

  // Validate input
  if (!responses || typeof responses !== 'object') {
    throw new Error('Invalid responses data');
  }

  if (Object.keys(responses).length !== 21) {
    throw new Error('Must provide exactly 21 responses');
  }

  // Validate each response
  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value !== 'number' || value < 0 || value > 3) {
      throw new Error(`Invalid response for question ${key}: must be 0-3`);
    }
  });

  // Calculate scores
  const depressionScore = calculateDassScore(responses, DASS_DEPRESSION_ITEMS);
  const anxietyScore = calculateDassScore(responses, DASS_ANXIETY_ITEMS);
  const stressScore = calculateDassScore(responses, DASS_STRESS_ITEMS);
  const totalScore = depressionScore + anxietyScore + stressScore;

  const scores = {
    depression: depressionScore,
    anxiety: anxietyScore,
    stress: stressScore,
    total: totalScore
  };

  // Determine severity levels
  const severityLevels = {
    depression: getSeverityLevel(depressionScore, 'depression'),
    anxiety: getSeverityLevel(anxietyScore, 'anxiety'),
    stress: getSeverityLevel(stressScore, 'stress')
  };

  // Generate recommendations
  const recommendations = generateRecommendations(scores, severityLevels);

  const processingTime = Date.now() - startTime;

  return {
    scores,
    severityLevels,
    recommendations,
    processingTime,
    algorithmVersion: 'DASS-21-v1.0-node',
    analyzedAt: new Date().toISOString(),
    userId: userId || 'anonymous'
  };
}

module.exports = {
  analyzeQuestionnaire,
  calculateDassScore,
  getSeverityLevel,
  generateRecommendations
};