import { connectToDatabase } from '@/lib/db';
import Rule from '@/dao/ruleDao';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ msg: string; data?: any; code: number }>
) {
  if (req.method !== 'DELETE') {
    return res.status(400).json({ code: 400, msg: 'Missing required fields' });
  }

  // 处理 DELETE 请求（删除设备）
  try {
    await connectToDatabase();

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ msg: 'Rule ID is required', code: 400 });
    }

    const deletedRule = await Rule.deleteOne({ _id: id });

    if (!deletedRule) {
      return res.status(500).json({ msg: 'Device not found', code: 500 });
    }

    res.status(200).json({ msg: '删除成功', code: 200, data: '删除成功！' });
  } catch (error: any) {
    res
      .status(500)
      .json({ msg: 'Server error', data: error.message, code: 500 });
  }
}
