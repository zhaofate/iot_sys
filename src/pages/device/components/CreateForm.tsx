import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  Input,
  Modal,
  Steps,
  Tabs,
  message,
  Switch,
  InputNumber,
  Select,
} from 'antd';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { DEVICE } from '@/types/device';
import { getDeviceProfileInfos, getCustomerList } from '@/services/api';
import { generate } from '@/uitls';

const { Step } = Steps;

export interface CreateFormProps {
  onCancel: (flag?: boolean, formVals?: Partial<DEVICE.Item>) => void;
  onSubmit: (values: Partial<DEVICE.Item>) => void;
  modalVisible: boolean;
}
const CreateForm: React.FC<CreateFormProps> = ({
  onCancel,
  onSubmit,
  modalVisible,
}: CreateFormProps) => {
  const [current, setCurrent] = useState(0);
  const [activeKey, setActiveKey] = useState('Access Token');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [clipboardRef, setClipboardRef] = useState<any>(null);

  const [deviceProfiles, setDeviceProfiles] = useState([]);
  const [customers, setCustomers] = useState([]);

   const tokenValue = Form.useWatch('token', form);
   const idValue = Form.useWatch('id', form);
   const usernameValue = Form.useWatch('username', form);

  useEffect(() => {
    form.resetFields();
    setCurrent(0);
    setActiveKey('Access Token');
    form.setFieldsValue({
      name: '',
      label: '',
      isGateway: false,
      isCover: false,
      description: '',
      token: '',
      certificate: '',
      id: '',
      username: '',
      password: '',
    });

    // 如果需要从 API 获取设备配置和客户列表，可以在这里调用
    // fetchDeviceProfiles();
    // fetchCustomers();
  }, [modalVisible, form]);


  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (e) {}
  };

  const handlePrev = () => {
    setCurrent(0);
  };

  const handleClose = async () => {
    form.resetFields();
    setCurrent(0);
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      // 根据 activeKey 动态选择需要校验的字段
      const fieldsToValidate: Record<string, string[]> = {
        'Access Token': ['token'],
        'X.509': ['certificate'],
        'MQTT Basic': ['id', 'username', 'password'],
      };

      // 校验设备详细信息表单
      await form.validateFields([
        'name',
        'label',
        'isGateway',
        'isCover',
        'description',
      ]);

      // 校验凭据表单
      await form.validateFields(fieldsToValidate[activeKey]);

      // 获取所有表单字段的值
      const deviceDetails = form.getFieldsValue([
        'name',
        'label',
        'isGateway',
        'isCover',
        'description',
      ]);
      const credentials = form.getFieldsValue(fieldsToValidate[activeKey]);

      // 合并所有字段的值并提交
      const values = { ...deviceDetails, ...credentials };
      onSubmit({ ...values, credentialsType: activeKey });
      onCancel();
    } catch (error) {
      console.error('表单校验失败:', error);
    }
  };

  const handleChange = (key: string) => {
    setActiveKey(key);
  };

    const success = () => {

   messageApi.open({
        type: 'success',
        content: '复制成功',
      });
  };

  const renderDeviceDetailForm = () => {
    return (
      <Form
        form={form}
        layout='vertical'
      >
        <Form.Item
          name='name'
          label='设备名称'
          rules={[{ required: true, message: '请输入设备名称' }]}
        >
          <Input placeholder='请输入设备名称' />
        </Form.Item>
        <Form.Item
          name='label'
          label='标签'
        >
          <Input placeholder='请输入标签' />
        </Form.Item>
        {/* <Form.Item
          name="deviceConfiguration"
          label="设备配置"
        >
          <Select
            showSearch
            placeholder="请选择设备配置"
            options={deviceProfiles.map((profile: any) => ({
              label: profile.name,
              value: profile.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="customer"
          label="分配给客户"
        >
          <Select
            showSearch
            placeholder="请选择客户"
            options={customers.map((customer: any) => ({
              label: customer.title,
              value: customer.id.id,
            }))}
          />
        </Form.Item> */}
        <Form.Item
          name='isGateway'
          label='是否网关'
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label='覆盖已连接设备的活动时间'
          shouldUpdate={(prevValues, curValues) =>
            prevValues.isGateway !== curValues.isGateway
          }
        >
          {({ getFieldValue }) => (
            <Form.Item
              name='isCover'
              noStyle
            >
              {getFieldValue('isGateway') ? <Switch /> : null}
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item
          name='description'
          label='设备描述'
        >
          <Input.TextArea placeholder='请输入设备描述' />
        </Form.Item>
      </Form>
    );
  };

  const renderTokenForm = () => {
    return (
      <Form
        form={form}
        layout='vertical'
      >
        <Form.Item
          name='token'
          label='访问令牌'
          rules={[{ required: true, message: '请输入访问令牌' }]}
        >
          <Input
            placeholder='请输入访问令牌'
            allowClear
            addonAfter={
              <Button
                size='small'
                type='text'
                onClick={() => {
                  const token = form.getFieldValue('token');
                  if (!token || token === '') {
                    form.setFieldsValue({ token: generate(20) });
                  } else {
                    navigator.clipboard.writeText(token);
                  success();
                  }
                }}
              >
                {tokenValue ? <CopyOutlined /> : <SyncOutlined />}
              </Button>
            }
          />
        </Form.Item>
      </Form>
    );
  };

  const renderX509Form = () => {
    return (
      <Form
        form={form}
        layout='vertical'
      >
        <Form.Item
          name='certificate'
          label='PEM 格式的证书'
          rules={[{ required: true, message: '请输入PEM 格式的证书' }]}
        >
          <Input.TextArea placeholder='请输入PEM 格式的证书' />
        </Form.Item>
      </Form>
    );
  };

  const renderMQTTForm = () => {
    return (
      <Form
        form={form}
        layout='vertical'
      >
        <Form.Item
          name='id'
          label='客户端ID'
          rules={[{ required: true, message: '请输入客户端ID' }]}
        >
          <Input
            placeholder='请输入客户端ID'
            allowClear
            addonAfter={
              <Button
                size='small'
                type='text'
                onClick={() => {
                  const id = form.getFieldValue('id');
                  if (!id || id === '') {
                    form.setFieldsValue({ id: generate(20) });
                  } else {
                    navigator.clipboard.writeText(id);
                    success();
                  }
                }}
              >
                {idValue ? <CopyOutlined /> : <SyncOutlined />}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          name='username'
          label='用户名'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            placeholder='请输入用户名'
            allowClear
            autoComplete='new-user'
            addonAfter={
              <Button
                size='small'
                type='text'
                onClick={() => {
                  const username = form.getFieldValue('username');
                  if (!username || username === '') {
                    form.setFieldsValue({ username: generate(20) });
                  } else {
                    navigator.clipboard.writeText(username);
                    success();
                  }
                }}
              >
                {usernameValue ? <CopyOutlined /> : <SyncOutlined />}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          name='password'
          label='密码'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            autoComplete='new-password'
            allowClear
            placeholder='请输入密码'
            type='password'
          />
        </Form.Item>
      </Form>
    );
  };

  const renderFooter = () => {
    return (
      <>
        {contextHolder}

        <Button
          type='primary'
          onClick={current === 0 ? handleNext : handlePrev}
        >
          {current === 0 ? '下一步：凭据' : '回退'}
        </Button>
        <Button onClick={handleClose}>取消</Button>
        <Button
          type='primary'
          onClick={handleSubmit}
        >
          保存
        </Button>
      </>
    );
  };

  const tabsItems = [
    {
      key: 'Access Token',
      label: 'Access Token',
      children: renderTokenForm(),
    },
    {
      key: 'X.509',
      label: 'X.509',
      children: renderX509Form(),
    },
    {
      key: 'MQTT Basic',
      label: 'MQTT Basic',
      children: renderMQTTForm(),
    },
  ];

  return (
    <Modal
      width={640}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title='添加设备'
      open={modalVisible}
      footer={renderFooter()}
      onCancel={handleClose}
    >
      <Steps
        current={current}
        size='default'
      >
        <Step title='设备详细信息' />
        <Step
          title='凭据'
          description='Optional'
        />
      </Steps>
      <div style={{ marginTop: '20px' }}>
        {current === 0 && renderDeviceDetailForm()}
        {current === 1 && (
          <Tabs
            activeKey={activeKey}
            onChange={handleChange}
            items={tabsItems}
          />
        )}
      </div>
    </Modal>
  );
};

export default CreateForm;
