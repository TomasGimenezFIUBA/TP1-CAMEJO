from models.models import Exercise, db
from services.user import UserService
from services.training_equipments import TrainingEquipmentServices
from services.image import ImageService

from exceptions.TrainingEquipmentsExecption import TrainingEquipmenteNotFoundException
from exceptions.UsersExceptions import UserNotFoundException
from exceptions.ExercisesExceptions import ExerciseNotFoundException, InvalidExerciseFormatException

class ExerciseService:
    available_muscles = ["bicep", 'tricep', 'shoulders', 'chest'] #atributo muscles="bicep;chest;"

    @staticmethod
    def get_all_exercises(page, per_page):
        exercises = Exercise.query.paginate(page=page, per_page=per_page)
        try:
            for exercise in exercises.items:
                exercise.url = ImageService.get_presigned_url(exercise.url)
        except Exception as e:
            print(e)
        return [exercise.to_dict() for exercise in exercises]
    
    @staticmethod
    def get_exercise_by_id(exercise_id):
        exercise = Exercise.query.get(exercise_id)
        exercise.url = ImageService.get_presigned_url(exercise.url)
        if not exercise:
            raise ExerciseNotFoundException(f'User with id {exercise_id} not found')
        return exercise.to_dict()

    @staticmethod
    def create_exercise(user_id, data, file):
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
        
        url = ImageService.upload_image(file)
        
        exercise = Exercise(
            name=data['name'],
            description=data['description'],
            url=url,
            calories=int(data['calories']),
            extra_data=data['extra_data'],
            muscles = exercise_muscles,
            user_id = user_id,
            equipments = training_equipments
        )
        
        try :
            db.session.add(exercise)
            db.session.commit()
        except Exception as e:
            ImageService.delete_image(url)
            raise e
        
        return exercise.to_dict()
    
    @staticmethod
    def update_exercise(exercise_id, user_id, data, file):
        if 'name' not in data or 'description' not in data or not user_id or 'muscles' not in data or 'equipments' not in data: #? ¿Esta verificación es necesaria?
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
        exercise = Exercise.query.get(exercise_id)
        if not exercise:
            raise ExerciseNotFoundException(f'Exercise with id {exercise_id} not found')
        

        url = data['url']

        if file:
            url = ImageService.upload_image(file)
        
        exercise.name = data['name']
        exercise.description = data['description']
        exercise.url = url
        exercise.calories = int(data['calories'])
        exercise.extra_data = data['extra_data']
        exercise.muscles = exercise_muscles
        exercise.user_id = user_id
        exercise.equipments = training_equipments   #? ¿Esto se termina modificando?

        try :
            db.session.commit()
            ImageService.delete_image(data['url'])
        except Exception as e:
            ImageService.delete_image(url)
            raise e
        
        return exercise.to_dict()
    
    @staticmethod
    def delete_exercise(exercise_id): #! ???
        exercise = Exercise.query.filter_by(id=exercise_id).first()
        
        if not exercise:
            raise ExerciseNotFoundException()

        db.session.delete(exercise)    #? ¿Esto necesita estar dentro de un else? 
        db.session.commit()         
        return exercise.to_dict()
    
    @staticmethod 
    def get_notuser_exercises(user_id): 

        exercises = Exercise.query.filter(Exercise.user_id != user_id).all()
        if not exercises:
            raise ExerciseNotFoundException(f'Exercises without that id does not exists')
        
        return [exercise.to_dict() for exercise in exercises]