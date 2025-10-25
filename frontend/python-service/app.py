from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from datetime import datetime
import time

app = Flask(__name__)
CORS(app)

# DASS-21 scoring logic
DASS_DEPRESSION_ITEMS = [2, 3, 4, 5, 9, 13, 15, 16, 20, 21, 23, 26, 27, 30, 33, 35, 37, 39, 41]  # 0-indexed
DASS_ANXIETY_ITEMS = [1, 6, 7, 8, 11, 13, 17, 19, 21, 23, 25, 28, 31, 33, 35, 37, 39, 41]  # 0-indexed
DASS_STRESS_ITEMS = [0, 4, 5, 9, 11, 12, 13, 16, 17, 18, 21, 23, 24, 26, 27, 29, 31, 33, 34, 37, 39]  # 0-indexed

# Wait, I need to correct this. The DASS-21 has specific items for each subscale.
# Let me use the correct mapping based on the standard DASS-21:
# Depression: 3, 5, 10, 13, 16, 17, 21
# Anxiety: 2, 4, 7, 9, 15, 19, 20
# Stress: 1, 6, 8, 11, 12, 14, 18

# Actually, let me use the correct 0-indexed positions for the 21 questions:
DASS_DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16, 20]  # Questions 3,5,10,13,16,17,21 (0-indexed: 2,4,9,12,15,16,20)
DASS_ANXIETY_ITEMS = [1, 3, 6, 8, 14, 18, 19]     # Questions 2,4,7,9,15,19,20 (0-indexed: 1,3,6,8,14,18,19)
DASS_STRESS_ITEMS = [0, 5, 7, 10, 11, 13, 17]     # Questions 1,6,8,11,12,14,18 (0-indexed: 0,5,7,10,11,13,17)

def calculate_dass_score(responses, subscale_items):
    """Calculate score for a DASS subscale"""
    score = 0
    for item in subscale_items:
        if str(item) in responses:
            score += responses[str(item)]
    return score

def get_severity_level(score, subscale):
    """Determine severity level based on score"""
    if subscale == 'depression':
        if score <= 9:
            return 'normal'
        elif score <= 13:
            return 'mild'
        elif score <= 20:
            return 'moderate'
        elif score <= 27:
            return 'severe'
        else:
            return 'extremely_severe'
    elif subscale == 'anxiety':
        if score <= 7:
            return 'normal'
        elif score <= 9:
            return 'mild'
        elif score <= 14:
            return 'moderate'
        elif score <= 19:
            return 'severe'
        else:
            return 'extremely_severe'
    elif subscale == 'stress':
        if score <= 14:
            return 'normal'
        elif score <= 18:
            return 'mild'
        elif score <= 25:
            return 'moderate'
        elif score <= 33:
            return 'severe'
        else:
            return 'extremely_severe'

def generate_recommendations(scores, severity_levels):
    """Generate personalized recommendations based on scores"""
    recommendations = []

    # Depression recommendations
    if severity_levels['depression'] in ['moderate', 'severe', 'extremely_severe']:
        recommendations.append({
            'type': 'exercise',
            'title': 'Respiración mindful',
            'description': 'Ejercicio de respiración para reducir síntomas depresivos',
            'resourceId': 'breathing_depression',
            'priority': 'high'
        })
        recommendations.append({
            'type': 'group_chat',
            'title': 'Grupo de apoyo para depresión',
            'description': 'Conecta con otros que enfrentan síntomas similares',
            'resourceId': 'depression_support_group',
            'priority': 'high'
        })

    # Anxiety recommendations
    if severity_levels['anxiety'] in ['moderate', 'severe', 'extremely_severe']:
        recommendations.append({
            'type': 'exercise',
            'title': 'Ejercicio de relajación muscular',
            'description': 'Técnicas para reducir la ansiedad física',
            'resourceId': 'muscle_relaxation',
            'priority': 'high'
        })
        recommendations.append({
            'type': 'tip',
            'title': 'Consejos para manejar ataques de pánico',
            'description': 'Estrategias prácticas para momentos de alta ansiedad',
            'resourceId': 'panic_management_tips',
            'priority': 'high'
        })

    # Stress recommendations
    if severity_levels['stress'] in ['moderate', 'severe', 'extremely_severe']:
        recommendations.append({
            'type': 'exercise',
            'title': 'Meditación guiada para el estrés',
            'description': 'Sesión de 10 minutos para reducir el estrés diario',
            'resourceId': 'stress_meditation',
            'priority': 'high'
        })
        recommendations.append({
            'type': 'tip',
            'title': 'Hábitos para reducir el estrés',
            'description': 'Cambios diarios para mejorar el manejo del estrés',
            'resourceId': 'stress_reduction_habits',
            'priority': 'medium'
        })

    # General recommendations for all users
    if max(scores.values()) <= 21:  # If no severe symptoms
        recommendations.append({
            'type': 'exercise',
            'title': 'Rutina diaria de bienestar',
            'description': 'Ejercicios diarios para mantener la salud mental',
            'resourceId': 'daily_wellness',
            'priority': 'medium'
        })

    # Always include professional help for severe cases
    if any(level in ['severe', 'extremely_severe'] for level in severity_levels.values()):
        recommendations.append({
            'type': 'professional_help',
            'title': 'Buscar ayuda profesional',
            'description': 'Considera consultar con un especialista en salud mental',
            'resourceId': 'professional_help',
            'priority': 'high'
        })

    return recommendations[:5]  # Limit to 5 recommendations

@app.route('/analyze', methods=['POST'])
def analyze_questionnaire():
    try:
        start_time = time.time()

        data = request.get_json()

        if not data or 'responses' not in data:
            return jsonify({'error': 'Missing responses data'}), 400

        responses = data['responses']
        user_id = data.get('userId', 'anonymous')

        # Validate responses
        if not isinstance(responses, dict):
            return jsonify({'error': 'Responses must be an object'}), 400

        if len(responses) != 21:
            return jsonify({'error': 'Must provide exactly 21 responses'}), 400

        # Validate each response is 0-3
        for key, value in responses.items():
            if not isinstance(value, int) or value < 0 or value > 3:
                return jsonify({'error': f'Invalid response for question {key}: must be 0-3'}), 400

        # Calculate scores
        depression_score = calculate_dass_score(responses, DASS_DEPRESSION_ITEMS)
        anxiety_score = calculate_dass_score(responses, DASS_ANXIETY_ITEMS)
        stress_score = calculate_dass_score(responses, DASS_STRESS_ITEMS)
        total_score = depression_score + anxiety_score + stress_score

        scores = {
            'depression': depression_score,
            'anxiety': anxiety_score,
            'stress': stress_score,
            'total': total_score
        }

        # Determine severity levels
        severity_levels = {
            'depression': get_severity_level(depression_score, 'depression'),
            'anxiety': get_severity_level(anxiety_score, 'anxiety'),
            'stress': get_severity_level(stress_score, 'stress')
        }

        # Generate recommendations
        recommendations = generate_recommendations(scores, severity_levels)

        processing_time = int((time.time() - start_time) * 1000)  # in milliseconds

        result = {
            'scores': scores,
            'severityLevels': severity_levels,
            'recommendations': recommendations,
            'processingTime': processing_time,
            'algorithmVersion': 'DASS-21-v1.0',
            'analyzedAt': datetime.utcnow().isoformat(),
            'userId': user_id
        }

        return jsonify(result), 200

    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return jsonify({'error': 'Analysis failed', 'message': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'python-analysis-service',
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)