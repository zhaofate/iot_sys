import mongoose from 'mongoose';

const deviceMessagesSchema = new mongoose.Schema({
  dataType: { type: String, required: true },
  valueType: { type: String, required: true },
  deviceId: { type: String, required: true },
  msg: { type: Object, required: true }, // 使用 Object 而不是 JSON
  updateTs: { type: Number, required: true },
});

const DeviceMessage = mongoose.model('DeviceMessage', deviceMessagesSchema);

// 分页查询消息
async function getMessagesWithPagination(
  current: number,
  pageSize: number,
  deviceId?: string
) {
  const query: any = {};
  if (deviceId) {
    query.deviceId = deviceId; // 根据实体ID查询
  }

  const messages = await DeviceMessage.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await DeviceMessage.countDocuments(query);

  return {
    records: messages,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + messages.length < total,
  };
}

export { DeviceMessage, getMessagesWithPagination };
