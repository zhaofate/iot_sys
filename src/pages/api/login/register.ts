import { connectToDatabase } from '@/lib/db';
import User from '@/dao/userDao';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    await connectToDatabase();

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建新用户
    const newUser = new User({
      username,
      password, // 密码会在保存前自动加密
    });

    await newUser.save();

    res.status(201).json({ code: 201, msg: '注册成功', data: { user: newUser } });
  } catch (error: any) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
}
