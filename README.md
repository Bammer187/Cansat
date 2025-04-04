# Cansat

![imagen](assets/Preview.gif)

## Table of Contents

- [Description](#description)
- [Core Technologies](#core-technologies)
- [Installation](#installation)
- [How it works](#how-it-works)
  - [System Architecture](#system-architecture)
- [License](#license)

## Description
This CanSat project integrates a real-time telemetry system using **LoRa** for long-range data transmission, **Python** for backend data processing and **Vue.js** for a responsive web dashboard. The system collects and visualizes environmental and positional data from the CanSat during flight, providing reliable communication and an intuitive interface for monitoring mission parameters. You are also able to test the GUI and Python Code without sensors.

## Core Technologies
- [Vue.js](https://vuejs.org/)
- [PrimeVue](https://primevue.org/)
- [vue-chartjs](https://vue-chartjs.org/)
- [Flask](https://flask.palletsprojects.com/en/stable/)

## Installation
1. Clone the repository:
```bash
git clone https://github.com/Bammer187/Cansat.git
cd Cansat
```

The next steps will assume that you are starting in the **Cansat/** directory.

2. Install node packages:
```bash
cd Groundstation\ GUI/ # On Windows: cd '.\Groundstation GUI\'
npm install
```

3. Install python dependencies:
```bash
cd Groundstation\ Raspberry/ # On Windows: cd '.\Groundstation Raspberry\'
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Build the GUI:
```bash
cd Groundstation\ GUI/
npm run build
```

5. Copy the **dist/** folder into **Groundstation Raspberry/**.

6. Start the server:
```bash
cd Groundstation\ Gui/
python server_start.py
```

7. Access the UI at http://localhost:5000.

8. (optional) Send test data:
```bash
cd Groundstation\ Raspberry/
python tests/post_and_save_to_db.py
```

9. If you are using the same sensors as we are and they are running with the LoRa modules, you can start the entire communication in this way:
```bash
cd Groundstation\ Raspberry/
python esp_raspberry_start.py
```

## How it works
By default, the system updates sensor readings every second. This interval can be adjusted by modifying the **settings.ts** file for the GUI, changing the sleep durations in the Python scripts, and updating the runEvery() method in the C++ code.

Measured parameters and sensors:

    Temperature – BME280

    Humidity – BME280

    Air Pressure – BME280

    Air Quality – MQ-135

    X-Axis Acceleration – ADXL345

    Y-Axis Acceleration – ADXL345

    Z-Axis Acceleration – ADXL345

After each measurement cycle, the data is transmitted via LoRa modules. The ground module is connected to a Raspberry Pi through UART. The Pi reads the incoming values, stores them in a database, and forwards them to a server. The GUI then retrieves and displays the data through HTTP requests.

### System Architecture
![architecture](assets/Flowchart.svg)

## License

[MIT License](LICENSE)

<div align="center">
    <img src="./assets/logo.jpg" alt="logo" width="80%"/>
</div>