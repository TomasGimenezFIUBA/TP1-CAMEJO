class ExerciseNotFoundException(Exception):
    def __init__(self, message="Excercise not found"):
        self.message = message
        super().__init__(self.message)

class InvalidExerciseFormatException(Exception):
    def __init__(self, message="Invalid exercise format"):
        self.message = message
        super().__init__(self.message)