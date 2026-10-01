
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from pathlib import Path

app = Flask(__name__, instance_relative_config=True)

# Ensure the instance folder exists for the database.
Path(app.instance_path).mkdir(parents=True, exist_ok=True)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{Path(app.instance_path) / 'nextrole.db'}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Development configuration.
CORS(app, supports_credentials=True)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)


@app.get("/")
def home():
    return jsonify({"message": "Welcome to the NextRole API!"})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)