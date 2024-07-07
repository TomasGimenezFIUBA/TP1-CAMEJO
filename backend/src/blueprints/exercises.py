from flask import Blueprint, jsonify, request
from services.exercise import ExerciseService
from exceptions.TrainingEquipmentsExecption import TrainingEquipmenteNotFoundException
from exceptions.ExercisesExceptions import ExerciseNotFoundException, InvalidExerciseFormatException

exercise_routes = Blueprint('exercise_routes', __name__)

@exercise_routes.route('/exercises', methods=['GET']) #! Funciona
def list_all_exercises():
    '''List all excercises'''
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    try:
        exercises = ExerciseService.get_all_exercises(page=page, per_page=per_page)
        return jsonify(exercises), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@exercise_routes.route('/exercises/<int:exercise_id>', methods=['GET']) #! Funciona 
def get_exercise_by_id(exercise_id):
    '''Get exercise by ID'''
    try:
        exercise = ExerciseService.get_exercise_by_id(exercise_id)
        return jsonify(exercise), 200

    except ExerciseNotFoundException as e:
            jsonify({'error': e.message}), 404
    except Exception as e:
            return jsonify({'error': str(e)}), 500
    
@exercise_routes.route('/exercises/notuser/<int:user_id>', methods=['GET']) #! Funciona
def get_notuser_exercises(user_id):
    '''Get all exercises except from ID'''
    try:
        exercise = ExerciseService.get_notuser_exercises(user_id)
        return jsonify(exercise), 200
    except ExerciseNotFoundException as e:
        return jsonify({'error': str(e)}), 404

@exercise_routes.route('/exercises', methods=['POST']) #! Funciona
def create_exercise():
    '''Create a new exercise'''

    if 'file' not in request.files: #TODO agregarlo a otro lado asi no repito codigo
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        data = request.get_json()
        user_id = data['user_id'] #TODO esto deberia ir en el header
        exercise = ExerciseService.create_exercise(user_id, data, file)
        return jsonify(exercise), 201
    except InvalidExerciseFormatException as e: #TODO agregarle los demas tipos de excepcion
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@exercise_routes.route('/exercises/<int:exercise_id>', methods=['PUT']) #! Funciona
def update_exercise(exercise_id):
    '''Update an existing exercise'''
    
    file = request.files['file']
    
    try:
        data = request.get_json()
        user_id = data['user_id']  # Extraer el user_id del JSON del request
        exercise = ExerciseService.update_exercise(exercise_id, user_id, data, file)
        return jsonify(exercise), 200  # Código 200 para indicar éxito
    except InvalidExerciseFormatException as e:  # Manejo de excepciones específicas
        return jsonify({'error': str(e)}), 400
    except TrainingEquipmenteNotFoundException as e:  # Manejo de excepciones específicas
        return jsonify({'error': str(e)}), 404
    except ExerciseNotFoundException as e:  # Manejo de excepciones específicas
        return jsonify({'error': str(e)}), 404
    except Exception as e:  # Manejo de cualquier otra excepción
        return jsonify({'error': str(e)}), 500


@exercise_routes.route('/exercises/<int:exercise_id>', methods=['DELETE']) #! Funciona a partir del ejercicio 4
def delete_exercise(exercise_id):
    '''Delete a exercise'''
    try:
        result = ExerciseService.delete_exercise(exercise_id)
        if result:
            return jsonify({'message': 'Exercise deleted'}), 200
        else:
            return jsonify({'error': 'Exercise not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500 