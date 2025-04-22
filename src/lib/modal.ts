const mongoose = require('mongoose');

// 定义告警预警的模式
const alarmSchema = new mongoose.Schema({
  alarmType: { type: String, required: false },
  createdTime: { type: Number, required: false },
  entityId: {
    entityType: { type: String, required: false },
    id: { type: String, required: false },
  },
  severity: { type: String, required: false },
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
const Alarm = mongoose.models.Alarm || mongoose.model('Alarm', alarmSchema);


const deviceSchema = new mongoose.Schema({
  createdTime: { type: Number, required: false },
  entityType: { type: String, required: true },
  name: { type: String, required: true },
  label: { type: String, required: false },
  active: { type: Boolean, required: false },
  userId: { type: String, required: false },
  userName: { type: String, required: false },
  userIsPublic: { type: Boolean, required: false },
  isGateway: { type: Boolean, required: false },
  deviceProfileId: { type: Object, required: false },
  additionalInfo: { type: Object, required: false },
  type: { type: String, required: false },
  deviceData: { type: Object, required: false },
  firmwareId: { type: String, required: false },
  softwareId: { type: String, required: false },
});
const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);


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
const DeviceAttribute =
  mongoose.models.DeviceAttribute ||
  mongoose.model('DeviceAttribute', deviceAttributesSchema);

const deviceCredentialsSchema = new mongoose.Schema({
  createdTime: { type: Number, required: true },
  deviceId: { type: String, required: true },
  credentialsType: { type: String, required: true },
  token: { type: String },
  certificate: { type: String },
  clientId: { type: String },
  username: { type: String },
  password: { type: String },
});

const DeviceCredential =
  mongoose.models.DeviceCredential ||
  mongoose.model('DeviceCredential', deviceCredentialsSchema);

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

const deviceMessagesSchema = new mongoose.Schema({
  dataType: { type: String, required: true },
  valueType: { type: String, required: true },
  deviceId: { type: String, required: true },
  msg: { type: Object, required: true }, // 使用 Object 而不是 JSON
  updateTs: { type: Number, required: true },
});

const DeviceMessage = mongoose.model('DeviceMessage', deviceMessagesSchema);
module.exports = {
  Alarm,
  Device,
  DeviceAttribute,
  DeviceCredential,
  Rule,
  DeviceMessage,
};
