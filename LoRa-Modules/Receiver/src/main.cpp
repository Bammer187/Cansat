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

float accX = 0.123f, accY = 1.456f, accZ = 9.876f;
float temperature = 22.5f;
float humidity = 50.0f;
float pressure = 1013.25f;
float particleConcentration = 90.1f;

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
  int packetSize = LoRa.parsePacket();
  if(packetSize) {
    Serial.println("Received Package");
    while (LoRa.available()) {
      Serial.print((char)LoRa.read());
    }
    Serial.print("  RSSI:  ");
    Serial.println(LoRa.packetRssi());
  }

 sendSensorData();

  delay(1000);
}

void sendSensorData() {
  mySerial.write((uint8_t*)&accX, sizeof(accX));
  mySerial.write((uint8_t*)&accY, sizeof(accY));
  mySerial.write((uint8_t*)&accZ, sizeof(accZ));
  mySerial.write((uint8_t*)&temperature, sizeof(temperature));
  mySerial.write((uint8_t*)&humidity, sizeof(humidity));
  mySerial.write((uint8_t*)&pressure, sizeof(pressure));
  mySerial.write((uint8_t*)&pressure, sizeof(pressure));
  mySerial.write((uint8_t*)&particleConcentration, sizeof(particleConcentration));
}