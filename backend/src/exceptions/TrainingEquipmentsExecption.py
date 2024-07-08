class TrainingEquipmenteNotFoundException(Exception):
    def __init__(self, message="Equipment not found"):
        self.message = message
        super().__init__(self.message)