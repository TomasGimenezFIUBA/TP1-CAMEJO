import os

from flask import Flask, request, jsonify

from models.models import db
from blueprints.users import user_routes
from config import config
from services.image import ImageService

# Determinar el entorno (development, production, testing)
env_name = os.getenv('FLASK_ENV', 'development')

app = Flask(__name__)

# Cargar configuración según el entorno
app.config.from_object(config[env_name])

app.register_blueprint(user_routes, url_prefix='/api/v1')

@app.route("/")
def hello():
    return "Hello world"

@app.route("/upload-image", methods=['POST'])
def upload_image(): #curl -X POST -F 'file=@./frontend/public/logo.png' http://localhost:8002/upload-image
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file.content_length > MAX_CONTENT_LENGTH:
        return jsonify({"error": "File is too big"}), 400

    ImageService.upload_image(file)
    return jsonify({"message": "Image uploaded"})

@app.route("/delete-image/<filename>", methods=['DELETE'])
def delete_image(filename):
    ImageService.delete_image(filename)
    print('Image deleted')
    return jsonify({"message": "Image deleted"})

@app.route("/get-image/<filename>", methods=['GET'])
def get_image(filename):
    return ImageService.get_image(filename)

@app.route("/get-all-images", methods=['GET'])
def get_all_images():
    return ImageService.get_all_images()

if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=app.config['PORT'])
