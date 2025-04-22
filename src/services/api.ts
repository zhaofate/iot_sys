import { getAccessToken } from '@/lib/cache';
import { PageResult, request } from '@/lib/request';
import Alarm from '@/types/alarm';
import { DEVICE } from '@/types/device';
import { API } from '@/types/typings';

/** 获取当前的用户 GET /user/currentUser */
export async function currentUser() {
  return request.get<API.CurrentUser>('/user/currentUser');
}

/** 注册接口 POST /login/register*/
export async function register(body: API.LoginParams) {
  return request.post(`/login/register`, body);
}

/** 登录接口 POST /login/list */
export async function login(body: API.LoginParams) {
  return request.post(`/login/${body.type}`, body);
}

/** 退出登录接口 POST /login/outLogin */
export async function outLogin() {
  return request.get('/login/outLogin', { accessToken: getAccessToken() });
}

export async function getFakeImageCaptcha(params: Partial<API.CaptchaParams>) {
  return request.get('login/captcha/image', params);
}

export async function getFakeSmsCaptcha(params: Partial<API.CaptchaParams>) {
  return request.post('login/captcha/sms', params);
}

export async function updateUser(params: Partial<API.User>) {
  return request.put('/user/update', params);
}

export async function addUser(params: Partial<API.User>) {
  return request.post('/user/save', params);
}

export async function removeUser(params: { ids: number[] }) {
  return request.delete('/user/delete', params);
}

export async function fetchUserPage(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  /** 任务名称 */
  name?: string;
}) {
  return request.get<PageResult<API.User>>('/user/page', params);
}

export async function updateDevice(params: Partial<DEVICE.ListItem>) {
  return request.put('/device/update', params);
}

export async function addDevice(params: Partial<DEVICE.Item>) {
  return request.post('/device/add', params);
}

export async function removeDevice(params: { ids: number[] }) {
  return request.delete('device/delete', params);
}

export async function fetchDevicePage(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  deviceId?: string;
  deviceProfileId?: string;
  active?: boolean;
}) {
  return request.get<PageResult<DEVICE.ListItem>>('device/page', params);
}
export async function getDeviceDetail(params: { deviceId: string }) {
  return request.get<any>('/device/get', params);
}

//凭证
export async function getDeviceCredential(params: { deviceId: string }) {
  return request.get<DEVICE.deviceCredentialsInfo>('/credentials/get', params);
}

export async function updateDeviceCredential(
  params: DEVICE.deviceCredentialsInfo
) {
  return request.put('/credentials/update', params);
}

//设备属性
export async function fetchDeviceAttributesPage(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  entityId?: string;
  entityType?: string;
  scope?: string;
}) {
  return request.get<PageResult<DEVICE.attributesResponse>>(
    'attributes/page',
    params
  );
}
export async function addDeviceAttributes(
  params: Partial<DEVICE.saveAttributesParams>
) {
  return request.post('/attributes/add', params);
}

export async function removeDeviceAttributes(params: { ids: string[] }) {
  return request.delete('attributes/delete', params);
}

export async function fetchAttributesOptions(params: { entityId: string }) {
  return request.get<{_id:string,key:string}[]>('/attributes/options', params);
}

//设备消息
export async function fetchDeviceMessagesPage(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  deviceId?: string;
}) {
  return request.get<PageResult<DEVICE.deviceMessage>>(
    'deviceMessages/page',
    params
  );
}

//设备规则
export async function fetchDeviceRulesPage(params: {
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
  entityId: string;
}) {
  return request.get<PageResult<Alarm.Alarm>>('deviceRules/page', params);
}

//添加规则
export async function addDeviceRule(params: Alarm.Alarm) {
  return request.post('/deviceRules/add', params);
}
export async function removeDeviceRule(params: { id: string }) {
  return request.delete('/deviceRules/delete', params);
}

//预警
export async function fetchAlarmsPage(params: {
  /** 当前的页码 */
  current: number;
  /** 页面的容量 */
  pageSize: number;
  entityId?: string;
}) {
  return request.get<PageResult<Alarm.AlarmItem>>(
    'alarm/page',
    params
  );
}

//审计日志
export async function fetchAuditLogsPage(params: {
  /** 当前的页码 */
  current: number;
  /** 页面的容量 */
  pageSize: number;
  entityId?: string;
}) {
  return request.get<PageResult<any>>('auditLog/page', params);
}

export async function getDeviceProfileInfos() {
  return request.delete('deviceProfile/list');
}

export async function getCustomerList() {
  return request.delete('user/list');
}
