import requests
from random import randint
from time import sleep
import sqlite3
from data.data_factory import DataFactory

data_provider = DataFactory.getInstance()

url = "http://localhost:5000/send_data"

while True:
    temperature = randint(1, 1024)
    airpressure = randint(1, 1024)
    humidity = randint(1, 1024)
    particle_concentration = randint(1, 1024)
    x_acceleration = randint(1, 50)
    y_acceleration = randint(1, 50)
    z_acceleration = randint(1, 50)
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
        data_provider.open_connection("sensor_data.db")
        data_provider.save_to_db(data)
        data_provider.close_connection()
        success = True
    except sqlite3.Error as e:
        print(f"Error saving the data: {e}")
        success = False

    sleep(1)
