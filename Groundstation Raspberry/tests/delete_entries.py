import sys
import os
from random import randint
import sqlite3

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, base_dir)

from data.data_factory import DataFactory

def main():
    data_provider = DataFactory.getInstance()


    data_provider.open_connection("sensor_data.db")

    for i in range(5):
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
            data_provider.save_to_db(data)
            success = True
        except sqlite3.Error as e:
            print(f"Error saving the data: {e}")
            success = False

    print("Before delete:")
    entries = data_provider.get_all_db_entries()
    print(entries)
    print(f"Entries: {len(entries)}")

    data_provider.delete_entries(3)

    print("After delete:")
    entries = data_provider.get_all_db_entries()
    print(entries)
    print(f"Entries: {len(entries)}")

    data_provider.close_connection()


if __name__ == "__main__":
    main()