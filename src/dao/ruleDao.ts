import mongoose from 'mongoose';

// 定义动态值的模式
const dynamicValueSchema = new mongoose.Schema({
  sourceType: { type: String, required: false },
  sourceAttribute: { type: String, required: false },
  inherit: { type: Boolean, required: false },
});

// 定义谓词的模式
const predicateSchema = new mongoose.Schema({
  type: { type: String, required: false },
  operation: { type: String, required: true },
  ignoreCase: { type: Boolean, required: false },
  value: {
    defaultValue: { type: String, required: false },
    dynamicValue: dynamicValueSchema,
    useDynamic: { type: Boolean, required: false },
  },
});

// 定义键的模式
const keySchema = new mongoose.Schema({
  key: { type: String, required: true },
  type: { type: String, required: true },
});

// 定义条件的模式
const conditionSchema = new mongoose.Schema({
  key: keySchema,
  predicate: predicateSchema,
  valueType: { type: String, required: true },
  value: { type: String, required: false },
});

// 定义规格的模式
const specSchema = new mongoose.Schema({
  type: { type: String, required: true },
  unit: { type: String, required: true },
  predicate: predicateSchema,
});

// 定义调度的模式
const scheduleSchema = new mongoose.Schema({
  type: { type: String, required: true },
  dynamicValue: dynamicValueSchema,
});

// 定义创建规则的模式
const createRuleSchema = new mongoose.Schema({
  severity: { type: String, required: true },
  condition: [conditionSchema],
  schedule: scheduleSchema,
  alarmDetails: { type: String, required: false },
  dashboardId: { type: String, required: false },
});

// 定义告警规则的模式
const ruleSchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  alarmType: { type: String, required: true },
  propagate: { type: Boolean, required: false },
  clearRules: { type: Array, required: false }, // 假设为空数组
  createRules: [createRuleSchema],
  propagateRelationTypes: { type: Array, required: false }, // 假设为空数组
  propagateToOwner: { type: Boolean, required: false },
  propagateToTenant: { type: Boolean, required: false },
});

// 创建告警规则模型
const Rule =  mongoose.models.Rule  ||mongoose.model('Rule', ruleSchema) 

// 添加分页查询方法
export async function findDeviceRulesWithPagination(
  current: number,
  pageSize: number,
  entityId: string,
) {
  const query: any = {};
  if (entityId) {
    query.entityId = entityId; // 根据实体ID查询
  }

  const rules = await Rule.find(query)
    .skip((current - 1) * pageSize)
    .limit(pageSize);

  const total = await Rule.countDocuments(query);

  return {
    records: rules,
    total,
    current,
    pages: Math.ceil(total / pageSize),
    hasPrevious: current > 1,
    hasNext: (current - 1) * pageSize + rules.length < total,
  };
}


export default Rule;
