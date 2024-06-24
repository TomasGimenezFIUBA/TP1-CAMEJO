from models.models import User


class UserService:
    @staticmethod
    def get_all_users():
        users = User.query.all()
        return [user.to_dict() for user in users]