import os

from datetime import timedelta
from minio import Minio
from minio.error import S3Error
from werkzeug.utils import secure_filename
import hashlib

from exceptions.ImagesExceptions import ImagesExceptions
from config import config

env_name = os.getenv('FLASK_ENV', 'development') # TODO no deberia de estar aca  ya que se repite con el app.py
current_configuration = config[env_name]

class ImageService:
    minio_client = Minio(
        current_configuration.MINIO_URL.replace('http://', ''),
        access_key=current_configuration.MINIO_ACCESS_KEY,
        secret_key=current_configuration.MINIO_SECRET_KEY,
        secure=False
    )
    extension = ['png', 'jpg', 'jpeg', 'gif']
    @staticmethod
    def upload_image(file):
        MAX_CONTENT_LENGTH = 16 * 1024 * 1024
        
        if len(file.read()) > MAX_CONTENT_LENGTH:
            raise ImagesExceptions(f'File too large. Max size: {MAX_CONTENT_LENGTH} bytes')

        if file.filename.split('.')[-1] not in ImageService.extension:
            raise ImagesExceptions(f'Invalid extension {file.filename.split(".")[-1]}. Valid extensions: {ImageService.extension}')
        
        filename = secure_filename(file.filename)
        file_path = os.path.join('/tmp', filename)
        file.save(file_path)

        found = ImageService.minio_client.bucket_exists(current_configuration.BUCKET_NAME)
        if not found:
            raise S3Error('Bucket not found')
       
        hashed_name = ImageService.generate_hashed_filename(filename) + '.' + filename.split('.')[-1]
        ImageService.minio_client.fput_object(current_configuration.BUCKET_NAME, hashed_name, file_path)
        url = ImageService.minio_client.presigned_get_object(current_configuration.BUCKET_NAME, filename)
        os.remove(file_path)

        return url
    
    @staticmethod
    def delete_image(filename):
        ImageService.minio_client.remove_object(current_configuration.BUCKET_NAME, filename)
        return f'{filename} deleted'
    
    @staticmethod
    def get_image(filename):
        url = ImageService.minio_client.presigned_get_object(current_configuration.BUCKET_NAME, filename)
        return url
    
    @staticmethod
    def get_all_images():
        objects = ImageService.minio_client.list_objects(current_configuration.BUCKET_NAME)
        return [obj.object_name for obj in objects]
    
    @staticmethod
    def generate_hashed_filename(filename):
        hash_object = hashlib.sha256()
        hash_object.update(filename.encode('utf-8')) #TODO que sea random el nombre
        return hash_object.hexdigest()
    
    @staticmethod
    def get_presigned_url(filename):
        return ImageService.minio_client.presigned_get_object(current_configuration.BUCKET_NAME, filename, expires=timedelta(hours=1))