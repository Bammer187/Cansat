#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <HardwareSerial.h>

// LoRa-Pins
#define LORA_CS 18
#define LORA_RST 23
#define LORA_DIO 26

// SPI-Pins
#define LORA_SCLK 5
#define LORA_MISO 19
#define LORA_MOSI 27

HardwareSerial mySerial(1);

const long frequency = 868E6;

float xAcceleration = 0.0f, yAcceleration = 0.0f, zAcceleration = 0.0f;
float temperature = 0.0f;
float humidity = 0.0f;
float pressure = 0.0f;
float particleConcentration = 0.0f;

boolean runEvery(unsigned long interval);
void parseData(String data);
void sendSensorData();

void setup(){
  Serial.begin(115200);
  mySerial.begin(115200, SERIAL_8N1, 17, 16);  // TX=17, RX=16
  SPI.begin(LORA_SCLK, LORA_MISO, LORA_MOSI);
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO); 

  if (!LoRa.begin(frequency)) {
    Serial.println("LoRa init failed.");
    while (true){
      delay(500);
    };
  }
  Serial.println("LoRa init successfull");
}

void loop(){
  if(runEvery(1000)){
    int packetSize = LoRa.parsePacket();
    String dataString = "";
    if(packetSize) {
      Serial.println("Received Package");
      while (LoRa.available()) {
        dataString += (char)LoRa.read();
      }
    }
    parseData(dataString);
    sendSensorData();
  }
}

boolean runEvery(unsigned long interval) {
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval)
  {
    previousMillis = currentMillis;
    return true;
  }
  return false;
}

void parseData(String data){
  int index1 = data.indexOf(';');
  int index2 = data.indexOf(';', index1 + 1);
  int index3 = data.indexOf(';', index2 + 1);
  int index4 = data.indexOf(';', index3 + 1);
  int index5 = data.indexOf(';', index4 + 1);
  int index6 = data.indexOf(';', index5 + 1);
  
  xAcceleration = data.substring(0, index1).toFloat();
  yAcceleration = data.substring(index1 + 1, index2).toFloat();
  zAcceleration = data.substring(index2 + 1, index3).toFloat();
  humidity = data.substring(index3 + 1, index4).toFloat();
  pressure = data.substring(index4 + 1, index5).toFloat();
  temperature = data.substring(index5 + 1, index6).toFloat();
  particleConcentration = data.substring(index6 + 1).toInt();
}

void sendSensorData() {
  mySerial.write((uint8_t*)&xAcceleration, sizeof(xAcceleration));
  mySerial.write((uint8_t*)&yAcceleration, sizeof(yAcceleration));
  mySerial.write((uint8_t*)&zAcceleration, sizeof(zAcceleration));
  mySerial.write((uint8_t*)&temperature, sizeof(temperature));
  mySerial.write((uint8_t*)&humidity, sizeof(humidity));
  mySerial.write((uint8_t*)&pressure, sizeof(pressure));
  mySerial.write((uint8_t*)&particleConcentration, sizeof(particleConcentration));

  // Uncomment if you want to connect the ESP to a Notebook
  /*
  Serial.write((uint8_t*)&xAcceleration, sizeof(xAcceleration));
  Serial.write((uint8_t*)&yAcceleration, sizeof(yAcceleration));
  Serial.write((uint8_t*)&zAcceleration, sizeof(zAcceleration));
  Serial.write((uint8_t*)&temperature, sizeof(temperature));
  Serial.write((uint8_t*)&humidity, sizeof(humidity));
  Serial.write((uint8_t*)&pressure, sizeof(pressure));
  Serial.write((uint8_t*)&particleConcentration, sizeof(particleConcentration));
  */
}