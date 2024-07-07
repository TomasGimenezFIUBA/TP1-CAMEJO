from flask import Blueprint, jsonify, request

from services.training_equipments import TrainingEquipmentServices

training_equipments_routes = Blueprint('training_equipments_routes', __name__)

@training_equipments_routes.route('/training_equipments', methods=['GET'])
def list_all_exercises():
    '''List all training equipments'''
    equipments = TrainingEquipmentServices.get_all_equipments()
    return jsonify(equipments), 200

    