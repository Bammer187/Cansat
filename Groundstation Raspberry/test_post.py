import requests
from random import randint
from time import sleep
import sqlite3

connection = sqlite3.connect('sensor_data.db')

cursor = connection.cursor()

create_table = '''CREATE TABLE IF NOT EXISTS sensorValues (
    id INTEGER PRIMARY KEY,
    Temperature REAL,
    Airpressure REAL,
    Humidity REAL,
    Particle_concentration REAL,
    X_Acceleration REAL,
    Y_Acceleration REAL,
    Z_Acceleration REAL,
    Time TEXT
)'''

cursor.execute(create_table)

url = "http://localhost:5000/send_data"
while True:
    data = {
        "temperature": randint(1, 1024),
        "pressure": randint(1, 1024),
        "humidity": randint(1, 1024),
        "particle": randint(1, 1024),
        "acceleration": {
            "X": randint(1, 50),
            "Y": randint(1, 50),
            "Z": randint(1, 50)
        }
    }

    response = requests.post(url, json=data)
    sleep(1)
