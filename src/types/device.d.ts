// @ts-ignore
/* eslint-disable */

import { TablePaginationConfig } from 'antd';
import { FilterValue } from 'antd/es/table/interface';

declare namespace DEVICE {
  type ListItem = {
    createdTime: number;
    name: string;
    label: string;
    active: boolean;
    customerId: string;
    description:string;
    customerTitle: string;
    customerIsPublic: boolean;
    isGateway: boolean;
    isCover:boolean;
    _id: string;
    deviceProfileId: object;
    additionalInfo: object;
  };
  type Item = {
    id: {
      entityType: string;
      id: string;
    };
    createdTime: number;
    additionalInfo?: {
      gateway: boolean;
      overwriteActivityTime: boolean;
      description: string;
    };
    tenantId?: {
      entityType: string;
      id: string;
    };
    customerId?: {
      entityType: string;
      id: string;
    };
    name: string;
    type?: string;
    label?: string;
    deviceProfileId?: {
      entityType: string;
      id: string;
    };
    deviceData?: {
      configuration: {
        type: string;
      };
      transportConfiguration: {
        type: string;
      };
    };
    firmwareId: string;
    softwareId: string;
    externalId?: {
      entityType: string;
      id: string;
    };
    customerTitle?: string;
    customerIsPublic?: boolean;
    deviceProfileName?: string;
    active?: boolean;
  };
  // 设备配置响应数据格式
 interface deviceProfileInfo {
    id: {
      entityType: string;
      id: string;
    };
    tenantId: {
      entityType: string;
      id: string;
    };
    name: string;
    image: string;
    defaultDashboardId: {
      entityType: string;
      id: string;
    };
    type: string;
    transportType: string;
  }
  
  // 软固件列表请求参数
   interface profileURLParams {
    id: string;
    obj?: {
      pageSize: number;
      page: number;
      sortProperty?: string;
      sortOrder?: string;
    };
  }
  
  // 添加设备请求基础格式
   interface addBasicDeviceParams {
    name: string;
    label?: string;
    deviceProfileId: {
      entityType: string;
      id: string;
    };
    additionalInfo: {
      gateway: boolean;
      overwriteActivityTime: boolean;
      description: string;
    };
    customerId: {
      entityType: string;
      id: string;
    } | null;
  }
  
  
  // 对应设备凭证响应数据格式
  interface deviceCredentialsInfo  {
    _id: string;
    deviceId: string;
    credentialsType: string;
    token: string;
    certificate:string;
    clientId:string;
    username:string;
    password:string;
  }
  
  // 设备属性表格请求参数
   type attributesParams = {
    entityType: string;
    entityId?: string;
    scope?: string;
    key?: string;
    responseDataType?: string;
    sortProperty?: string;
    sortOrder?: string;
  };

  // 属性响应数据
   interface attributesResponse {
     _id: string;
     dataType: string;
     valueType?: string;
     lastUpdateTs: number;
     key: string;
     scope: string;
     value: string | number | boolean | JSON;
   }
  
  // 保存属性请求参数
   interface saveAttributesParams {
    id?:string,
    dataType: string;
     valueType: string;
     entityId?: string;
     scope: string;
     key: string;
     value?: any;
   }
// 设备消息
 interface deviceMessage {
   _id?: string;
   type: string;
   entityId?: string;
   msg: object;
   updateTs:number;
 }


  // 保存遥测请求参数
   interface saveTelemetryParams {
    entityType: string;
    entityId?: string;
    key: string;
    value?: any;
  }


  // 设备告警请求参数
   interface alarmsParams {
    entityType: string;
    entityId: string;
    pageParameters: BasicPageParams & {
      statusList?: string;
      severityList?: string;
      typeList?: string;
      assigneeId?: string;
      textSearch?: string;
      startTime?: number;
      endTime?: number;
      sortProperty?: string;
      sortOrder?: string;
    };
  }

  
  // 保存关联请求参数
   interface saveRelationParams {
    type: string;
    additionalInfo: any;
    typeGroup: string;
    from: {
      entityType: string;
      id?: string;
    };
    to: {
      entityType: string;
      id?: string;
    };
  }
  // 删除关联请求参数
   interface deleteRelationParams {
    fromId?: string;
    fromType: string;
    relationType: string;
    toId?: string;
    toType: string;
  }
  // 获取关联from请求参数
   interface relationByFromParams {
    fromId?: string;
    fromType: string;
    relationTypeGroup?: string;
  }
  // 获取关联to请求参数
   interface relationByToParams {
    toId?: string;
    toType: string;
    relationTypeGroup?: string;
  }
  // 获取关联响应数据
   interface relationResponse {
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
    additionalInfo: string;
    fromName: string;
    toName: string;
  }
  // 获取关联表格清洗后数据
   interface relationFromTableItem {
    type: string;
    fromEntityType: string;
    fromEntityName: string;
    fromId: string;
    jsonValue: any;
    id: string;
  }
   interface relationToTableItem {
    type: string;
    toEntityType: string;
    toEntityName: string;
    toId: string;
    jsonValue: any;
    id: string;
  }
  // 审计日志请求参数
   interface auditLogParams {
    entityType: string;
    entityId?: string;
    pageParameters: entityTableParams & {
      startTime?: number;
      endTime?: number;
    };
  }
  // 审计日志响应数据
   interface auditLogResponse {
    id: {
      id: string;
    };
    createdTime: number;
    tenantId: {
      entityType: string;
      id: string;
    };
    customerId: {
      entityType: string;
      id: string;
    };
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
        additionalInfo: string;
      };
    };
    actionStatus: string;
    actionFailureDetails: string;
  }
  
  // 获取事件请求参数
   interface eventParams {
    pageParameters: entityTableParams & {
      startTime?: number;
      endTime?: number;
    };
    startTime?: number;
    endTime?: number;
    tenantId?: string;
    entityType: string;
    entityId?: string;
    eventType: string;
  }
}
