from esp32_serial_bridge import Esp32SerialBridge

esp_bridge = Esp32SerialBridge()

if __name__ == "__main__":
    esp_bridge.start()