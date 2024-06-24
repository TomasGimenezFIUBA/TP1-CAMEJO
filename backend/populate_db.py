import os
from flask import Flask

from src.models.models import DetailedExerciseForRoutine, Exercise, Routine, TrainingEquipment, User, db
from src.config import config

#from app.models import db, User, Exercise, Routine, DetailedExerciseForRoutine, TrainingEquipment
env_name = os.getenv('FLASK_ENV', 'development')

def create_app():
    app = Flask(__name__)
    app.config.from_object(config[env_name])

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app

def initialize_db():
    app = create_app()
    with app.app_context():
        db.create_all()

        # Crear datos de ejemplo para TrainingEquipment
        equipment_names = ['Bar', 'Dumbbells', 'Mat', 'Discs', 'Incline Bench', 'Pull-up Bar']
        equipments = [TrainingEquipment(name=name) for name in equipment_names]

        # Crear usuarios de ejemplo
        users = [
            User(name='Alice Johnson', email='alice@example.com', password='password123'),
            User(name='Bob Smith', email='bob@example.com', password='password123'),
            User(name='Charlie Brown', email='charlie@example.com', password='password123'),
            User(name='Diana Prince', email='diana@example.com', password='password123'),
            User(name='Eve Adams', email='eve@example.com', password='password123'),
            User(name='Frank White', email='frank@example.com', password='password123')
        ]

        # Crear ejercicios de ejemplo y asignar equipos
        exercises = [
            Exercise(name='Push Up', description='Push up exercise', user_id=1),
            Exercise(name='Squat', description='Squat exercise', user_id=1),
            Exercise(name='Deadlift', description='Deadlift exercise', user_id=2),
            Exercise(name='Bench Press', description='Bench press exercise', user_id=2),
            Exercise(name='Pull Up', description='Pull up exercise', user_id=3),
            Exercise(name='Bicep Curl', description='Bicep curl exercise', user_id=3)
        ]

        # Asignar equipos a ejercicios
        exercises[0].equipments.append(equipments[0])  # Push Up -> Barra
        exercises[1].equipments.append(equipments[1])  # Squat -> Mancuernas
        exercises[2].equipments.append(equipments[3])  # Deadlift -> Discos
        exercises[3].equipments.append(equipments[4])  # Bench Press -> Banco Inclinado
        exercises[4].equipments.append(equipments[5])  # Pull Up -> Barra de Dominadas
        exercises[5].equipments.append(equipments[1])  # Bicep Curl -> Mancuernas

        # Crear rutinas de ejemplo y asignar ejercicios
        routines = [
            Routine(title='Full Body Routine', description='A full body workout routine', user_id=1),
            Routine(title='Upper Body Routine', description='An upper body workout routine', user_id=1),
            Routine(title='Leg Day Routine', description='A leg day workout routine', user_id=2),
            Routine(title='Strength Routine', description='A strength building routine', user_id=2)
        ]

        detailed_exercises = [
            DetailedExerciseForRoutine(exercise_id=1, routine_id=1, repetitions=10, weight=0, series=3),
            DetailedExerciseForRoutine(exercise_id=2, routine_id=1, repetitions=12, weight=0, series=3),
            DetailedExerciseForRoutine(exercise_id=3, routine_id=2, repetitions=8, weight=50, series=4),
            DetailedExerciseForRoutine(exercise_id=4, routine_id=2, repetitions=8, weight=70, series=4)
        ]

        # Asignar rutinas favoritas a los usuarios
        users[0].fav_routines.append(routines[0])
        users[0].fav_routines.append(routines[1])
        users[1].fav_routines.append(routines[2])
        users[1].fav_routines.append(routines[3])

        # Añadir objetos a la sesión
        db.session.add_all(equipments)
        db.session.add_all(users)
        db.session.add_all(exercises)
        db.session.add_all(routines)
        db.session.add_all(detailed_exercises)

        # Confirmar la sesión
        db.session.commit()

if __name__ == '__main__':
    initialize_db()