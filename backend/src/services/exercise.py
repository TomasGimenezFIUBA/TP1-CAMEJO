from models.models import Exercise, db
from services.user import UserService
from services.training_equipments import TrainingEquipmentServices

from exceptions.TrainingEquipmentsExecption import TrainingEquipmenteNotFoundException
from exceptions.UsersExceptions import UserNotFoundException
from exceptions.ExercisesExceptions import ExerciseNotFoundException, InvalidExerciseFormatException

class ExerciseService:
    available_muscles = ["bicep", 'tricep', 'shoulders', 'chest'] #atributo muscles="bicep;chest;"

    @staticmethod
    def get_all_exercise():
        exercises = Exercise.query.all()
        return [exercise.to_dict() for exercise in exercises]
    
    @staticmethod
    def get_exercise_by_id(exercise_id):
        exercise = Exercise.query.get(exercise_id)
        if not exercise:
            raise ExerciseNotFoundException(f'User with id {exercise_id} not found')
        return exercise.to_dict()

    @staticmethod
    def create_exercise(user_id, data):
        if 'name' not in data or 'description' not in data or not user_id or 'muscles' not in data or 'equipments' not in data:
            raise InvalidExerciseFormatException(f'Required information is missing')
        
        exercise_muscles = data['muscles'].split(';')
        if not all(elem in ExerciseService.available_muscles for elem in exercise_muscles):
            raise InvalidExerciseFormatException(f'Muscles must be {ExerciseService.available_muscles}')

        
        user = UserService.get_user_by_id(user_id)
        if not user:
            raise UserNotFoundException(f'User with id does not exists')

        training_equipments = TrainingEquipmentServices.get_equipments_by_ids(data['equipments'])
        if not training_equipments:
            raise TrainingEquipmenteNotFoundException('At least one id is invalid')
        
        exercise = Exercise(
            name=data['name'],
            description=data['description'],
            url=data['url'],
            calories=int(data['calories']),
            extra_data=data['extra_data'],
            muscles = exercise_muscles,
            user_id = user_id,
            equipments = training_equipments
        )

        db.session.add(exercise)
        db.session.commit()
        return exercise.to_dict()
