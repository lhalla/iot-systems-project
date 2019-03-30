#include <Adafruit_CCS811.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <SoftwareSerial.h>
#include <WiFiClient.h>
#include <Wire.h>

#define WIFI_SSID ""
#define WIFI_PASS ""
#define SERVER_IP "http://???.???.???.???:3001/api/data/new"

#define BAUD_RATE 115200
#define MEAS_DLAY 5000

Adafruit_CCS811 sensor;

ESP8266WiFiMulti WiFiMulti;

void setup()
{
  Serial.begin(BAUD_RATE);

  Serial.println("IoT Systems: Design and Applications");
  Serial.println("-----------Course Project-----------");
  Serial.println("---------------Sensor---------------");
  Serial.println();

  Wire.begin();
  if (!sensor.begin())
  {
    Serial.println("Error: Sensor not found! Please check the connection.");
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PASS);
}

void loop()
{
  if (WiFiMulti.run() == WL_CONNECTED)
  {
    StaticJsonDocument<JSON_OBJECT_SIZE(4)> doc;

    doc["temperature"] = sensor.calculateTemperature();
    doc["humidity"] = -1;
    doc["eCO2"] = sensor.geteCO2();
    doc["VOC"] = sensor.getTVOC();

    String json_serial = "";
    serializeJson(doc, json_serial);

    HTTPClient http;
    WiFiClient wifi;

    Serial.println("[HTTP] begin...");
    if (http.begin(wifi, SERVER_IP))
    {
      http.addHeader("Content-Type", "application/json");

      Serial.println("[HTTP] POST...");
      int http_code = http.POST(json_serial);

      if (http_code == HTTP_CODE_OK)
      {
        Serial.printf("[HTTP] POST... code: %d\n", http_code);
      }
      else
      {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(http_code).c_str());
      }

      http.end();
    }
    else
    {
      Serial.println("[HTTP] Unable to connect.");
    }
    Serial.println("---");
  }

  delay(MEAS_DLAY);
}
