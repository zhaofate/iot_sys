import React, { useEffect, useReducer, useState } from 'react';
import {
  Form,
  Button,
  Input,
  Modal,
  Switch,
  InputNumber,
  Select,
  Spin,
  Tabs,
  message,
  Card,
} from 'antd';
import { DEVICE } from '@/types/device';
import { getDeviceCredential } from '@/services/api';
import { generate } from '@/uitls';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const DeviceCert: React.FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('ACCESS_TOKEN');
  const [certId, setCertID] = useState('');
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();
  const { deviceId } = router.query;

  const tokenValue = Form.useWatch('token', form);
  const clientIdValue = Form.useWatch('clientId', form);
  const usernameValue = Form.useWatch('username', form);

  useEffect(() => {
    if (deviceId) {
      getFormData(deviceId as string);
    }
  }, [deviceId]);

  const getFormData = async (deviceId: string) => {
    const values = await getDeviceCredential({ deviceId });
    form.setFieldsValue(values as any);
    setActiveKey(values.credentialsType);
    setCertID(values._id);
    setLoading(false);
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: '复制成功',
    });
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
          name='clientId'
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
                  const id = form.getFieldValue('clientId');
                  if (!id || id === '') {
                    form.setFieldsValue({ clientId: generate(20) });
                  } else {
                    navigator.clipboard.writeText(id);
                    success();
                  }
                }}
              >
                {clientIdValue ? <CopyOutlined /> : <SyncOutlined />}
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
            placeholder='请输入密码'
            type='password'
          />
        </Form.Item>
      </Form>
    );
  };

  const tabsItems = [
    {
      key: 'ACCESS_TOKEN',
      label: 'ACCESS_TOKEN',
      children: renderTokenForm(),
    },
    {
      key: 'X509_CERTIFICATE',
      label: 'X509_CERTIFICATE',
      children: renderX509Form(),
    },
    {
      key: 'MQTT_BASIC',
      label: 'MQTT_BASIC',
      children: renderMQTTForm(),
    },
  ];
  return (
    <Card
    >
      {contextHolder}
      <Spin
        spinning={loading}
        size='large'
      ></Spin>
      <Tabs
        v-if={!loading}
        activeKey={activeKey}
        items={tabsItems}
      />
    </Card>
  );
};

export default DeviceCert;
