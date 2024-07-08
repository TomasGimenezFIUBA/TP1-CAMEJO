from flask_sqlalchemy import SQLAlchemy

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
    exercises = db.relationship('Exercise', backref='owner', lazy=True)
    created_routines = db.relationship('Routine', backref='creator', lazy=True)
    fav_routines = db.relationship('Routine', secondary=users_fav_routines, lazy=True)

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
    detailed_exercises = db.relationship('DetailedExerciseForRoutine', backref='exercise', lazy=True)
    equipments = db.relationship('TrainingEquipment', secondary=training_equipment_exercises, lazy=True)

    def to_dict(self):
        return {
            'name': self.name,
            'description': self.description,
            'url': self.url,
            'calories': self.calories,
            'extra_data': self.extra_data,
            'muscles': self.muscles.split(';') if self.muscles else [],
            'id': self.id,
            'user_id': self.user_id,
            'equipments': [equipment.to_dict() for equipment in self.equipments]
        }

class Routine(db.Model):
    __tablename__ = 'routines'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=True)
    expected_time = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    
    # Relaciones
    detailed_exercises = db.relationship('DetailedExerciseForRoutine', backref='routine', lazy=True)

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

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
        }

    # No se necesita la relación inversa