import mongoose from 'mongoose';

// 定义告警预警的模式
const alarmSchema = new mongoose.Schema({
  alarmType: { type: String, required: true },
  createdTime: { type: Number, required: true },
  entityId: {
    entityType: { type: String, required: true },
    id: { type: String, required: true },
  },
  severity: { type: String, required: true },
  entityName: { type: String, required: true },
  userId: {
    entityType: { type: String, required: true },
    id: { type: String, required: true },
  },
  userName: { type: String, required: true },
  actionType: { type: String, required: true },
  actionData: {
    relation: {
      from: {
        entityType: { type: String, required: true },
        id: { type: String, required: true },
      },
      to: {
        entityType: { type: String, required: true },
        id: { type: String, required: true },
      },
      type: { type: String, required: true },
      typeGroup: { type: String, required: true },
      additionalInfo: { type: String, required: false },
    },
  },
  actionStatus: { type: String, required: true },
  actionFailureDetails: { type: String, required: false },
});

// 添加分页查询方法
export async function findAlarmWithPagination(
  current: number,
  pageSize: number,
  entityId?: string,
) {
  const query: any = {};
  if (entityId) {
    query.entityId = { entityType: 'DEVICE', id: entityId }; // 初始化 entityId 为对象
  }
  // if (key) 
  // {
  //    query.key = new RegExp(key, 'i');
  // }
  // if(scope) 
  // {
  //   query.scope = scope; // 根据实体ID查询
  // }

  const alarms = await Alarm.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await Alarm.countDocuments(query);

  return {
    records: alarms,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + alarms.length < total,
  };
}

// 创建告警预警模型
const Alarm =  mongoose.models.Alarm || mongoose.model('Alarm', alarmSchema);

export default Alarm;
