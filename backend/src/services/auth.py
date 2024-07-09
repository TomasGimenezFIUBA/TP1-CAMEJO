from exceptions.AuthException import AuthException
from models.models import User

class AuthService: 
    @staticmethod
    def login(data):
        if 'email' not in data or 'password' not in data:
            raise AuthException('Missing email or password')
        
        user = User.query.filter_by(email=data['email']).first()
        if not user or user.password != (data['password']):
            raise AuthException('Invalid email or password')
        
        response = {
            'user_id': user.id,
            'name': user.name,
            'email': user.email
        }
        return response