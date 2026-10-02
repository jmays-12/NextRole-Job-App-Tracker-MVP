import os
from datetime import datetime, timezone
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from models import db_all, db_one, db_run, init_db

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
bcrypt = Bcrypt(app)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")


if not app.config["SECRET_KEY"]:
    raise RuntimeError("SECRET_KEY environment variable is not set")

init_db()

VALID_STATUSES = ["applied", "interviewing", "offer", "rejected", "withdrawn"]


# reusable function wrapper for validating session
def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Not logged in"}), 401
        return f(*args, **kwargs)

    return wrapper


@app.post("/api/signup")
def signup():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    if db_one("SELECT id FROM users WHERE email = ?", (email,)):
        return jsonify({"error": "Email already in use"}), 400

    user_id, _ = db_run(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        (email, bcrypt.generate_password_hash(password).decode("utf-8")),
    )
    session["user_id"] = user_id
    return jsonify({"email": email}), 201


@app.post("/api/login")
def login():
    data = request.get_json()
    user = db_one("SELECT * FROM users WHERE email = ?", (data.get("email"),))
    if not user or not bcrypt.check_password_hash(
        user["password_hash"], data.get("password", "")
    ):
        return jsonify({"error": "Invalid email or password"}), 401

    session["user_id"] = user["id"]
    return jsonify({"email": user["email"]})


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"success": True})


@app.get("/api/me")
def me():
    if "user_id" not in session:
        return jsonify({"user": None})
    user = db_one("SELECT email FROM users WHERE id = ?", (session["user_id"],))
    return jsonify({"user": user})


@app.get("/api/applications")
@login_required
def get_applications():
    rows = db_all(
        "SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC",
        (session["user_id"],),
    )
    return jsonify(rows)


@app.post("/api/applications")
@login_required
def create_application():
    data = request.get_json()
    company, role = data.get("company"), data.get("role")
    if not company or not role:
        return jsonify({"error": "Company and role required"}), 400

    new_id, _ = db_run(
        "INSERT INTO applications (user_id, company, role, link, date_applied) VALUES (?, ?, ?, ?, ?)",
        (
            session["user_id"],
            company,
            role,
            data.get("link", ""),
            data.get("date_applied") or datetime.now(timezone.utc).date().isoformat(),
        ),
    )
    return jsonify(db_one("SELECT * FROM applications WHERE id = ?", (new_id,))), 201


@app.patch("/api/applications/<int:app_id>")
@login_required
def update_application(app_id):
    existing = db_one(
        "SELECT * FROM applications WHERE id = ? AND user_id = ?",
        (app_id, session["user_id"]),
    )
    if not existing:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    company = data.get("company", existing["company"])
    role = data.get("role", existing["role"])
    status = data.get("status", existing["status"])

    if not company or not role:
        return jsonify({"error": "Company and role required"}), 400
    if status not in VALID_STATUSES:
        return jsonify({"error": "Invalid status"}), 400

    db_run(
        """UPDATE applications
           SET company = ?, role = ?, status = ?, link = ?, date_applied = ?, notes = ?
           WHERE id = ?""",
        (
            company,
            role,
            status,
            data.get("link", existing["link"]),
            data.get("date_applied", existing["date_applied"]),
            data.get("notes", existing["notes"]),
            app_id,
        ),
    )
    return jsonify(db_one("SELECT * FROM applications WHERE id = ?", (app_id,)))


@app.delete("/api/applications/<int:app_id>")
@login_required
def delete_application(app_id):
    _, changed = db_run(
        "DELETE FROM applications WHERE id = ? AND user_id = ?",
        (app_id, session["user_id"]),
    )
    if changed == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
