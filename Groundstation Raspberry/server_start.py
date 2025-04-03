from server import Server
from esp32_serial_bridge import Esp32SerialBridge
import threading

raspberry = Server()
esp_bridge = Esp32SerialBridge()

if __name__ == "__main__":
    threading.Thread(target=esp_bridge.start, daemon=True).start()
    raspberry.start()