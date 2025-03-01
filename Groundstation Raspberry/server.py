from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from random import randint

app = Flask(__name__, static_folder="dist")
CORS(app)

@app.route('/data')
def send_data():
    data = {
        "temperature": randint(1, 1024),
        "pressure": randint(1, 1024),
        "humidity": randint(1, 1024),
        "particle": randint(1, 1024),
        "acceleration": {
            "X": randint(1, 50),
            "Y": randint(1, 50),
            "Z": randint(1, 50),
        }
    }
    return jsonify(data)

@app.route('/')
@app.route('/<path:path>')
def serve_vue(path="/index.html"):
    return send_from_directory("dist", path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 5000, debug=True)