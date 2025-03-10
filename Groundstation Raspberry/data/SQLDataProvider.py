from DataProvider import DataProvider
import sqlite3
import requests

class SQLDataProvider(DataProvider):
    
    def __init__(self, db_name: str):
        super().__init__()
        self.connection = None
        self.cursor = None
        self.initDB(db_name)


    def initDB(self, db_name: int) -> None:
        self.open_connection(db_name)

        create_table = '''CREATE TABLE IF NOT EXISTS sensorValues (
            id INTEGER PRIMARY KEY,
            Temperature REAL,
            Airpressure REAL,
            Humidity REAL,
            Particle_concentration REAL,
            X_Acceleration REAL,
            Y_Acceleration REAL,
            Z_Acceleration REAL,
            Time TEXT DEFAULT (DATETIME('now', 'localtime'))
        );'''

        self.cursor.execute(create_table)
        self.close_connection()
        

    def post_sensor_data(self, server_url: str, data: dict):
        try:
            response = requests.post(server_url, json=data)
            print(f"Transmitted: {data} | Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error sending the data: {e}")


    def open_connection(self, db_name: str) -> None:
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()


    def close_connection(self) -> None:
        self.connection.commit()
        self.connection.close()
    