import requests
from random import randint
from time import sleep

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
