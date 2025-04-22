import mongoose from 'mongoose';
// 设备配置
const deviceProfileSchema = new mongoose.Schema({
  id: { type: Object, required: true },
  tenantId: { type: Object, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  defaultDashboardId: { type: Object, required: true },
  type: { type: String, required: true },
  transportType: { type: String, required: true },
});

// 添加分页查询方法
export async function findDeviceProfilesWithPagination(
  current: number,
  pageSize: number,
  name?: string
) {
  const query: any = {};
  if (name) {
    query.name = new RegExp(name, 'i'); // 模糊查询配置名称
  }

  const deviceProfiles = await DeviceProfile.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await DeviceProfile.countDocuments(query);

  return {
    records: deviceProfiles,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + deviceProfiles.length < total,
  };
}

const DeviceProfile = mongoose.models.DeviceProfile || mongoose.model('DeviceProfile', deviceProfileSchema);

export default DeviceProfile;
