#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <Adafruit_ADXL345_U.h>
#include <MQ135.h>

// LoRa-Pins
#define LORA_CS 18
#define LORA_RST 23
#define LORA_DIO 26

// SPI-Pins
#define LORA_SCLK 5
#define LORA_MISO 19
#define LORA_MOSI 27

// I2C-Pins
#define I2C_SDA 15
#define I2C_SLC 4

#define analogMQ135 35

const long frequency = 868E6;

void LoRa_txMode();
void LoRa_sendMessage(String message);
boolean runEvery(unsigned long interval);

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);
Adafruit_BME280 bme;
MQ135 mq135(analogMQ135);

void setup(){
  Serial.begin(115200);
  SPI.begin(LORA_SCLK, LORA_MISO, LORA_MOSI);
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO); 
  Wire.begin(I2C_SDA, I2C_SLC);

  if (!LoRa.begin(frequency)) {
    Serial.println("LoRa init failed.");
    while (true){
      delay(500);
    };
  }
  Serial.println("LoRa init successfull");
  
  /* Initialise the sensor */
  if(!accel.begin())
  {
    // There was a problem detecting the ADXL345 ... check your connections
    Serial.println("Ooops, no ADXL345 detected ... Check your wiring!");
    while(1);
  }

  unsigned status;

  status = bme.begin(0x76, &Wire);

  if(!status){
    Serial.println("Could not find a BME280 Sensor");
    while(1);
  }

  accel.setRange(ADXL345_RANGE_2_G);
}

void loop(){
  if (runEvery(1000)) { // repeat every 1000 millis

    sensors_event_t event; 
    accel.getEvent(&event);
  
    float xAcceleration = event.acceleration.x;
    float yAcceleration = event.acceleration.y;
    float zAcceleration = event.acceleration.z;

    float humidity = bme.readHumidity();
    float pressure = bme.readPressure();
    float temperature = bme.readTemperature();

    float particleConcentration = mq135.getCorrectedPPM(temperature, humidity);

    String dataString = String(xAcceleration, 2) + ";" +
                        String(yAcceleration, 2) + ";" +
                        String(zAcceleration, 2) + ";" +
                        String(humidity, 2) + ";" +
                        String(pressure, 2) + ";" +
                        String(temperature, 2) + ";" +
                        String(particleConcentration, 2);

    LoRa_sendMessage(dataString); // send a message

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