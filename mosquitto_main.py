import pandas as pd
import paho.mqtt.client as mqtt
import json
import time
import subprocess

# MQTT broker settings
broker_address = "your_mosquitto_server"
topic = "your_topic"

# Connect to the MQTT broker and subscribe to the topic for WiFi signal strength data
client = mqtt.Client("your_client_id")
client.connect(broker_address)
client.subscribe(topic)

# Process the data
# Handle inaccuracies, errors, and inconsistencies in the data
received_data = pd.DataFrame(columns=['timestamp', 'latitude', 'longitude', 'signal_strength'])

while True:
    # Read data from the WiFi signal strength meter
    output = subprocess.check_output(['sudo', 'iwlist', 'wlan0', 'scanning']).decode('utf-8')
    lines = output.split('\n')
    for i in range(len(lines)):
        if 'Address: ' in lines[i]:
            mac_address = lines[i].split('Address: ')[1]
            signal_strength = int(lines[i+2].split('Signal level=')[1].split(' dBm')[0])
            timestamp = time.time()
            received_data = received_data.append({'timestamp': timestamp, 'mac_address': mac_address, 'signal_strength': signal_strength}, ignore_index=True)

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

    # Wait for 10 seconds before reading data again
    time.sleep(10)

# Clean up and disconnect
client.disconnect()
