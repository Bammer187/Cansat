import serial
import struct

ser = serial.Serial("/dev/serial0", 115200, timeout=1)

while True:
    try:
        if ser.in_waiting >= 28:
            data = ser.read(28)

            accX, accY, accZ, temperature, humidity, pressure, particle_concentration = struct.unpack('fffffff', data)

            print(f"Acceleration: X={accX}, Y={accY}, Z={accZ}")
            print(f"Temp={temperature}, Humi={humidity}, Pres={pressure}, Part={particle_concentration}")

    except Exception as e:
        print(e)