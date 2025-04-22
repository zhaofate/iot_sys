import { connectToDatabase } from '@/lib/db';
import DeviceAttribute from '@/dao/deviceAttributesDao';
import { NextApiRequest, NextApiResponse } from 'next';
import { PageResult, Result } from '@/lib/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result<any>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { entityId } = req.query;
  try {
    await connectToDatabase();

    const result = await DeviceAttribute.find(
      { entityId },
      {
        _id:1,
        key:1,
      }
    );

    res
      .status(200)
      .json({ code: 200, msg: '获取设备分页信息成功', data: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ code: 500, msg: 'Server error', data: error.message });
  }
}
