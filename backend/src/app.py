import os
from flask import Flask
from models.models import db
from blueprints.users import user_routes

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= 'postgresql://root:intro@localhost:5432/gym'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.register_blueprint(user_routes, url_prefix='/api/v1')


@app.route("/")
def hello():
    return "Hello world"

if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=False, host='0.0.0.0', port=port)