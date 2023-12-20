import pandas as pd
import paho.mqtt.client as mqtt
import json

# MQTT broker settings
broker_address = "your_mosquitto_server"
topic = "your_topic"

# Connect to the MQTT broker and subscribe to the topic for WiFi signal strength data
client = mqtt.Client("your_client_id")
client.connect(broker_address)
client.subscribe(topic)

# Process the data
# Handle inaccuracies, errors, and inconsistencies in the data
received_data = pd.DataFrame(columns=['timestamp', 'latitude', 'longitude', 'signal_strength', 'signal_to_noise_ratio'])

# Save the received data as a CSV file
try:
    received_data.to_csv('received_data.csv', index=False)
    print("Received data saved as a CSV file")
except Exception as e:
    print(f"Error saving received data as a CSV file: {e}")

# Send the CSV file to the MQTT broker
with open('received_data.csv', 'rb') as file:
    file_content = file.read()
    client.publish(topic, file_content, qos=1)
    print("Received data sent to the MQTT broker")

# Clean up and disconnect
client.disconnect()
