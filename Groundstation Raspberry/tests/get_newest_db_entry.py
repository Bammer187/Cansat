import sys
import os

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, base_dir)

from data.data_factory import DataFactory


def main():
    data_provider = DataFactory.getInstance()

    db_path = os.path.join(base_dir, "sensor_data.db")

    data_provider.open_connection(db_path)

    print(data_provider.get_newest_db_entry())

    data_provider.close_connection()


if __name__ == "__main__":
    main()