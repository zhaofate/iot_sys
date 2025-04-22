import { connectToDatabase } from '@/lib/db';
import { DEVICE } from '@/types/device';
import Device from '@/dao/deviceDao';
import DeviceCredential from '@/dao/deviceCredentialsDao';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

// 定义统一的响应类型
interface ApiResponse {
  code: number;
  msg: string;
  data?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ code: 405, msg: 'Method not allowed' });
  }

  // 处理 PUT 请求（更新设备）
  try {
    await connectToDatabase();

    const {
      _id,
      deviceId,
      credentialsType,
      token,
      certificate,
      clientId,
      username,
      password,
    } = req.body;

    if (!deviceId || !_id) {
      return res
        .status(400)
        .json({ code: 400, msg: '没有传输deviceID 或 _id' });
    }

    const updateCred = await DeviceCredential.findByIdAndUpdate(
      _id,
      {
        credentialsType,
        token,
        certificate,
        clientId,
        username,
        password,
      },
      { new: true }
    );
    if (!updateCred) {
      return res.status(400).json({ code: 400, msg: '没有找到设备凭证' });
    } else {
      return res
        .status(200)
        .json({ msg: '修改成功', code: 200, data: '修改成功' });
    }
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: 'Server error' });
  }
}
