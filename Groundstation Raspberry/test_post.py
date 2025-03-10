import requests
from random import randint
from time import sleep
import sqlite3
from datetime import datetime

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

    success = False
    try:
        insert_query = '''INSERT INTO sensorValues 
            (Temperature, Airpressure, Humidity, Particle_concentration, 
            X_Acceleration, Y_Acceleration, Z_Acceleration, Time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);'''
        
        cursor.execute(insert_query, (temperature, airpressure, humidity, 
                                    particle_concentration, x_acceleration, 
                                    y_acceleration, z_acceleration, current_time))
        
        connection.commit()
        success = True
    except sqlite3.Error as e:
        print(f"Error saving the data: {e}")
        success = False

    data = {
        "temperature": temperature,
        "pressure": airpressure,
        "humidity": humidity,
        "particle": particle_concentration,
        "acceleration": {
            "X": x_acceleration,
            "Y": y_acceleration,
            "Z": z_acceleration
        },
        "success": success
    }

    try:
        response = requests.post(url, json=data)
        print(f"Transmitted: {data} | Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending the data: {e}")

    sleep(1)
