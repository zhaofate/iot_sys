import { connectToDatabase } from '@/lib/db';
import { DEVICE } from '@/types/device';           
import Device from '@/dao/deviceDao';
import DeviceAttributes from '@/dao/deviceAttributesDao';
import { NextApiRequest, NextApiResponse } from 'next';
 

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

    const { key, value, entityId } = req.body;

    // 更新设备
    const updatedDeviceAttributes = await DeviceAttributes.findByIdAndUpdate(
      entityId,
      {
        value,
        lastUpdateTs: new Date(),
      },
      { new: true }
    );

    if (!updatedDeviceAttributes) {
      return res.status(404).json({ code: 404, msg: 'Device not found' });
    } else {
      return res.status(200).json({
        msg: 'Device created successfully',
        code: 200,
        data: '修改成功',
      });
    }
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: 'Server error' });
  }
}
