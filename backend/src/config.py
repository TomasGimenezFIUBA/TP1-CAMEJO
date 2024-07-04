import os

from dotenv import load_dotenv

env_name = os.getenv('FLASK_ENV', 'development')
env_file = f"env/.env.{env_name}"
load_dotenv(env_file)

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False
    TESTING = False
    MINIO_URL = os.getenv('MINIO_URL')
    MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
    MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
    MINIO_SECURE = False
    BUCKET_NAME = os.getenv('BUCKET_NAME')

class LocalConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')+''
    DEBUG = True
    PORT=os.getenv('API_PORT')

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')+''
    DEBUG = True
    PORT=os.getenv('API_PORT')

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://root:intro@db:5432/gym' # Cambiar
    DEBUG = False

class TestingConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:' # Cambiar
    TESTING = True

config = {
    'local': LocalConfig,
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}