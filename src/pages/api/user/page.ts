import { connectToDatabase } from '@/lib/db';
import { findUsersWithPagination } from '@/dao/userDao'; // 假设存在这样的函数
import { NextApiRequest, NextApiResponse } from 'next';
import { PageResult, Result } from '@/lib/request';

interface GetUserPageParams {
  current?: number;
  pageSize?: number;
  username?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result<PageResult<any>>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { current = 1, pageSize = 10, username } = req.query as GetUserPageParams;

  try {
    await connectToDatabase();

    const result = await findUsersWithPagination(
      parseInt(current as unknown as string, 10),
      parseInt(pageSize as unknown as string, 10),
      username
    );

    res.status(200).json({ code: 200, msg: '获取用户分页信息成功', data: result });
  } catch (error: any) {
    res.status(500).json({ message: '服务器错误', error: error.message } as any);
  }
}
