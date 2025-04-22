import mongoose from 'mongoose';
import DeviceProfile from './deviceProfileDao';
import DeviceCredential from './deviceCredentialsDao';
import DeviceAttribute from './deviceAttributesDao';
import DeviceTelemetry from './deviceTelemetryDao';
import { DEVICE } from '@/types/device';

const deviceSchema = new mongoose.Schema({
  createdTime: { type: Number, required: false },
  entityType: { type: String, required: true },
  name: { type: String, required: true },
  label: { type: String, required: false },
  active: { type: Boolean, required: false },
  userId: { type: String, required: false },
  userName: { type: String, required: false },
  userIsPublic: { type: Boolean, required: false },
  isGateway: { type: Boolean, required: false },
  deviceProfileId: { type: Object, required: false },
  additionalInfo: { type: Object, required: false },
  type: { type: String, required: false },
  deviceData: { type: Object, required: false },
  firmwareId: { type: String, required: false },
  softwareId: { type: String, required: false },
});

// 添加分页查询方法
export async function findDevicesWithPagination(
  current: number,
  pageSize: number,
  name?: string
) {
  const query: any = {};
  if (name) {
    query.name = new RegExp(name, 'i'); // 模糊查询设备名称
  }


  const devices = await Device.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await Device.countDocuments(query);

  return {
    records: devices,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + devices.length < total,
  };
}

// 添加获取单个设备详细信息的方法
export async function findDeviceById(deviceId: string): Promise<DEVICE.ListItem | null> {
  const device = await Device.findOne({ 'id.id': deviceId });

  if (!device) {
    return null;
  }


  // 获取设备凭证信息
  const deviceCredentials = await DeviceCredential.find({ 'deviceId': device._id });

  // 获取设备属性信息
  const deviceAttributes = await DeviceAttribute.find({ entityId: device._id });

  // 获取设备遥测信息
  const deviceTelemetry = await DeviceTelemetry.find({ entityId: device._id });

  const detailedDevice: DEVICE.ListItem = {
   ...device,
    deviceCredentials,
    deviceAttributes,
    deviceTelemetry,
  };

  return detailedDevice;
}

const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);

export default Device;
