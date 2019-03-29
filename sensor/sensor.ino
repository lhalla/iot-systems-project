#include <Adafruit_CCS811.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <SoftwareSerial.h>
#include <Wire.h>

#define WIFI_SSID ""
#define WIFI_PASS ""
#define SERVER_IP "http://???.???.???.???:3001/api/data/new"

#define BAUD_RATE 115200
#define MEAS_DLAY 5000

ESP8266WiFiMulti WiFiMulti;

void setup()
{
    Serial.begin(BAUD_RATE);

    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP(WIFI_SSID, WIFI_PASS);
}

void loop()
{
    delay(MEAS_DLAY);
}
