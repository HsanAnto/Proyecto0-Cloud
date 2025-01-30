from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from .models import db
import os

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('PSQLUSER')}:{os.getenv('PSQLPASSWORD')}@{os.getenv('PSQLHOST')}:5432/{os.getenv('PSQLDB')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('SECRETKEY')
    return app
