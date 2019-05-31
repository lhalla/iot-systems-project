#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>
#include <Wire.h>

#include <Adafruit_BME280.h>

#include <ArduinoJson.h>
#include <SoftwareSerial.h>

const uint32_t BAUD_RATE     = 115200;

const uint8_t  DATA_POINTS   = 5;

const uint16_t DELAY         = 5000;

const char     POST_URL[]    = "http://192.168.43.201:4001/api/data/new";

const char     SENSOR_TYPE[] = "Adafruit BME280";

const char     WIFI_SSID[]   = "Dream";
const char     WIFI_PASS[]   = "bananaman";

//static const uint8_t D0   = 16;
//static const uint8_t D1   = 5;
//static const uint8_t D2   = 4;
//static const uint8_t D3   = 0;
//static const uint8_t D4   = 2;
//static const uint8_t D5   = 14;
//static const uint8_t D6   = 12;
//static const uint8_t D7   = 13;
//static const uint8_t D8   = 15;
//static const uint8_t RX   = 3;
//static const uint8_t TX   = 1;

int fan = 15;

Adafruit_BME280 sensor;

ESP8266WiFiMulti WiFiMulti;

ESP8266WebServer webServer(80);

void setup()
{
  Serial.begin(BAUD_RATE);
  pinMode(fan, OUTPUT);
  digitalWrite(fan, LOW);

  Wire.begin();
  if (!sensor.begin(0x76))
  {
    Serial.println("Error: Sensor not found! Please check the connection.");
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PASS);

  
  while (WiFiMulti.run() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Waiting for connection.");  
  }
  
  webServer.on("/togglefan", handleToggleFanClientRequest); // Set the handler function
  webServer.begin(); //Start the actual server
  Serial.println("Server is listening.");
}

void handleToggleFanClientRequest()
{
  // Do fan toggle
  digitalWrite(fan, !digitalRead(fan));
  
  // Set return message and status
  webServer.send(200, "text/plain", "Fan toggled.");
  return;
}

void loop()
{
  if (WiFiMulti.run() == WL_CONNECTED)
  {
    webServer.handleClient(); // Handle requests
    
    StaticJsonDocument<JSON_OBJECT_SIZE(DATA_POINTS)> doc;
    Serial.println("IP: ");
    Serial.println(WiFi.localIP());

    doc["sensorType"]  = WiFi.localIP().toString();
    doc["temperature"] = sensor.readTemperature();
    doc["humidity"]    = sensor.readHumidity();
    doc["pressure"]    = sensor.readPressure();
    doc["fan"]         = digitalRead(fan) == HIGH ? "true" : "false";
    //doc["sensor IP"]   = WiFi.localIP();
    float t = sensor.readTemperature();
    Serial.print("sensor temp :");
    Serial.print(t);

    String jsonSerial = "";
    serializeJson(doc, jsonSerial);

    HTTPClient http;
    WiFiClient wifi;

    Serial.println();

    Serial.println("[HTTP] Begin...");
    if (http.begin(wifi, POST_URL))
    {
      http.addHeader("Content-Type", "application/json");

      Serial.print("[HTTP] POST...");
      int httpCode = http.POST(jsonSerial);

      if (httpCode == HTTP_CODE_OK)
      {
        Serial.printf(" code: %d\n", httpCode);
      }
      else
      {
        Serial.printf(" failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
    }
    else
    {
      Serial.println("[HTTP] Unable to connect.");
    }
    Serial.println("---");
  }

  delay(DELAY);
}
