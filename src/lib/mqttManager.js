const mqtt = require('mqtt');
const {DeviceAttribute,getAllDeviceCredentials}= require('./commonData.js');

const mqttClients = {};

async function createMqttClient(deviceId) {
  try {
    const credentials = await getAllDeviceCredentials();
    const credential = credentials.find((cred) => cred.deviceId === deviceId);
    if (!credential) {
      console.error(`No credentials found for device ID: ${deviceId}`);
      return;
    }

    const { clientId, username, password } = credential;

    const options = {
      clientId,
      username,
      password,
      connectTimeout: 60000, // 设置连接超时时间为 60 秒
      keepalive: 30,
    };

    const client = mqtt.connect('mqtt://broker.emqx.io:1883', options);

    client.on('connect', () => {
      console.log(`Connected to MQTT broker for device ID: ${deviceId}`);
      client.subscribe('iot/device/attributes/update', (err) => {
        if (!err) {
          console.log(
            `Subscribed to iot/device/attributes/update for device ID: ${deviceId}`
          );
        }
      });
    });

    client.on('message', (topic, message) => {
      console.log(
        `Received message on topic ${topic} for device ID: ${deviceId}: ${message.toString()}`
      );
      if (topic === 'iot/device/attributes/update') {
        handleAttributeUpdate(deviceId, message.toString());
      }
    });

    client.on('error', (error) => {
      console.error(`MQTT error for device ID: ${deviceId}`, error);
    });

    client.on('close', () => {
      console.log(`MQTT connection closed for device ID: ${deviceId}`);
      delete mqttClients[deviceId];
    });

    mqttClients[deviceId] = client;
  } catch (error) {
    console.error('Error creating MQTT client for device ID:', deviceId, error);
  }
}

async function handleAttributeUpdate(deviceId, message) {
  try {
    const payload = JSON.parse(message);
    const { entityId, key, value } = payload;

    if (!entityId || !key || value === undefined) {
      console.error('Invalid payload:', payload);
      return;
    }

    const updateResult = await DeviceAttribute.updateOne(
      { entityId, key },
      { $set: { value, lastUpdateTs: Date.now() } },
      { upsert: true }
    );

    if (updateResult.modifiedCount > 0 || updateResult.upsertedCount > 0) {
      console.log(`Updated attribute ${key} for entity ${entityId}`);
    } else {
      console.log(`No attribute found to update for entity ${entityId}`);
    }
  } catch (error) {
    console.error('Error handling attribute update:', error);
  }
}

async function initializeMqttClients() {
  try {
    const credentials = await getAllDeviceCredentials();
    for (const credential of credentials) {
      await createMqttClient(credential.deviceId);
    }
  } catch (error) {
    console.error('Error initializing MQTT clients:', error);
  }
}

function getMqttClient(deviceId) {
  return mqttClients[deviceId];
}

module.exports = {
  initializeMqttClients,
  getMqttClient,
};
