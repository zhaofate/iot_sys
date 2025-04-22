import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 在保存用户之前，对密码进行加密
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 验证密码的方法
userSchema.methods.comparePassword = async function (candidatePassword:string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 添加分页查询方法
export async function findUsersWithPagination(
  current: number,
  pageSize: number,
  name?: string
) {
  const query: any = {};
  if (name) {
    query.username = new RegExp(name, 'i'); // 模糊查询用户名
  }

  const users = await User.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await User.countDocuments(query);

  return {
    records: users,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + users.length < total,
  };
}

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
