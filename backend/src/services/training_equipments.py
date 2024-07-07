from models.models import TrainingEquipment
from exceptions.TrainingEquipmentsExecption import TrainingEquipmenteNotFoundException
from services.image import ImageService

class TrainingEquipmentServices:
    @staticmethod
    def get_equipments_by_ids(ids):
        equipments = TrainingEquipment.query.filter(TrainingEquipment.id.in_(ids)).all()
        if len(equipments) != len(ids):
            raise TrainingEquipmenteNotFoundException(f'At least one id is invalid')
        return equipments

    @staticmethod
    def get_all_equipments():
        equipments = TrainingEquipment.query.all()
        for equipment in equipments:
            equipment.url = ImageService.get_presigned_url(equipment.url)

        return [equipment.to_dict() for equipment in equipments]