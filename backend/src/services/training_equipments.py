from models.models import TrainingEquipment
from exceptions.TrainingEquipmentsExecption import TrainingEquipmenteNotFoundException

class TrainingEquipmentServices:
    @staticmethod
    def get_equipments_by_ids(ids):
        equipments = TrainingEquipment.query.filter(TrainingEquipment.id.in_(ids)).all()
        if len(equipments) != len(ids):
            raise TrainingEquipmenteNotFoundException(f'At least one id is invalid')
        return equipments