import { connectToDatabase } from '@/lib/db';
import User from '@/dao/userDao';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { VerificationCodeDao } from '@/dao/captchaDao';

interface LoginRequestBody {
  username: string;
  password: string;
  key:string;
  code:string;
}
const verificationCodeDao = new VerificationCodeDao();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password ,key,code} = req.body as LoginRequestBody;

  try {
    await connectToDatabase();

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '用户不存在' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '密码错误' });
    }

    // 验证码
    const isCode = await verificationCodeDao.matchVerificationCode( key, code );
    if (!isMatch) {
      return res.status(400).json({ message: '验证码错误' });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(200).json({ code: 200, msg: '登录成功', data:{
        accessToken: token,
        user: user,
    }
    });
  } catch (error: any) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
}
