class UserNotFoundException(Exception):
    def __init__(self, message="User not found"):
        self.message = message
        super().__init__(self.message)

class InvalidUserFormatException(Exception):
    def __init__(self, message="Invalid user format"):
        self.message = message
        super().__init__(self.message)