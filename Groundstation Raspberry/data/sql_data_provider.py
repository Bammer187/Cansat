from .data_provider import DataProvider
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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        self.connection.commit()
        self.close_connection()
        

    def post_sensor_data(self, server_url: str, data: dict) -> None:
        try:
            response = requests.post(server_url, json=data)
            print(f"Transmitted: {data} | Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error sending the data: {e}")


    def save_to_db(self, data: dict) -> None:
        insert_query = '''INSERT INTO sensorValues 
            (Temperature, Airpressure, Humidity, Particle_concentration, 
            X_Acceleration, Y_Acceleration, Z_Acceleration)
            VALUES (?, ?, ?, ?, ?, ?, ?);'''
        
        self.cursor.execute(insert_query, (data["temperature"], data["pressure"], data["humidity"], 
                                    data["particle"], data["acceleration"]["X"], 
                                    data["acceleration"]["Y"], data["acceleration"]["Z"]))
        
        self.connection.commit()


    def delete_entries(self, number: int) -> None:
        delete_query = '''DELETE FROM sensorValues
            WHERE ROWID IN (
                SELECT ROWID FROM sensorValues
                ORDER BY Time ASC
                LIMIT ?
            );'''

        self.cursor.execute(delete_query, [number])
        self.connection.commit()

    def delete_all_entries(self):
        self.cursor.execute('DELETE FROM sensorValues')
        self.cursor.execute('UPDATE sqlite_sequence SET seq = 0 WHERE name="sensorValues";')
        self.connection.commit()

    def open_connection(self, db_name: str) -> None:
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()


    def close_connection(self) -> None:
        self.connection.commit()
        self.connection.close()
    