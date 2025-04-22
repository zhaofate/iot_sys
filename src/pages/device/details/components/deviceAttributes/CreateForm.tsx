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
import { DEVICE } from '@/types/device';
import { useRouter } from 'next/router';
import { DATA_TYPE_OPTIONS, VALUE_TYPE_OPTIONS } from '@/enums/msgEnum';

export interface CreateFormProps {
  onCancel: () => void;
  onSubmit: (values: Partial<DEVICE.saveAttributesParams>) => void;
  modalVisible: boolean;
}
const CreateForm: React.FC<CreateFormProps> = ({
  onCancel,
  onSubmit,
  modalVisible,
}: CreateFormProps) => {
  const [form] = Form.useForm();
  const typeValue = Form.useWatch('valueType', form);
  const router = useRouter();
  const { deviceId } = router.query;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      dataType: '',
      valueType: '',
      entityId: '',
      scope: '',
      key: '',
      value: '',
    });
  }, [modalVisible, form]);

  const handleSubmit = async () => {
    try {
      const fields =
        (await form.validateFields()) as Partial<DEVICE.saveAttributesParams>; // 显式转换类型
      onSubmit({ ...fields, entityId: deviceId as string });
    } catch (error) {
      console.error('表单校验失败:', error);
    }
  };

  return (
    <Modal
      width={640}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title='新增属性'
      open={modalVisible}
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
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout='vertical'
      >
        <Form.Item
          name='key'
          label='设备名称'
          rules={[{ required: true, message: '请输入设备名称' }]}
        >
          <Input placeholder='请输入设备名称' />
        </Form.Item>
        <Form.Item
          name='dataType'
          label='数据类型'
        >
          <Select
            showSearch
            placeholder='请选择数据类型'
            options={DATA_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          name='valueType'
          label='值类型'
        >
          <Select
            showSearch
            placeholder='请选择值类型'
            options={VALUE_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.valueType !== currentValues.valueType
          }
        >
          {() => {
            const type = typeValue;
            switch (type) {
              case 'string':
                return (
                  <Form.Item
                    name='value'
                    label='值'
                    rules={[{ required: true, message: '请输入字符串值' }]}
                  >
                    <Input />
                  </Form.Item>
                );
              case 'integer':
                return (
                  <Form.Item
                    name='value'
                    label='值'
                    rules={[{ required: true, message: '请输入整数值' }]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                );
              case 'decimal':
                return (
                  <Form.Item
                    name='value'
                    label='值'
                    rules={[{ required: true, message: '请输入双精度小数值' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      step={0.01}
                    />
                  </Form.Item>
                );
              case 'boolean':
                return (
                  <Form.Item
                    name='value'
                    label='值'
                    valuePropName='checked'
                  >
                    <Switch />
                  </Form.Item>
                );
              case 'json':
                return (
                  <Form.Item
                    name='value'
                    label='值'
                    rules={[{ required: true, message: '请输入 JSON 值' }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                );
              default:
                return null;
            }
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
