from flask import Flask, request, jsonify
from flask_cors import CORS
from planner.algorithm import generate_plan

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

app = Flask(__name__)
CORS(app)

import os, json

cred = credentials.Certificate(
    json.loads(os.environ["FIREBASE_CONFIG"])
)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route("/")
def home():
    return "Backend Running"

# 🔥 GENERATE
@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    return jsonify(generate_plan(data))

# 🔥 SAVE PLAN (FIX: timestamp + id store)
@app.route("/save", methods=["POST"])
def save():
    data = request.json
    data["timestamp"] = datetime.utcnow()

    doc_ref = db.collection("plans").document()
    doc_ref.set(data)

    return jsonify({"msg":"saved", "id": doc_ref.id})

# 🔥 HISTORY (ORDER FIXED)
@app.route("/history", methods=["POST"])
def history():
    user = request.json.get("user")

    docs = db.collection("plans") \
        .where("user","==",user) \
        .stream()

    result = []

    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        result.append(d)

    return jsonify(result)

# 🔥 UPDATE (NEW - IMPORTANT FOR CHECKBOX SAVE)
@app.route("/update", methods=["POST"])
def update():
    data = request.json
    doc_id = data["id"]
    plan = data["plan"]

    db.collection("plans").document(doc_id).update({
        "plan": plan
    })

    return jsonify({"msg":"updated"})

if __name__ == "__main__":
    app.run(debug=True)