import { connectToDatabase } from '@/lib/db';
import DeviceCredential  from '@/dao/deviceCredentialsDao';
import { NextApiRequest, NextApiResponse } from 'next';
import { Result } from '@/lib/request';
import {DEVICE} from '@/types/device';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result<DEVICE.deviceCredentialsInfo>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { deviceId } = req.query as { deviceId: string };
 
  try {
    await connectToDatabase();

    const result = await DeviceCredential.findOne({ deviceId });
    if(result){
        res.status(200).json({ code: 200, msg: '获取详情', data: result });
    }
    else {
     res
       .status(500)
       .json({ code: 500, msg: '没有凭证',  });
    }

   
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: 'Server error', data: error.message });
  }
}
