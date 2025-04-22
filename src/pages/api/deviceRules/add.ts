import { connectToDatabase } from '@/lib/db';
import Rule from '@/dao/ruleDao';
import { NextApiRequest, NextApiResponse } from 'next';

// 定义统一的响应类型
interface ApiResponse {
  code: number;
  data?: any;
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
      alarmType,
      propagate,
      createRules,
      entityId,
      propagateRelationTypes,
      propagateToOwner,
      propagateToTenant,
    } = req.body;

    // 验证必填字段
    if (!alarmType ||  !createRules || !entityId) {
      return res
        .status(400)
        .json({ code: 400, msg: 'Missing required fields' });
    }

    // 创建规则对象
    const rule = new Rule({
      alarmType,
      propagate,
      createRules,
      entityId,
      propagateRelationTypes: propagateRelationTypes || [],
      propagateToOwner: propagateToOwner || false,
      propagateToTenant: propagateToTenant || false,
    });

    // 保存规则
    await rule.save();

    res.status(200).json({
      code: 200,
      data: rule,
      msg: 'Rule created successfully',
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ code: 500, msg: 'Server error', data: error.message });
  }
}
