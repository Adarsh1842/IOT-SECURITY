// #include "DHT.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>



// int mq6 = A0;

// float humidity;
float gasLevel;

WiFiClient client;
// long long int encrypt(double message)
// {
//   long long int encrypted_text = 1;
//   long long int base = message;
//   int exponent = 7;
//   int modulus = 187;
  
//   while (exponent > 0) {
//     if (exponent % 2 == 1) {
//       encrypted_text = (encrypted_text * base) % modulus;
//     }
//     base = (base * base) % modulus;
//     exponent /= 2;
//   }
  
//   return encrypted_text;
// }
int encrypt(double message)
{
	int e = 7;
  int n=187;
	int encrpyted_text = 1;
	while (e--) {
		encrpyted_text *= message;
		encrpyted_text %= n;
	}
	return encrpyted_text;
}


void connectWiFi(){

  Serial.begin(9600);
  WiFi.begin("harsh","shidee123");
  while(WiFi.status()!= WL_CONNECTED){
    Serial.print(".");
    delay(500);
  }
  Serial.println("WIFI Connected");
  Serial.println(WiFi.localIP());
}


void getGasLevel(){
  gasLevel = analogRead(A0);
  Serial.println(gasLevel);
  delay(1000);
}


void createPacket(){
  StaticJsonDocument<300> jsonDoc;
  JsonObject jsonData = jsonDoc.to<JsonObject>();

  jsonData["temperature"] = encrypt(33);
  jsonData["humidity"] = encrypt(43);
  jsonData["gasLevel"] = encrypt(gasLevel);

  String output;
  serializeJson(jsonData, output);
  Serial.println(output);

  HTTPClient http;
  http.begin(client, "http://172.20.10.7:8080/postData/");
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.sendRequest("POST", output);
  String payLoad = http.getString();

  Serial.println(httpCode);
  Serial.println(payLoad);

  jsonDoc.clear();
}


void setup() {

  connectWiFi();
  
}


void loop() {
  getGasLevel();
  createPacket();

}
