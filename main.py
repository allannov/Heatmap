import pandas as pd
import paho.mqtt.client as mqtt
from tb_device_mqtt import TBDeviceMqttClient
#from google.cloud import storage
import json

# MQTT broker settings
broker_address = "your_thingsboard_server"
topic = "your_topic"

# Google Cloud Storage settings
#storage_bucket = "your_bucket_name"

try:
    client = TBDeviceMqttClient(client_id="your_client_id")
except AttributeError:
    print("Error initializing TBDeviceMqttClient: AttributeError")

try:
    client.connect(broker_address)
except ConnectionError:
    print("Error connecting to the MQTT broker: ConnectionError")

try:
    client.subscribe(topic)
except ConnectionError:
    print("Error subscribing to the topic: ConnectionError")

# Set up the MQTT client
mqtt_client = mqtt.Client()
try:
    mqtt_client.connect(broker_address)
except ConnectionError:
    print("Error connecting to the MQTT broker: ConnectionError")

# Process the data
# Handle inaccuracies, errors, and inconsistencies in the data
try:
    received_data = pd.DataFrame(columns=['timestamp', 'latitude', 'longitude', 'signal_strength', 'signal_to_noise_ratio'])
except AttributeError:
    print("Error initializing DataFrame: AttributeError")

# Save the received data as a CSV file
try:
    received_data.to_csv('received_data.csv', index=False)
except Exception as e:
    print("Error saving received data as a CSV file: {e}")

# Send the CSV file to the MQTT broker
try:
    with open('received_data.csv', 'rb') as file:
        file_content = file.read()
        mqtt_client.publish(topic, file_content, qos=1)
except Exception as e:
    print("Error sending data to the MQTT broker: {e}")

# Clean up and disconnect
mqtt_client.disconnect()
client.disconnect()
