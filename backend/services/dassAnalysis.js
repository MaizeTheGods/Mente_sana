// DASS-21 Analysis Service - Migrated from Python to Node.js
// This service handles the psychological assessment calculations

// DASS-21 subscale item mappings (0-indexed) - adjusted for 20 questions
const DASS_DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16];  // Questions 3,5,10,13,16,17 (removed 21st)
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
 * @returns {Array} Array of recommendation objects (max 3)
 */
function generateRecommendations(scores, severityLevels) {
  const recommendations = [];

  // Generate one recommendation per disorder based on severity level
  const disorders = [
    { name: 'depression', displayName: 'Depresión', score: scores.depression },
    { name: 'anxiety', displayName: 'Ansiedad', score: scores.anxiety },
    { name: 'stress', displayName: 'Estrés', score: scores.stress }
  ];

  disorders.forEach(disorder => {
    const severity = severityLevels[disorder.name];
    let recommendation;

    switch (severity) {
      case 'normal':
        recommendation = {
          type: 'exercise',
          title: `Mantén tu bienestar - ${disorder.displayName}`,
          description: `Ejercicios preventivos para mantener una buena salud mental en ${disorder.displayName.toLowerCase()}`,
          resourceId: `${disorder.name}_maintenance`,
          priority: 'low'
        };
        break;

      case 'mild':
        recommendation = {
          type: 'tip',
          title: `Consejos para ${disorder.displayName} leve`,
          description: `Estrategias prácticas para manejar síntomas leves de ${disorder.displayName.toLowerCase()}`,
          resourceId: `${disorder.name}_mild_tips`,
          priority: 'low'
        };
        break;

      case 'moderate':
        recommendation = {
          type: 'exercise',
          title: `Ejercicio para ${disorder.displayName} moderada`,
          description: `Técnicas específicas para reducir síntomas moderados de ${disorder.displayName.toLowerCase()}`,
          resourceId: `${disorder.name}_moderate_exercise`,
          priority: 'medium'
        };
        break;

      case 'severe':
        recommendation = {
          type: 'group_chat',
          title: `Apoyo para ${disorder.displayName} severa`,
          description: `Conecta con profesionales y comunidad para ${disorder.displayName.toLowerCase()} severa`,
          resourceId: `${disorder.name}_severe_support`,
          priority: 'high'
        };
        break;

      case 'extremely_severe':
        recommendation = {
          type: 'professional_help',
          title: `Ayuda profesional para ${disorder.displayName}`,
          description: `Busca atención especializada inmediata para ${disorder.displayName.toLowerCase()} extremadamente severa`,
          resourceId: `${disorder.name}_extreme_help`,
          priority: 'high'
        };
        break;
    }

    if (recommendation) {
      recommendations.push(recommendation);
    }
  });

  // Sort by priority (high -> medium -> low)
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  // Return top 3 recommendations
  return recommendations.slice(0, 3);
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

  if (Object.keys(responses).length !== 20) {
    throw new Error('Must provide exactly 20 responses');
  }

  // Validate each response
  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value !== 'number' || value < 0 || value > 3) {
      throw new Error(`Invalid response for question ${key}: must be 0-3`);
    }
  });

  // Calculate scores (multiply by 2 for DASS-21 interpretation)
  const depressionScore = calculateDassScore(responses, DASS_DEPRESSION_ITEMS) * 2;
  const anxietyScore = calculateDassScore(responses, DASS_ANXIETY_ITEMS) * 2;
  const stressScore = calculateDassScore(responses, DASS_STRESS_ITEMS) * 2;
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