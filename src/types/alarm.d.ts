declare namespace Alarm {
  // 定义动态值的接口
  interface DynamicValue {
    sourceType?: string;
    sourceAttribute?: string;
    inherit?: boolean;
  }

  // 定义谓词的接口
  interface Predicate {
    type: string;
    operation: string;
    ignoreCase: boolean;
    value: {
      defaultValue?: string;
      dynamicValue?: DynamicValue;
      useDynamic: boolean;
    };
  }

  // 定义键的接口
  interface Key {
    key: string;
    type: string;
  }

  // 定义条件的接口
  interface Condition {
    id: string;
    key: Key;
    predicate: Predicate;
    valueType: string;
    value?: string;
  }

  // 定义规格的接口
  interface Spec {
    type: string;
    unit: string;
    predicate: Predicate;
  }

  // 定义调度的接口
  interface Schedule {
    type: string;
    dynamicValue?: DynamicValue;
  }

  // 定义创建规则的接口
  interface CreateRule {
    id: string;
    severity: string;
    condition: Condition[];
    schedule: Schedule;
    alarmDetails?: string;
    dashboardId?: string;
  }

  // 定义告警的接口
  interface Alarm {
    _id: string;
    alarmType: string;
    entityId: string;
    propagate: boolean;
    clearRules: any[]; // 假设为空数组
    createRules: CreateRule[];
    propagateRelationTypes: any[]; // 假设为空数组
    propagateToOwner: boolean;
    propagateToTenant: boolean;
  }

  interface AlarmItem {
    alarmType: string;
    severity: string;
    createdTime: number;
    entityId: {
      entityType: string;
      id: string;
    };
    entityName: string;
    userId: {
      entityType: string;
      id: string;
    };
    userName: string;
    actionType: string;
    actionData: {
      relation: {
        from: {
          entityType: string;
          id: string;
        };
        to: {
          entityType: string;
          id: string;
        };
        type: string;
        typeGroup: string;
        additionalInfo?: string;
      };
    };
    actionStatus: string;
    actionFailureDetails?: string;
  }
}

export = Alarm;
