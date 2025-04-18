import serial
import struct
from time import sleep
from data.data_factory import DataFactory
import sqlite3


class Esp32SerialBridge:
    def __init__(self, port="/dev/serial0", baudrate=115200, server_url="http://127.0.0.1:5000/send_data"):
        self.ser = serial.Serial(port, baudrate, timeout=1)
        # sleep(2) # Uncomment if you want to connect the ESP to a Notebook
        self.server_url = server_url
        self.__data = {
            "temperature": 0,
            "pressure": 0,
            "humidity": 0,
            "particle": 0,
            "acceleration": {"X": 0, "Y": 0, "Z": 0},
            "success": False
        }
        self.__data_provider = DataFactory.getInstance()


    def receive_data(self) -> None:
        try:
            if self.ser.in_waiting >= 28: # Number of bytes expected, for each variable 4 bytes
                data = self.ser.read(28)
                accX, accY, accZ, temperature, humidity, pressure, particle_concentration = struct.unpack('fffffff', data)

                self.__data.update({
                    "temperature": temperature,
                    "pressure": pressure,
                    "humidity": humidity,
                    "particle": particle_concentration,
                    "acceleration": {"X": accX, "Y": accY, "Z": accZ},
                })
        except Exception as e:
            print(f"UART Error: {e}")


    def send_to_server(self) -> None:
        self.__data_provider.open_connection("sensor_data.db")
        try:
            self.__data_provider.save_to_db(self.__data)
            self.__data["success"] = True
        except sqlite3.Error as e:
            print(f"Database error: {e}")
            self.__data["success"] = False

        try:
            self.__data_provider.post_sensor_data(self.server_url, self.__data)
        except Exception as e:
            print(f"Server error: {e}")

        self.__data_provider.close_connection()


    def start(self):
        while True:
            self.receive_data()
            self.send_to_server()
            sleep(1)
