from flask import Blueprint, jsonify, request

from services.user import UserService
from exceptions.UsersExceptions import UserNotFoundException, InvalidUserFormatException

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
def list_all_users():
    '''List all users'''
    try:
        users = UserService.get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_routes.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    '''Get user by ID'''
    try:
        user = UserService.get_user_by_id(user_id)
        return jsonify(user), 200
    
    except UserNotFoundException as e:
        jsonify({'error': e.message}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_routes.route('/users', methods=['POST'])
def create_user():
    '''Create a new user'''
    try:
        data = request.get_json()
        user = UserService.create_user(data)
        return jsonify(user), 201
    except InvalidUserFormatException as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_routes.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    '''Update an existing user'''
    try:
        data = request.get_json()
        user = UserService.update_user(user_id, data)
        return jsonify(user), 200
    except UserNotFoundException as e:
        return jsonify({'error': e.message}), 404
    except InvalidUserFormatException as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

'''
 @user_routes.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    ''Delete a user''
    try:
        result = UserService.delete_user(user_id)
        if result:
            return jsonify({'message': 'User deleted'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
        '''