import serial
import struct
import threading
from time import sleep
from data.data_factory import DataFactory
import sqlite3


class Esp32SerialBridge:
    def __init__(self, port="/dev/serial0", baudrate=115200, server_url="127.0.0.1:5000/send_data"):
        self.ser = serial.Serial(port, baudrate, timeout=1)
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
        self.running = True  # Stop-flag for threads


    def receive_data(self) -> None:
        while self.running:
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
            
            sleep(0.1)


    def send_to_server(self) -> None:
        while self.running:
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
            sleep(0.1)


    def start(self):
        uart_thread = threading.Thread(target=self.receive_data, daemon=True)
        uart_thread.start()

        self.send_to_server()


    def stop(self):
        self.running = False
