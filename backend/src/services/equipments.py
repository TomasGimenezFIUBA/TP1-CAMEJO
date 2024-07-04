from models.models import TrainingEquipment

class EquipmentsService:
    @staticmethod
    def get_equipments_by_ids(user_id):
        equipments = Equi.query.get(user_id)
        if not equipments:
            raise EquipmentsNotFoundException(f'User with id {user_id} not found')
        return equipments.to_dict()