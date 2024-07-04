from flask import Blueprint, jsonify, request
from services.exercise import ExerciseService
from exceptions.TrainingEquipmentsExecption import TrainingEquipmenteNotFoundException
from exceptions.ExercisesExceptions import ExerciseNotFoundException, InvalidExerciseFormatException

exercise_routes = Blueprint('exercise_routes', __name__)

@exercise_routes.route('/exercises', methods=['GET'])
def list_all_exercises():
    '''List all excercises'''
    try:
        exercises = ExerciseService.get_all_exercise() #TODO agregar paginacion
        return jsonify(exercises), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@exercise_routes.route('/exercises/<int:exercise_id>', methods=['GET'])
def get_exercise_by_id(exercise_id):
    '''Get exercise by ID'''
    try:
        exercise = ExerciseService.get_exercise_by_id(exercise_id)
        return jsonify(exercise), 200

    except ExerciseNotFoundException as e:
            jsonify({'error': e.message}), 404
    except Exception as e:
            return jsonify({'error': str(e)}), 500
    
@exercise_routes.route('/exercises', methods=['POST'])
def create_exercise():
    '''Create a new exercise'''
    try:
        data = request.get_json()
        user_id = data['user_id'] #TODO esto deberia ir en el header
        exercise = ExerciseService.create_exercise(user_id, data)
        return jsonify(exercise), 201
    except InvalidExerciseFormatException as e: #TODO agregarle los demas tipos de excepcion
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500