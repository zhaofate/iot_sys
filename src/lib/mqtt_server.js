const aedes = require('aedes')();
const net = require('net');
const {
  DeviceAttribute,
  getDeviceIdByClientId,
  handleAttributeUpdate,
  handleAttributeUpdateAndCheckAlarms,
  saveDeviceMessage,
  setDeviceOnline,
  setDeviceOutline,
} = require('./commonData.js');

// 处理 MQTT 消息
aedes.on('publish', async (packet, client) => {
  if (packet.topic === 'iot/device/attributes/update') {
    try {
      const payload = JSON.parse(packet.payload.toString());

      // 根据 clientId 获取 deviceId
      const deviceId = await getDeviceIdByClientId(client.id);
      if (!deviceId) {
        console.error(`No deviceId found for clientId: ${client.id}`);
        return;
      }

      //保存消息
      saveDeviceMessage(deviceId, JSON.stringify(payload));

      // 遍历 payload 中的每个键值对
      for (const [key, value] of Object.entries(payload)) {
        console.log(
          `Received attribute update for ${key}: ${value}:deviceId=${deviceId}`
        );
        await handleAttributeUpdateAndCheckAlarms(deviceId, key, value);
      }
    } catch (error) {
      console.error('Error parsing payload:', error);
    }
  }
});

// 处理客户端连接
aedes.on('client', async (client) => {
  console.log(`Client connected: ${client ? client.id : 'unknown'}`);

  // 根据 clientId 获取 deviceId
  const deviceId = await getDeviceIdByClientId(client.id);
  await setDeviceOnline(deviceId);
});

// 处理客户端断开连接
aedes.on('clientDisconnect', async (client) => {
  console.log(`Client disconnected: ${client ? client.id : 'unknown'}`);

  // 根据 clientId 获取 deviceId
  const deviceId = await getDeviceIdByClientId(client.id);
  await setDeviceOutline(deviceId);
});

// 处理错误
aedes.on('error', (err, client) => {
  console.error('MQTT Error:', err);
});

// 启动 MQTT 服务端
const server = net.createServer(aedes.handle);
const PORT = 1883;

async function startMqttServer() {
  return new Promise((resolve, reject) => {
    server
      .listen(PORT, () => {
        console.log(`MQTT server is running on port ${PORT}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Failed to start MQTT server:', err);
        reject(err);
      });
  });
}

module.exports = {
  startMqttServer,
};
