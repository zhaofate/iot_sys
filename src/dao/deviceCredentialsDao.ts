import mongoose from 'mongoose';

const deviceCredentialsSchema = new mongoose.Schema({
  createdTime: { type: Number, required: true },
  deviceId: { type: String, required: true },
  credentialsType: { type: String, required: true },
  token: { type: String },
  certificate: { type: String },
  clientId: { type: String },
  username: { type: String },
  password: { type: String },
});

const DeviceCredential =
  mongoose.models.DeviceCredential ||
  mongoose.model('DeviceCredential', deviceCredentialsSchema);

export async function getDeviceCredentialsByDeviceId(deviceId: string) {
  return await DeviceCredential.findOne({ deviceId });
}

export async function getAllDeviceCredentials() {
  return await DeviceCredential.find({ credentialsType: 'MQTT_BASIC' });
}

// 将默认导出设置为 DeviceCredential 模型
export default DeviceCredential;

// 兼容 CommonJS 模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeviceCredential;
  module.exports.getDeviceCredentialsByDeviceId =
    getDeviceCredentialsByDeviceId;
  module.exports.getAllDeviceCredentials = getAllDeviceCredentials;
}
