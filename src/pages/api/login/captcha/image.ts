// src/handler/verificationCodeHandler.ts
import { VerificationCodeDao } from '@/dao/captchaDao';
import svgCaptcha from 'svg-captcha';

export interface Captcha {
    key: string;
    code: string;
}

const verificationCodeDao = new VerificationCodeDao();

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        const captcha = svgCaptcha.create();
        const captchaData: Captcha = {
            key: req.query.key || new Date().toISOString(), // 假设 key 是通过查询参数传递的，如果未提供则生成一个唯一的 key
            code: captcha.text,
        };

        try {
             await verificationCodeDao.createVerificationCode(captchaData.key, captchaData.code);
            // 将 SVG 转换为 Base64 格式
            const base64SVG = Buffer.from(captcha.data).toString('base64');
            res.status(200).json({ code: 200, msg: '验证码获取成功', data: base64SVG});
        } catch (error) {
            res.status(500).json({ code: 500, msg: '保存验证码失败', data: error });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
