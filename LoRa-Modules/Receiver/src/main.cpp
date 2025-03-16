#include <Arduino.h>
#include <SPi.h>
#include <LoRa.h>

// LoRa-Pins
#define LORA_CS 18
#define LORA_RST 23
#define LORA_DIO 26

// SPI-Pins
#define LORA_SCLK 5
#define LORA_MISO 19
#define LORA_MOSI 27

const long frequency = 868E6;

void setup(){
  Serial.begin(9600);
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
}