import { connectToDatabase } from '@/lib/db';
import { findDevicesWithPagination } from '@/dao/deviceDao';
import { NextApiRequest, NextApiResponse } from 'next';
import { PageResult, Result } from '@/lib/request';

interface GetDevicePageParams {
  current?: number;
  pageSize?: number;
  name?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result<PageResult<any>>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { current = 1, pageSize = 10, name } = req.query as GetDevicePageParams;

  try {
    await connectToDatabase();

    const result = await findDevicesWithPagination(
      parseInt(current as unknown as string, 10),
      parseInt(pageSize as unknown as string, 10),
      name
    );

    res.status(200).json({ code: 200, msg: '获取设备分页信息成功', data: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ code: 500, msg: 'Server error', data: error.message });
    
  }
}
