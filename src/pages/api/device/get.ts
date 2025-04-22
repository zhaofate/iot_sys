import { connectToDatabase } from '@/lib/db';
import Device  from '@/dao/deviceDao';
import { NextApiRequest, NextApiResponse } from 'next';
import { Result } from '@/lib/request';
import {DEVICE} from '@/types/device';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result<any>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { deviceId } = req.query as { deviceId: string };
 
  try {
    await connectToDatabase();

    const result = await Device.findOne({ _id:deviceId });
    if(result){
        res.status(200).json({ code: 200, msg: '获取详情', data: result });
    }
    else {
     res
       .status(500)
       .json({ code: 500, msg: '没有设备',  });
    }

   
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: 'Server error', data: error.message });
  }
}
