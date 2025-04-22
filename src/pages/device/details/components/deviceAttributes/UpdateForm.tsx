import React, { useEffect } from 'react';
import { Form, Button, Input, Modal, Switch, InputNumber, Select } from 'antd';
import { DEVICE } from '@/types/device';
import { FormInstance } from 'antd/lib/Form';
import { DATA_TYPE_OPTIONS, VALUE_TYPE_OPTIONS } from '@/enums/msgEnum';

const { Option } = Select;

interface UpdateFormProps {
  onSubmit: (values: Partial<DEVICE.saveAttributesParams>) => void;
  onCancel: () => void;
  modalVisible: boolean;
  values: Partial<DEVICE.attributesResponse>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  onSubmit,
  onCancel,
  modalVisible,
  values,
}) => {
    const [form] = Form.useForm();
      const typeValue = Form.useWatch('valueType', form);
  
    useEffect(() => {
      if (modalVisible) {
        form.setFieldsValue(values as any);
      }
    }, [modalVisible, form, values]);

    const handleSubmit = async () => {
        try {
          const fields = await form.validateFields() as Partial<DEVICE.saveAttributesParams>; // 显式转换类型
          onSubmit({...fields,id:values._id});
        } catch (error) {
          console.error('表单校验失败:', error);
        }
      };
  return (
    <Modal
      width={640}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title='修改属性'
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

export default UpdateForm;
