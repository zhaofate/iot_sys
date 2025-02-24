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
}
