from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# Tabla intermedia para la relación muchos a muchos entre TrainingEquipment y Exercise
training_equipment_exercises = db.Table('training_equipment_exercises',
    db.Model.metadata,
    db.Column('training_equipment_id', db.BigInteger, db.ForeignKey('training_equipments.id'), primary_key=True),
    db.Column('exercise_id', db.BigInteger, db.ForeignKey('exercises.id'), primary_key=True)
)

# Tabla intermedia para la relación muchos a muchos entre User y Routine (favoritos)
users_fav_routines = db.Table('users_fav_routines',
    db.Model.metadata,
    db.Column('routine_id', db.BigInteger, db.ForeignKey('routines.id'), primary_key=True),
    db.Column('user_id', db.BigInteger, db.ForeignKey('users.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    # Relaciones
    exercises = relationship('Exercise', backref='owner', lazy=True)
    created_routines = relationship('Routine', backref='creator', lazy=True)
    fav_routines = relationship('Routine', secondary=users_fav_routines, back_populates='favorited_by', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password
        }

class Exercise(db.Model):
    __tablename__ = 'exercises'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=True)
    calories = db.Column(db.Integer, nullable=True)
    extra_data = db.Column(db.String(255), nullable=True)
    muscles = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    
    # Relaciones
    detailed_exercises = relationship('DetailedExerciseForRoutine', backref='exercise', lazy=True)
    training_equipments = relationship('TrainingEquipment', secondary=training_equipment_exercises, backref='exercises', lazy=True)

class Routine(db.Model):
    __tablename__ = 'routines'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=True)
    expected_time = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    
    # Relaciones
    detailed_exercises = relationship('DetailedExerciseForRoutine', backref='routine', lazy=True)
    favorited_by = relationship('User', secondary=users_fav_routines, back_populates='fav_routines', lazy=True)

class DetailedExerciseForRoutine(db.Model):
    __tablename__ = 'detailed_exercise_for_routines'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    exercise_id = db.Column(db.BigInteger, db.ForeignKey('exercises.id'), nullable=False)
    routine_id = db.Column(db.BigInteger, db.ForeignKey('routines.id'), nullable=False)
    repetitions = db.Column(db.Integer, nullable=True)
    weight = db.Column(db.DECIMAL(5, 2), nullable=True)
    series = db.Column(db.Integer, nullable=True)
    tips = db.Column(db.String(255), nullable=True)

class TrainingEquipment(db.Model):
    __tablename__ = 'training_equipments'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=True)
    
    # Relaciones
    exercises = relationship('Exercise', secondary=training_equipment_exercises, backref='training_equipments', lazy=True)