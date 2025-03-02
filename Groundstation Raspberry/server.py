from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from random import randint

class Server:
    def __init__(self, host='0.0.0.0', port=5000, debug=True):
        self.app = Flask(__name__, static_folder="dist")
        CORS(self.app)
        self.host = host
        self.port = port
        self.debug = debug
        self._setup_routes()

    def _setup_routes(self):
        @self.app.route('/data')
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

        @self.app.route('/')
        def serve(path="index.html"):
            return send_from_directory("dist", path)
        @self.app.route('/<path:path>')
        def serve_vue(path="index.html"):
            return send_from_directory("dist", path)

    def start(self):
        self.app.run(host=self.host, port=self.port, debug=self.debug)
