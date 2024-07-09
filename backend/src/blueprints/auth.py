from flask import Blueprint, jsonify, request

from exceptions.AuthException import AuthException
from services.auth import AuthService

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/auth/login', methods=['POST'])
def login():
    '''login'''
    try:
        data = request.get_json()
        response = AuthService.login(data)
        return jsonify(response), 200
    except AuthException as e:
        return jsonify({'error': e.message}), 403
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    