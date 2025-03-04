from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

class Server:
    def __init__(self, host='0.0.0.0', port=5000, debug=True):
        self.app = Flask(__name__, static_folder="dist")
        CORS(self.app)
        self.host = host
        self.port = port
        self.debug = debug
        self.__setup_routes()
        self.__data = {
            "temperature": 0,
            "pressure": 0,
            "humidity": 0,
            "particle": 0,
            "acceleration": {
                "X": 0,
                "Y": 0,
                "Z": 0,
            }}

    def __setup_routes(self):
        @self.app.route('/data')
        def send_data():
            return jsonify(self.__data)

        @self.app.route('/')
        def serve(path="index.html"):
            return send_from_directory("dist", path)
        @self.app.route('/<path:path>')
        def serve_vue(path="index.html"):
            return send_from_directory("dist", path)

    def start(self):
        self.app.run(host=self.host, port=self.port, debug=self.debug)
