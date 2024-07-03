from flask import Blueprint, jsonify, request
from services.user import UserService

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
def list_all_users():
    '''List all users'''

    users = UserService.get_all_users()
    return jsonify(users)

@user_routes.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    new_user = UserService.register_user(name, email, password)
    return jsonify(new_user), 201

@user_routes.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = UserService.login_user(email, password)
    if user:
        return jsonify(user), 200
    return jsonify({'message': 'Email o contraseña incorrectas'})
