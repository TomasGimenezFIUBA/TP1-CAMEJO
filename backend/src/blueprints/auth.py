from flask import Blueprint, jsonify, request, make_response

from exceptions.AuthException import AuthException
from services.auth import AuthService

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/auth/login', methods=['POST'])
def login():
    '''login'''
    try:
        data = request.get_json()
        response = AuthService.login(data)
        resp = make_response(jsonify(response), 200)
        resp.set_cookie('user_id', str(response['user_id']), max_age=60*60*24)
        return resp
    except AuthException as e:
        return jsonify({'error': e.message}), 403
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

    