from flask import Blueprint, jsonify, request
from services.user import UserService

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
def list_all_users():
    '''List all users'''

    users = UserService.get_all_users()
    return jsonify(users)