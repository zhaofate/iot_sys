import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Space,
  Typography,
  Card,
  Row,
  Col,
  message,
  Modal,
} from 'antd';
import axios from 'axios';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDeviceId } from '@/components/Provider/DeviceIdContext';
import { useRouter } from 'next/router';
import { fetchAttributesOptions } from '@/services/api';
import {
  ALARM_CONDITION_VALUE_TYPE_OPTIONS,
  PREDICATE_OPERATION_OPTIONS,
  ALARM_SEVERITY_OPTIONS,
} from '@/enums/alarmEnum';

const { Option } = Select;
const { Title } = Typography;

// 类型定义
interface DynamicValue {
  sourceType?: string;
  sourceAttribute?: string;
  inherit?: boolean;
}

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

interface Key {
  key: string;
  type: string;
}

interface Condition {
  id: string;
  key: Key;
  predicate: Predicate;
  valueType: string;
  value?: string;
}

interface CreateRule {
  id: string;
  Severity: string;
  condition: Condition[]; // 修改为复数形式
  schedule: string;
  alarmDetails?: string;
  dashboardId?: string;
}

interface RuleFormValues {
  alarmType: string;
  propagate: boolean;
  propagateToOwner: boolean;
  propagateToTenant: boolean;
  attribute: string;
  valueType: string;
  clearRules: string[];
  propagateRelationTypes: string[];
  createRules: CreateRule[];
}

export interface CreateFormProps {
  onSubmit: (values: Partial<RuleFormValues>) => void;
  onCancel: () => void;

  modalVisible: boolean;
}
const AddRuleForm: React.FC<CreateFormProps> = ({
  onSubmit,
  onCancel,

  modalVisible,
}: CreateFormProps) => {
  const [form] = Form.useForm<RuleFormValues>();
  const [loading, setLoading] = useState(false);
  const [attOptions, setAttOptions] = useState<{ _id: string; key: string }[]>(
    []
  );
    const router = useRouter();
  const { deviceId } = router.query;

  useEffect(() => {
    getAttributesOptions();
  }, []);

  const handleSubmit = async () => {
    try {
      const fields =
        (await form.validateFields()) as Partial<RuleFormValues>; // 显式转换类型
      onSubmit(fields);
        form.resetFields();
    } catch (error) {
        form.resetFields();
      console.error('表单校验失败:', error);
    }
  };

  const getAttributesOptions = async () => {
    try {
     const data = await fetchAttributesOptions({entityId:deviceId as string});
     setAttOptions(data);
    } catch (error) {
      console.error('表单校验失败:', error);
    }
  };

  const onFinish = async (values: RuleFormValues) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      width={1000}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title='新增规则'
      open={modalVisible}
      onCancel={onCancel}
      footer={[
        <Button
          key='back'
          onClick={onCancel}
        >
          取消
        </Button>,
        <Button
          key='submit'
          type='primary'
          onClick={handleSubmit}
        >
          保存
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        autoComplete='off'
      >
        {/* 基本信息部分 */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name='alarmType'
              label='告警类型'
              rules={[
                { required: true, message: '请输入告警类型' },
                { max: 50, message: '告警类型最多50个字符' },
              ]}
            >
              <Input
                placeholder='例如：氧气浓度超限'
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 传播设置部分 */}
        {/* <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name='propagate'
              label='是否传播告警'
              valuePropName='checked'
              tooltip='开启后告警会传播给相关设备'
            >
              <Switch
                checkedChildren='开启'
                unCheckedChildren='关闭'
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='propagateToOwner'
              label='传播给所有者'
              valuePropName='checked'
            >
              <Switch
                checkedChildren='是'
                unCheckedChildren='否'
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='propagateToTenant'
              label='传播给租户'
              valuePropName='checked'
            >
              <Switch
                checkedChildren='是'
                unCheckedChildren='否'
              />
            </Form.Item>
          </Col>
        </Row> */}

        {/* 创建规则条件 */}
        <Form.Item
          name='createRules'
          label='创建规则'
          tooltip='定义告警触发时创建的规则'
        >
          <Form.List name='createRules'>
            {(fields, { add, remove }) => (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size='small'
                    style={{
                      backgroundColor: '#fafafa',
                      borderRadius: 6,
                    }}
                    extra={
                      <Button
                        type='text'
                        danger
                        onClick={() => remove(name)}
                        icon={<DeleteOutlined />}
                        size='small'
                      />
                    }
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        {/* 严重程度 */}
                        <Form.Item
                          {...restField}
                          name={[name, 'severity']}
                          label='严重程度'
                          rules={[
                            { required: true, message: '请选择严重程度' },
                          ]}
                        >
                          <Select placeholder='选择严重程度' options={ALARM_SEVERITY_OPTIONS}>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {/* 告警详情 */}
                        <Form.Item
                          {...restField}
                          name={[name, 'alarmDetails']}
                          label='告警详情'
                        >
                          <Input.TextArea
                            rows={2}
                            placeholder='告警的详细描述'
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 条件配置  */}
                    <Form.Item
                      {...restField}
                      name={[name, 'condition']}
                      label='条件配置'
                    >
                      <Form.List name={[name, 'condition']}>
                        {(condFields, { add: addCond, remove: removeCond }) => (
                          <div>
                            {condFields.map(
                              ({
                                key: condKey,
                                name: condName,
                                ...condRestField
                              }) => (
                                <Space
                                  key={condKey}
                                  style={{ display: 'flex', marginBottom: 8 }}
                                  align='baseline'
                                >
                                  {/* 属性键 */}
                                  <Form.Item
                                    {...condRestField}
                                    name={[condName, 'key', 'key']}
                                    label='属性键'
                                    rules={[
                                      {
                                        required: true,
                                        message: '请输入属性键',
                                      },
                                    ]}
                                  >
                                    <Select placeholder='选择键类型'>
                                      {attOptions.map((item) => (
                                        <Option value={item.key}>
                                          {item.key}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>

                                  {/* 属性类型 */}
                                  <Form.Item
                                    {...condRestField}
                                    name={[condName, 'key', 'type']}
                                    label='键类型'
                                    rules={[
                                      {
                                        required: true,
                                        message: '请选择键类型',
                                      },
                                    ]}
                                  >
                                    <Select placeholder='选择键类型'>
                                      <Option value='ATTRIBUTE'>属性</Option>
                                      <Option value='TELEMETRY'>遥测</Option>
                                    </Select>
                                  </Form.Item>

                                  {/* 值类型 */}
                                  <Form.Item
                                    {...condRestField}
                                    name={[condName, 'valueType']}
                                    label='值类型'
                                    rules={[
                                      {
                                        required: true,
                                        message: '请选择值类型',
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder='选择值类型'
                                      options={
                                        ALARM_CONDITION_VALUE_TYPE_OPTIONS
                                      }
                                    ></Select>
                                  </Form.Item>

                                  {/* 操作符 */}
                                  <Form.Item
                                    {...condRestField}
                                    name={[condName, 'predicate', 'operation']}
                                    label='操作符'
                                    rules={[
                                      {
                                        required: true,
                                        message: '请选择操作符',
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder='选择操作符'
                                      options={PREDICATE_OPERATION_OPTIONS}
                                    ></Select>
                                  </Form.Item>

                                  {/* 忽略大小写 */}
                                  <Form.Item
                                    {...condRestField}
                                    name={[condName, 'predicate', 'ignoreCase']}
                                    label='忽略大小写'
                                    valuePropName='checked'
                                  >
                                    <Switch
                                      checkedChildren='是'
                                      unCheckedChildren='否'
                                    />
                                  </Form.Item>

                                  {/* 默认值 */}
                                  <Form.Item
                                    {...condRestField}
                                    name={[
                                      condName,
                                      'predicate',
                                      'value',
                                      'defaultValue',
                                    ]}
                                    label='默认值'
                                  >
                                    <Input placeholder='输入默认值' />
                                  </Form.Item>

                                  <Button
                                    type='text'
                                    danger
                                    onClick={() => removeCond(condName)}
                                    icon={<DeleteOutlined />}
                                  />
                                </Space>
                              )
                            )}
                            <Button
                              type='dashed'
                              onClick={() => addCond()}
                              block
                              icon={<PlusOutlined />}
                            >
                              添加条件
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Card>
                ))}

                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginTop: 8 }}
                >
                  添加规则配置
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRuleForm;
