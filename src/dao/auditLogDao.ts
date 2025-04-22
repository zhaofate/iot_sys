import mongoose from 'mongoose';

// 定义审计日志的 Mongoose 模式
const auditLogSchema = new mongoose.Schema({
  createdTime: { type: Number, required: false },
  entityId: { type: String, required: false },
  entityType: { type: String, required: false },
  entityName: { type: String, required: false },
  userId: {
    entityType: { type: String, required: false },
    id: { type: String, required: false },
  },
  userName: { type: String, required: false },
  actionType: { type: String, required: false },
  actionData: {
    relation: {
      from: {
        entityType: { type: String, required: false },
        id: { type: String, required: false },
      },
      to: {
        entityType: { type: String, required: false },
        id: { type: String, required: false },
      },
      type: { type: String, required: false },
      typeGroup: { type: String, required: false },
      additionalInfo: { type: String, required: false },
    },
  },
  actionStatus: { type: String, required: false },
  actionFailureDetails: { type: String, required: false },
});

// 添加分页查询方法
export async function findAuditLogsByPagination(
  current: number,
  pageSize: number,
  entityId: string
) {
  const query: any = {};
  if (entityId) {
    query.entityId = entityId; // 初始化 entityId 为对象
  }

  const auditLogs = await AuditLog.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await AuditLog.countDocuments(query);

  return {
    records: auditLogs,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + auditLogs.length < total,
  };
}

// 添加审计日志
export async function addAuditLog(
  entityId: string,
  entityType: string,
  entityName: string,
  userId: string,
  userName: string,
  actionType: string,
  actionStatus: string,
) {
  return await AuditLog.create({
    createdTime: Date.now(),
    entityId,
    entityType,
    entityName,
    userId,
    userName,
    actionType,
    actionStatus,
  });
}

const AuditLog =
  mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
