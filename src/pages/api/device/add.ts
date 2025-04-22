import { connectToDatabase } from '@/lib/db';
import { DEVICE } from '@/types/device';
import Device from '@/dao/deviceDao';
import DeviceCredential from '@/dao/deviceCredentialsDao';
import { NextApiRequest, NextApiResponse } from 'next';

// 定义统一的响应类型
interface ApiResponse {
  code: number;
  data?: DEVICE.Item;
  msg: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, msg: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const {
      name,
      label,
      userId,
      isGateway,
      description,
      credentialsType,
      token,
      certificate,
      id,
      username,
      password,
    } = req.body;

    // 验证必填字段
    if (!name || !credentialsType) {
      return res
        .status(400)
        .json({ code: 400, msg: 'Missing required fields' });
    }

    // 检查设备名称是否已存在
    const existingDevice = await Device.findOne({ name });
    if (existingDevice) {
      return res
        .status(400)
        .json({ code: 400, msg: 'Device name already exists' });
    }

    // 获取客户信息（如果存在）
    // TODO: 获取用户信息
    // let customer = null;
    // if (customerId) {
    //   customer = await Device.findOne({ '_id': customerId });
    //   if (!customer) {
    //     return res.status(400).json({ code: 400, msg: 'Customer not found' });
    //   }
    // }

    // 创建设备
    const device = new Device({
      createdTime: Date.now(),
      name,
      label: label || '',
      active: false,
      userId: userId || '',
      userName: userId || '',
      userIsPublic: false,
      isGateway: isGateway || false,
      additionalInfo: {},
      deviceData: {},
      firmwareId: '',
      softwareId: '',
      externalId: {},
      description: description || '',
      entityType: 'DEVICE',
    });

    await device.save();

    // 创建设备凭证
    let deviceCredentials;
    switch (credentialsType) {
      case 'Access Token':
        if (!token) {
          return res
            .status(400)
            .json({
              code: 400,
              msg: 'Token is required for Access Token credentials',
            });
        }
        deviceCredentials = new DeviceCredential({
          deviceId: device.id,
          credentialsType: 'ACCESS_TOKEN',
          token: token,
          createdTime: Date.now(), // 设置创建时间
        });
        break;
      case 'X.509':
        if (!certificate) {
          return res
            .status(400)
            .json({
              code: 400,
              msg: 'Certificate is required for X.509 credentials',
            });
        }
        deviceCredentials = new DeviceCredential({
          deviceId: device.id,
          credentialsType: 'X509_CERTIFICATE',
          certificate: certificate,
          createdTime: Date.now(), // 设置创建时间
        });
        break;
      case 'MQTT Basic':
        if (!id || !username || !password) {
          return res
            .status(400)
            .json({
              code: 400,
              msg: 'ID, username, and password are required for MQTT Basic credentials',
            });
        }
        deviceCredentials = new DeviceCredential({
          deviceId: device.id,
          credentialsType: 'MQTT_BASIC',
          clientId: id,
          username: username,
          password: password,
          createdTime: Date.now(), // 设置创建时间
        });
        break;
      default:
        return res
          .status(400)
          .json({ code: 400, msg: 'Invalid credentials type' });
    }

    await deviceCredentials.save();

    res
      .status(200)
      .json({ code: 200, data: device, msg: 'Device created successfully' });
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: 'Server error' });
  }
}
