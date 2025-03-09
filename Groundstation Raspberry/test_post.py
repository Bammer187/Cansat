import requests
from random import randint
from time import sleep
import sqlite3
from datetime import datetime

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
connection.commit()

url = "http://localhost:5000/send_data"

while True:
    temperature = randint(1, 1024)
    airpressure = randint(1, 1024)
    humidity = randint(1, 1024)
    particle_concentration = randint(1, 1024)
    x_acceleration = randint(1, 50)
    y_acceleration = randint(1, 50)
    z_acceleration = randint(1, 50)
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    insert_query = '''INSERT INTO sensorValues 
        (Temperature, Airpressure, Humidity, Particle_concentration, 
        X_Acceleration, Y_Acceleration, Z_Acceleration, Time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)'''
    
    cursor.execute(insert_query, (temperature, airpressure, humidity, 
                                  particle_concentration, x_acceleration, 
                                  y_acceleration, z_acceleration, current_time))
    
    connection.commit()

    data = {
        "temperature": temperature,
        "pressure": airpressure,
        "humidity": humidity,
        "particle": particle_concentration,
        "acceleration": {
            "X": x_acceleration,
            "Y": y_acceleration,
            "Z": z_acceleration
        }
    }

    response = requests.post(url, json=data)
    sleep(1)
