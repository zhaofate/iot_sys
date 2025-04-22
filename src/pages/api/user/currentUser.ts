

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/dao/userDao';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 获取请求头中的 Authorization 令牌
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ message: '未授权' });
  // }
  
  const token = req.cookies.accessToken;  
  if(!token) {
    return res.status(401).json({ message: '未授权' });
  }

  try {
    // 验证和解析 JWT 令牌
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    // 连接到数据库
    await connectToDatabase();

    // 查找用户
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 返回用户信息
    res.status(200).json({ code: 200, msg: '获取用户信息成功', data: user });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '无效的令牌' });
    }
    return res.status(500).json({ message: '服务器错误', error: error.message });
  }
}
