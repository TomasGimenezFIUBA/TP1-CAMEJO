class ImagesExceptions(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

class FileFormatException(ImagesExceptions):
    def __init__(self, message='Invalid extension'):
        self.message = message
        super().__init__(self.message)