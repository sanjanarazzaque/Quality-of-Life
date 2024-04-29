from flask import Flask, jsonify, request # pip install flask
from flask_cors import CORS # pip install flask-cors
import firebase_admin # pip install firebase-admin
from firebase_admin import credentials, db


# for running the full stack:
# open two terminal windows
# cd frontend/vipervision --> npm start
# cd backend --> flask run

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("../sixthsense.json")  # Update with your own path

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://sixthsense-3e34d-default-rtdb.firebaseio.com/'  # Firebase database URL
})

@app.route('/')
def index():
  return 'Welcome to ViperVision.'

@app.route('/data', methods=['GET'])
def get_data():
  ref = db.reference('pics')  # Our specific datbase node
  data = ref.get()
  return jsonify(data)
  


if __name__ == '__main__':
  app.run(debug=True)

  