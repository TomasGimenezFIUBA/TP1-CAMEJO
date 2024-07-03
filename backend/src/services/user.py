from models.models import User

class UserService:
    @staticmethod
    def get_all_users():
        users = User.query.all()
        return [user.to_dict() for user in users]
    
    @staticmethod
    def register_user(name, email, password):
        user = User(name=name, email=email, password=password)
        db.session.add()
        db.session.commit()
        return user.to_dict()
    
    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if user and user.password == password:
            return user.to_dict()
        return None
