import mongoose, { Schema, Document } from 'mongoose';

export interface ICaptcha extends Document {
    code: string;
}

const CaptchaSchema: Schema = new Schema({
    code: { type: String, required: true },
});

const Captcha = mongoose.models.Captcha || mongoose.model<ICaptcha>('Captcha', CaptchaSchema);
export default Captcha;
