const { createServer } = require('http');
const mongoose = require('mongoose');
const { parse } = require('url');
const next = require('next');
const { initializeMqttClients } = require('./mqttManager.js'); // 导入 MQTT 管理器
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { startMqttServer } = require('./mqtt_server.js');

app.prepare().then(async () => {
  // 连接到 MongoDB
  try {
    await mongoose.connect(
      'mongodb://user:123456@localhost:27017/iot_sys?retryWrites=true&w=majority'
    );
    cachedDb = mongoose.connection.db;
    console.log('MongoDB 连接成功');
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1); // 如果无法连接到数据库，退出进程
  }

  // 启动 MQTT 服务端
  startMqttServer()
    .then(() => {
      console.log('MQTT 服务端已启动');

      // // 初始化 MQTT 客户端
      // initializeMqttClients()
      //   .then(() => {
      //     console.log('所有 MQTT 客户端已初始化');
      //   })
      //   .catch((error) => {
      //     console.error('初始化 MQTT 客户端失败:', error);
      //     process.exit(1); // 如果无法初始化 MQTT 客户端，退出进程
      //   });
    })
    .catch((error) => {
      console.error('启动 MQTT 服务端失败:', error);
      process.exit(1); // 如果无法启动 MQTT 服务端，退出进程
    });

  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells the query string to be parsed into an object.
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/a') {
      app.render(req, res, '/a', query);
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');

    // 初始化 MQTT 客户端
    // 在服务器启动时初始化MQTT客户端
    // initializeMqttClients()
    //   .then(() => {
    //     console.log('All MQTT clients have been initialized.');
    //   })
    //   .catch((error) => {
    //     console.error('Failed to initialize MQTT clients:', error);
    //     process.exit(1); // 如果无法初始化 MQTT 客户端，退出进程
    //   });
  });
});
