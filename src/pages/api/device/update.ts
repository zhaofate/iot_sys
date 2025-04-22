import { connectToDatabase } from '@/lib/db';
import { DEVICE } from '@/types/device';
import Device from '@/dao/deviceDao';
import DeviceCredential from '@/dao/deviceCredentialsDao';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

// 定义统一的响应类型
interface ApiResponse {
  code: number;
  msg: string;
  data?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ code:405,msg: 'Method not allowed' });
  }

 // 处理 PUT 请求（更新设备）
 try {
    await connectToDatabase();

    const {
      id,
      name,
      label,
      customerId,
      isGateway,
      description,
    } = req.body;

    if (!id) {
      return res.status(400).json({ code:400,msg: 'Device ID is required' });
    }


    // 获取客户信息（如果存在）
     let customer = null;
    // if (customerId) {
    //   customer = await DeviceCredential.findOne({ '_id': customerId });
    //   if (!customer) {
    //     return res.status(400).json({ code:'',msg: 'Customer not found' });
    //   }
    // }

    // 更新设备
    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      {
        name,
        label: label || '',
        isGateway: isGateway || false,
        description: description || '',
        // customerTitle: customer ? customer.customerTitle : '',
        // customerIsPublic: customer ? customer.customerIsPublic : false,
        // customerId: customer ? customerId : null,
      },
      { new: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ code:404,msg: 'Device not found' });
    }
    else{
      return res.status(200).json({ msg: 'Device created successfully',code:200, data:'修改成功'});
    }
  } catch (error: any) {
        res.status(500).json({ code:500,msg: 'Server error',});
      }

}

