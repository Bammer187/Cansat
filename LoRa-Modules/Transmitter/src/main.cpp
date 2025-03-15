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

void LoRa_txMode();
void LoRa_sendMessage(String message);
boolean runEvery(unsigned long interval);

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
  if (runEvery(1000)) { // repeat every 1000 millis

    String message = "HeLoRa World! ";
    message += "I'm a Node! ";
    message += millis();

    LoRa_sendMessage(message); // send a message

    Serial.println("Send Message!");
  }
}

void LoRa_txMode() {
  LoRa.idle();                          // set standby mode
  LoRa.disableInvertIQ();               // normal mode
}

void LoRa_sendMessage(String message) {
  LoRa_txMode();                        // set tx mode
  LoRa.beginPacket();                   // start packet
  LoRa.print(message);                  // add payload
  LoRa.endPacket(true);                 // finish packet and send it
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