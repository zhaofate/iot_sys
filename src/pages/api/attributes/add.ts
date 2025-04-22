import { connectToDatabase } from '@/lib/db';
import { DEVICE } from '@/types/device';
import  DeviceAttribute from '@/dao/deviceAttributesDao';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

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
      entityId,
           key,
           value,
           dataType,
           valueType,
    } = req.body;

    // 验证必填字段
    // if (!entityId || !key || !value || !type) {
    //   return res
    //     .status(400)
    //     .json({ code: 400, msg: 'Missing required fields' });
    // }

    // 检查设备名称是否已存在
    const existingDevice = await DeviceAttribute.findOne({ key });
    if (existingDevice) {
      return res
        .status(400)
        .json({ code: 400, msg: 'Attribute name already exists' });
    }


    // 创建设备
    const deviceAttribute = new DeviceAttribute({
      lastUpdateTs: Date.now(),
      entityId,
      key,
      dataType,
      valueType,
      value: value || '',
      scope: 'SHARED_SCOPE',
    });

    await deviceAttribute.save();

    res
      .status(200)
      .json({
        code: 200,
        data: deviceAttribute,
        msg: 'Attribute created successfully',
      });
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: 'Server error' });
  }
}
