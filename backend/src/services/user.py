from models.models import User
from exceptions.UsersExceptions import UserNotFoundException, InvalidUserFormatException
from models.models import db

class UserService:
    @staticmethod
    def get_all_users():
        users = User.query.all()
        return [user.to_dict() for user in users]
    
    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.get(user_id)
        if not user:
            raise UserNotFoundException(f'User with id {user_id} not found')
        return user.to_dict()
    
    @staticmethod
    def create_user(data):
        if 'name' not in data or 'password' not in data:
            raise InvalidUserFormatException('Missing name, email or password')
        
        if 'email' in data:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                raise InvalidUserFormatException('Email already exists')
            
        user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'] #TODO generate_password_hash(data['password'])
        )

        db.session.add(user)

    def register_user(name, email, password):
        user = User(name=name, email=email, password=password)
        db.session.add()

    def update_user(user_id, data):
        user = User.query.get(user_id)
        if not user:
            raise UserNotFoundException()
        if 'email' in data:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                raise InvalidUserFormatException('Email already exists')
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = data['password'] #TODO generate_password_hash(data['password'])
        db.session.commit()
        return user.to_dict()