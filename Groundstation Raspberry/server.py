from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import time
from data.data_factory import DataFactory

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
            },
            "success": False}

        self.__last_saved_time = 0
        self.__TIMEOUT = 3
        self.__data_provider = DataFactory.getInstance()


    def __setup_routes(self):
        @self.app.route('/data', methods=['GET'])
        def get_data():
            return jsonify(self.__data)
        

        @self.app.route('/check_data_saved', methods=['GET'])
        def get_data_saved():
            current_time = time.time()

            self.__data["success"] = (current_time - self.__last_saved_time) < self.__TIMEOUT

            return jsonify(self.__data["success"])
        

        @self.app.route('/getAllDbEntries', methods= ['GET'])
        def getAllDbEntries():
            pass


        @self.app.route('/getAllDbEntry', methods= ['GET'])
        def getNewestDbEntry():
            pass


        @self.app.route('/send_data', methods=['GET', 'POST'])
        def update_data():
            try:
                new_data = request.get_json()
                if isinstance(new_data, dict):
                    self.__data.update(new_data)

                    if new_data.get("success", False):
                        self.__last_saved_time = time.time()

                    return jsonify({"success": True, "message": "Data updated!"}), 200
                else:
                    return jsonify({"success": False, "message": "Invalid data format"}), 400

            except Exception as e:
                return jsonify({"success": False, "message": str(e)}), 500


        @self.app.route('/delete_entry/<int:option>', methods=['DELETE'])
        def delete_entry(option):
            if option not in [1, 2, 3]:
                return jsonify({'message': 'Invalid option'}), 400
            
            self.__data_provider.open_connection('sensor_data.db')

            if option == 1:
                self.__data_provider.delete_all_entries()
            elif option == 2:
                self.__data_provider.delete_entries(10)
            elif option == 3:
                self.__data_provider.delete_last_24h()

            self.__data_provider.close_connection()

            return jsonify({'message': f'Entries with option {option} deleted successfully'}), 200
        

        @self.app.route('/delete_custom/<int:entries>', methods=['DELETE'])
        def delete_custom(entries):
            self.__data_provider.open_connection('sensor_data.db')
            self.__data_provider.delete_entries(entries)
            self.__data_provider.close_connection()

            return jsonify({'message': f'The first {entries} entries were succesfully deleted'}), 200


        @self.app.route('/')
        def serve(path="index.html"):
            return send_from_directory("dist", path)
        

        @self.app.route('/<path:path>')
        def serve_vue(path="index.html"):
            return send_from_directory("dist", path)

    def start(self):
        self.app.run(host=self.host, port=self.port, debug=self.debug)
