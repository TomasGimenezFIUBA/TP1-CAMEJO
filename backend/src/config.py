import os

from dotenv import load_dotenv

env_name = os.getenv('FLASK_ENV', 'development')
env_file = f"env/.env.{env_name}"
load_dotenv(env_file)

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False
    TESTING = False

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