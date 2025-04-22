import { connectToDatabase } from '@/lib/db';

import Device from '@/dao/deviceDao';
import DeviceProfile from '@/dao/deviceProfileDao';
import DeviceCredential from '@/dao/deviceCredentialsDao';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ msg: string; data?: any; code: number }>
) {
  if (req.method !== 'DELETE') {
      return res
        .status(400)
        .json({ code: 400, msg: 'Missing required fields' });
  }

  // 处理 DELETE 请求（删除设备）
  try {
    await connectToDatabase();

    const { ids } = req.body;

    if (!ids) {
      return res.status(400).json({ msg: 'Device ID is required', code: 400 });
    }

    // 删除设备凭证
    await DeviceCredential.deleteMany({ deviceId : { $in: ids } });

    // 删除设备
    const deletedDevices = await Device.deleteMany({ _id: { $in: ids } });

    if (!deletedDevices) {
      return res.status(500).json({ msg: 'Device not found' ,code: 500 });
    }

    res.status(200).json({ msg: '删除成功', code: 200,data:'删除成功！' });
  } catch (error: any) {
    res.status(500).json({ msg: 'Server error', data: error.message ,code: 500 });
  }

}

