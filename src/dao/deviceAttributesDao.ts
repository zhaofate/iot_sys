import mongoose from 'mongoose';

const deviceAttributesSchema = new mongoose.Schema({
  entityType: { type: String },
  dataType: { type: String, required: true },
  valueType: { type: String, required: true },
  entityId: { type: String, required: true },
  scope: { type: String, required: true },
  key: { type: String, required: true },
  lastUpdateTs: { type: Number },
  value: { type: Object, required: true },
});

// 添加分页查询方法
export async function findDeviceAttributesWithPagination(
  current: number,
  pageSize: number,
  entityId?: string,
  key?: string,
  scope?: string
) {
  const query: any = {};
  if (entityId) {
    query.entityId = entityId; // 根据实体ID查询
  }
  // if (key) 
  // {
  //    query.key = new RegExp(key, 'i');
  // }
  // if(scope) 
  // {
  //   query.scope = scope; // 根据实体ID查询
  // }

  const deviceAttributes = await DeviceAttribute.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await DeviceAttribute.countDocuments(query);

  return {
    records: deviceAttributes,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + deviceAttributes.length < total,
  };
}

const DeviceAttribute = mongoose.models.DeviceAttribute || mongoose.model('DeviceAttribute', deviceAttributesSchema);

export default DeviceAttribute;
