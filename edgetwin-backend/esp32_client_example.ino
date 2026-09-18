/*
  esp32_client_example.ino
  Example sketch showing how the ESP32 talks to the EdgeTwin backend.

  It assumes you already have:
    - MPU6050 giving you vibration_rms (compute RMS of accel magnitude
      over a short window before sending)
    - A temperature sensor
    - RPM from your motor driver / hall sensor
    - Current from an ACS712 or similar
    - Your TinyML model (TensorFlow Lite Micro) running on-device,
      producing `predicted_label` and `confidence`

  Replace the placeholder read_* functions and the TinyML inference call
  with your actual sensor/model code — this file only shows the
  networking part: how to POST a reading to /api/ingest and react to the
  trust state that comes back.
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Use your laptop's LAN IP (not localhost) while on the same Wi-Fi network
const char* BACKEND_URL = "http://192.168.1.100:8000/api/ingest";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

// --- Placeholder sensor reads: replace with your real sensor code ---
float read_temperature() { return 27.5; }
float read_vibration_rms() { return 0.22; }
float read_rpm() { return 1020; }
float read_current() { return 0.68; }

// --- Placeholder for your TinyML inference: replace with your model ---
void run_tinyml_inference(String &label, float &confidence) {
  label = "NORMAL";
  confidence = 0.94;
}

void send_reading() {
  if (WiFi.status() != WL_CONNECTED) return;

  float temperature = read_temperature();
  float vibration_rms = read_vibration_rms();
  float rpm = read_rpm();
  float current = read_current();

  String label;
  float confidence;
  run_tinyml_inference(label, confidence);

  StaticJsonDocument<512> doc;
  doc["device_id"] = "esp32-01";
  JsonObject features = doc.createNestedObject("features");
  features["temperature"] = temperature;
  features["vibration_rms"] = vibration_rms;
  features["rpm"] = rpm;
  features["current"] = current;
  JsonObject prediction = doc.createNestedObject("prediction");
  prediction["label"] = label;
  prediction["confidence"] = confidence;

  String payload;
  serializeJson(doc, payload);

  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(payload);

  if (httpCode == 200) {
    String response = http.getString();
    StaticJsonDocument<1024> respDoc;
    deserializeJson(respDoc, response);

    float rgi = respDoc["reality_gap"]["reality_gap_index"];
    const char* trustState = respDoc["trust"]["trust_state"];

    Serial.printf("RGI=%.1f  trust=%s\n", rgi, trustState);

    // Example: if trust is UNKNOWN, you could light an LED, sound a
    // buzzer, or refuse to let the prediction trigger an automated
    // shutdown/maintenance action.
    if (strcmp(trustState, "UNKNOWN") == 0) {
      // e.g. digitalWrite(WARNING_LED_PIN, HIGH);
    }
  } else {
    Serial.printf("POST failed, code: %d\n", httpCode);
  }
  http.end();
}

void loop() {
  send_reading();
  delay(1000); // send a reading once per second
}
