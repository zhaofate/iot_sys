const mongoose = require('mongoose');
const {
  Alarm,
  Device,
  DeviceAttribute,
  DeviceCredential,
  Rule,
  DeviceMessage
}  = require('./modal.ts');
// 保存设备消息
async function saveDeviceMessage(deviceId, msg) {
  try {
    const newMessage = new DeviceMessage({
      type: 'device_message', // 根据实际情况设置类型
      deviceId,
      valueType:'json',
      dataType: 'text',
      msg,
      updateTs: Date.now(),
    });

    await newMessage.save();
  } catch (error) {
    console.error('Error saving device message:', error);
  }
}

// 获取所有设备mqtt连接
async function getAllDeviceCredentials() {
  return await DeviceCredential.find({ credentialsType: 'MQTT_BASIC' });
}

//根据clientid获取设备id
async function getDeviceIdByClientId(clientId) {
  try {
    const credential = await DeviceCredential.findOne({ clientId });
    if (credential) {
      return credential.deviceId;
    } else {
      console.error(`No device found for clientId: ${clientId}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting deviceId by clientId:', error);
    return null;
  }
}

// 处理设备属性更新
async function handleAttributeUpdate(deviceId, key, value) {
  try {
    // 检查设备属性是否存在
    const existingAttribute = await DeviceAttribute.findOne({
      entityId: deviceId,
      key,
    });

    if (existingAttribute) {
      // 更新现有属性
      const updateResult = await DeviceAttribute.updateOne(
        { entityId: deviceId, key },
        { $set: { value, lastUpdateTs: Date.now() } }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(`Updated attribute ${key} for entity ${deviceId}`);
      } else {
        console.log(`No attribute found to update for entity ${deviceId}`);
      }
    } 
  } catch (error) {
    console.error('Error handling attribute update:', error);
  }
}

// 处理设备属性更新并检查预警规则
async function handleAttributeUpdateAndCheckAlarms(
  deviceId,
  key,
  value
) {
  try {
    // 1. 更新设备属性
    const existingAttribute = await DeviceAttribute.findOne({
      entityId: deviceId,
      key,
    });

    if (existingAttribute) {
      await DeviceAttribute.updateOne(
        { entityId: deviceId, key },
        { $set: { value, lastUpdateTs: Date.now() } }
      );

      const device = await Device.findOne({ _id: deviceId });

      // 2. 检查是否有匹配的预警规则
      const rules = await Rule.find({ entityId: deviceId }).exec();

      for (const rule of rules) {
        // 检查每个规则的创建规则条件
        for (const createRule of rule.createRules) {
          // 检查每个条件是否匹配当前更新的属性
          for (const condition of createRule.condition) {


            if (condition.key.key === key) {
              // 检查条件是否满足
              const isConditionMet = checkCondition(condition, value);

              if (isConditionMet) {
                // 创建预警记录
                await createAlarmRecord(device, rule, createRule, key, value,);
              }
            }
          }
        }
      }
    } 

   
  } catch (error) {
    console.error('Error handling attribute update and checking alarms:', error);
    throw error;
  }
}

// 检查条件是否满足
function checkCondition(condition, attributeValue) {
  const predicate = condition.predicate;
  const  defaultValue = condition.predicate.value.defaultValue;
  switch (predicate.operation) {
    case 'EQUAL':
      return attributeValue == defaultValue;
    case 'NOT_EQUAL':
      return attributeValue != defaultValue;
    case 'GREATER':
      return attributeValue > defaultValue;
    case 'LESS':
      return attributeValue < defaultValue;
    case 'GREATER_OR_EQUAL':
      return attributeValue >= defaultValue;
    case 'LESS_OR_EQUAL':
      return attributeValue <= defaultValue;
    case 'CONTAINS':
      return String(attributeValue).includes(String(defaultValue));
    case 'NOT_CONTAINS':
      return !String(attributeValue).includes(String(defaultValue));
    default:
      return false;
  }
}

// 创建预警记录
async function createAlarmRecord(
  device,
  rule,
  createRule,
  attributeKey,
  attributeValue,
){
  const alarmData = {
    alarmType: rule.alarmType,
    createdTime: Date.now(),
    entityId: {
      entityType: 'DEVICE',
      id: device._id,
    },
    severity: createRule.Severity || 'WARNING',
    entityName: device.name,
    userId: {
      entityType: 'SYSTEM',
      id: 'system', // 系统自动触发的
    },
    userName: 'SYSTEM',
    actionType: 'ALARM_TRIGGERED',
    actionData: {
      relation: {
        from: {
          entityType: 'DEVICE',
          id: device._id.toString(),
        },
        to: {
          entityType: 'ALARM_RULE',
          id: rule._id.toString(),
        },
        type: 'TRIGGERED_BY',
        typeGroup: 'ALARM',
        additionalInfo: JSON.stringify({
          attributeKey,
          attributeValue,
          condition: createRule.condition,
          severity: createRule.Severity,
        }),
      },
    },
    actionStatus: 'ACTIVE',
    actionFailureDetails: null,
  };

  await Alarm.create(alarmData);
}

//客户端连接时，设置设备在线状态
async function setDeviceOnline(deviceId) {
  console.log('执行')
  await Device.findByIdAndUpdate(
   deviceId,
   { active: true },
   { new: true, runValidators: true } // 返回更新后的文档并运行验证器
 );
}

async function setDeviceOutline(deviceId) {
 await Device.findByIdAndUpdate(
   deviceId,
   { active: false },
   { new: true, runValidators: true } // 返回更新后的文档并运行验证器
 );
}

module.exports = {
  DeviceAttribute,
  DeviceCredential,
  getAllDeviceCredentials,
  getDeviceIdByClientId,
  handleAttributeUpdate,
  saveDeviceMessage,
  handleAttributeUpdateAndCheckAlarms,
  setDeviceOnline,
  setDeviceOutline,
};
