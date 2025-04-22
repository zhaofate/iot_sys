import mongoose from 'mongoose';

const deviceTelemetrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: Object, required: true },
});

// 添加分页查询方法
export async function findDeviceTelemetryWithPagination(
  current: number,
  pageSize: number,
  entityId?: string
) {
  const query: any = {};
  if (entityId) {
    query.entityId = entityId; // 根据实体ID查询
  }

  const deviceTelemetry = await DeviceTelemetry.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await DeviceTelemetry.countDocuments(query);

  return {
    records: deviceTelemetry,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + deviceTelemetry.length < total,
  };
}

const DeviceTelemetry = mongoose.models.DeviceTelemetry || mongoose.model('DeviceTelemetry', deviceTelemetrySchema);

export default DeviceTelemetry;
