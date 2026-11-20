#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <math.h>

// --- 1. ENTER YOUR DETAILS HERE ---
const char* ssid = "AMADAR";
const char* password = "Agrivet01"; // Your WiFi Password
const char* deviceToken = "2b87a6e6a1e1c62fb57b1523d76113946160c3a64d67fa215eecb745fa040015"; // Rotate in the dashboard if this sketch is shared
const char* serverUrl = "http://192.168.1.12:3000/api/iot/activity-records";

// --- 2. SENSOR SETTINGS ---
const int MPU_ADDR = 0x68;
int16_t accelX, accelY, accelZ;
float smoothTotalG = 1.0;
int stillCounter = 0;
String currentActivity = "unknown";

// --- 3. REPORTING SETTINGS ---
// A reading is sent when the classified activity changes. A heartbeat sends
// one reading periodically even when nothing changed, so the collar still
// shows as online in the dashboard.
const unsigned long HEARTBEAT_INTERVAL = 60000; // send at least once per minute
const unsigned long MIN_SEND_GAP       = 2000;  // debounce rapid activity flips
const unsigned long RETRY_INTERVAL     = 10000; // retry a failed send after 10 s
const unsigned long SENSOR_READ_DELAY  = 100;   // read sensor 10 times a second

String lastSentActivity = "";
unsigned long lastSentTime = 0;      // time of the last accepted POST
unsigned long lastAttemptTime = 0;   // time of the last POST attempt
bool hasAttempted = false;
bool lastSendFailed = false;
bool sendPending = true;             // report the first reading immediately

void setup() {
  Serial.begin(115200);

  // Start I2C for the sensor
  Wire.begin(21, 22);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);

  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // --- Read Sensor ---
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6, true);

  // Read the bytes in explicit steps. Two Wire.read() calls in one expression
  // have no guaranteed evaluation order, which can swap the high/low bytes.
  uint8_t xHi = Wire.read(), xLo = Wire.read();
  uint8_t yHi = Wire.read(), yLo = Wire.read();
  uint8_t zHi = Wire.read(), zLo = Wire.read();
  accelX = (int16_t)((xHi << 8) | xLo);
  accelY = (int16_t)((yHi << 8) | yLo);
  accelZ = (int16_t)((zHi << 8) | zLo);

  float gX = accelX / 16384.0;
  float gY = accelY / 16384.0;
  float gZ = accelZ / 16384.0;
  float totalG = sqrt((gX * gX) + (gY * gY) + (gZ * gZ));

  // Smooth the data
  smoothTotalG = (smoothTotalG * 0.8) + (totalG * 0.2);

  // --- Classify Activity ---
  if (smoothTotalG > 1.8) {
    currentActivity = "running";
    stillCounter = 0;
  }
  else if (smoothTotalG > 1.2) {
    currentActivity = "walking";
    stillCounter = 0;
  }
  else if (smoothTotalG > 0.8 && smoothTotalG < 1.2) {
    stillCounter++;
    if (stillCounter > 15) {
      currentActivity = "sleeping";
    } else {
      currentActivity = "inactive";
    }
  }
  else {
    currentActivity = "unknown";
  }

  // --- Decide whether to send ---
  unsigned long now = millis();

  if (currentActivity != lastSentActivity) {
    sendPending = true;
  } else if (sendPending) {
    // The activity changed back before the report went out: nothing to report.
    sendPending = false;
  }

  // A failed send is retried more slowly than a normal change/heartbeat.
  unsigned long requiredGap = lastSendFailed ? RETRY_INTERVAL : MIN_SEND_GAP;
  bool gapPassed = !hasAttempted || (now - lastAttemptTime >= requiredGap);
  bool heartbeatDue = hasAttempted && (now - lastSentTime >= HEARTBEAT_INTERVAL);

  if (gapPassed && (sendPending || heartbeatDue)) {
    hasAttempted = true;
    lastAttemptTime = now;

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);

      // The backend expects this exact header, with the raw token (no Bearer).
      http.addHeader("Content-Type", "application/json");
      http.addHeader("X-Device-Token", deviceToken);

      String jsonPayload = "{\"activity\":\"" + currentActivity +
                           "\", \"sensorSummary\":{\"averageAccelerationMagnitude\":" +
                           String(smoothTotalG, 2) + "}}";

      Serial.print(sendPending ? "Sending (activity change): " : "Sending (heartbeat): ");
      Serial.println(jsonPayload);

      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode >= 200 && httpResponseCode < 300) {
        lastSentActivity = currentActivity;
        lastSentTime = now;
        lastSendFailed = false;
        sendPending = false;
        Serial.print("Reading accepted. Server response: ");
        Serial.println(httpResponseCode);
      } else {
        lastSendFailed = true;
        sendPending = true;
        Serial.print("Send failed. Server response: ");
        Serial.println(httpResponseCode);
        Serial.println(http.getString());
      }

      http.end();
    } else {
      lastSendFailed = true;
      sendPending = true;
      Serial.println("WiFi Disconnected. Cannot send data.");
    }
  }

  delay(SENSOR_READ_DELAY); // Read sensor 10 times a second
}
