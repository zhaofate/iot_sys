// src/dao/verificationCodeDao.ts
import mongoose, { Document, Model } from 'mongoose';
import { connectToDatabase } from '../lib/db';

export interface VerificationCodeDocument extends Document {
    key: string;
    code: string;
    expiresAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 15 * 60 * 1000), // 验证码有效期15分钟
    },
});

let VerificationCode: Model<VerificationCodeDocument>;

if (!mongoose.models.VerificationCode) {
    VerificationCode = mongoose.model<VerificationCodeDocument>('VerificationCode', verificationCodeSchema);
} else {
    VerificationCode = mongoose.models.VerificationCode as Model<VerificationCodeDocument>;
}

export class VerificationCodeDao {
    private model: Model<VerificationCodeDocument>;

    constructor() {
        this.model = VerificationCode;
    }

    async createVerificationCode(key: string, code: string): Promise<void>{
        await connectToDatabase();

        // 检查是否已经存在具有相同 key 的验证码
        const existingCode = await this.model.findOne({ key, }).exec();
        // 如果存在但已过期，先删除旧的验证码

        if (existingCode) {
          await this.model.deleteOne({ key }).exec();   
        }
        // 保存新的验证码
         await this.model.create({ key, code });
    }

    async getVerificationCodeByKey(key: string): Promise<VerificationCodeDocument | null> {
        await connectToDatabase();
        return await this.model.findOne({ key }).exec();
    }

    async deleteVerificationCodeByKey(key: string): Promise<void> {
        await connectToDatabase();
        await this.model.deleteOne({ key }).exec();
    }

    async matchVerificationCode(key: string, code: string): Promise<boolean> {
        await connectToDatabase();
        
        // 查找验证码
        const verificationCode = await this.model.findOne({ key }).exec();
        
        if (!verificationCode) {
            return false; // 如果找不到验证码，返回 false
        }
        
        // 检查验证码是否匹配
        if (verificationCode.code !== code) {
            return false; // 验证码不匹配，返回 false
        }
        
        // 检查验证码是否过期
        if (verificationCode.expiresAt < new Date()) {
            await this.deleteVerificationCodeByKey(key); // 如果过期，删除验证码
            return false; // 验证码过期，返回 false
        }
        
        // 验证码匹配且未过期，返回 true
        return true;
    }
    
}
