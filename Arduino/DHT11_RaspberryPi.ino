#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
String Request = "";

void setup() {
  Serial.begin(9600);
  //Serial.println(F("DHT11 start"));
  dht.begin();
}

void loop() {
  if (Serial.available())
  {
    char data = Serial.read();
    
    if (data == '\n')
    {
      if (Request == "GET")
      {
        float h = dht.readHumidity();
        float t = dht.readTemperature();
        float f = dht.readTemperature(true);
      
        if (isnan(h) || isnan(t) || isnan(f)) {
          Serial.println(F("Failed"));
          return;
        }
      
        float hif = dht.computeHeatIndex(f, h);
        float hic = dht.computeHeatIndex(t, h, false);
      
        Serial.print(F("Humidity: "));
        Serial.print(h);
        Serial.print(F("%  Temperature: "));
        Serial.print(t);
        Serial.print(F("C "));
        Serial.print(f);
        Serial.print(F("F  Heat index: "));
        Serial.print(hic);
        Serial.print(F("C "));
        Serial.print(hif);
        Serial.println(F("F"));
      }
      else
      {
        Serial.println(F("Error"));
      }

      Request = "";
    }
    else
    {
      Request += data;
    }
  }
}
