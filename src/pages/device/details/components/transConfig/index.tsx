import React, { useEffect, useReducer, useState } from 'react';
import {
  Form,
  Button,
  Input,
  message,
  Card,
} from 'antd';

import { generate } from '@/uitls';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const DeviceCert: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();
  const { deviceId } = router.query;



  const success = () => {
    messageApi.open({
      type: 'success',
      content: '复制成功',
    });
  };

 


  return (
    <Card>
      <Form
        form={form}
        layout='vertical'
      >
        <Form.Item
          name='clientId'
          label='属性Topic发送'
        >
          <Input
            placeholder='v1/devices/me/telemetry'
            allowClear
            disabled={true}
            addonAfter={
              <Button
                size='small'
                type='text'
                onClick={() => {
                  const id = form.getFieldValue('clientId');

                  navigator.clipboard.writeText(id);
                  success();
                }}
              >
                {<CopyOutlined />}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          name='username'
          label='订阅属性Topic'
        >
          <Input
            placeholder='v1/devices/me/attributes'
            allowClear
            disabled={true}
            addonAfter={
              <Button
                size='small'
                type='text'
                onClick={() => {
                  const username = form.getFieldValue('username');
                  navigator.clipboard.writeText(username);
                  success();
                }}
              >
                {<CopyOutlined />}
              </Button>
            }
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DeviceCert;
