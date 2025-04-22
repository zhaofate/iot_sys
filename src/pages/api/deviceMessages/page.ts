import { connectToDatabase } from '@/lib/db';
import { getMessagesWithPagination } from '@/dao/deviceMessageDao';
import { NextApiRequest, NextApiResponse } from 'next';
import { PageResult, Result } from '@/lib/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result<PageResult<any>>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { current = 1, pageSize = 10, deviceId, } = req.query;
  try {
    await connectToDatabase();

    const result = await getMessagesWithPagination(
      parseInt(current as unknown as string, 10),
      parseInt(pageSize as unknown as string, 10),
      deviceId as string,
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
