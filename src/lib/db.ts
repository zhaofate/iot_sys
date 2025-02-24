// src/lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('请定义 MONGODB_URI 环境变量');
}

let cachedDb: any = null;

export const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        cachedDb = mongoose.connection.db;
        console.log('MongoDB 连接成功');
    } catch (error) {
        console.error('MongoDB 连接失败:', error);
        throw new Error('MongoDB 连接失败');
    }
};
