import os

from flask import Flask

from models.models import db
from blueprints.users import user_routes
from blueprints.exercises import exercise_routes
from config import config

# Determinar el entorno (development, production, testing)
env_name = os.getenv('FLASK_ENV', 'development')

app = Flask(__name__)

# Cargar configuración según el entorno
app.config.from_object(config[env_name])

app.register_blueprint(user_routes, url_prefix='/api/v1')
app.register_blueprint(exercise_routes, url_prefix='/api/v1')

@app.route("/")
def hello():
    return "Hello world"

if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=app.config['PORT'])
