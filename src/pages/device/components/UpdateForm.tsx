import React, { useEffect } from 'react';
import { Form, Button, Input, Modal, Switch, InputNumber, Select } from 'antd';
import { DEVICE } from '@/types/device';
import { FormInstance } from 'antd/lib/Form';

const { Option } = Select;

interface UpdateFormProps {
  onSubmit: (values: Partial<DEVICE.ListItem>) => void;
  onCancel: () => void;
  modalVisible: boolean;
  values: Partial<DEVICE.ListItem>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  onSubmit,
  onCancel,
  modalVisible,
  values,
}) => {
    const [form] = Form.useForm<FormInstance<DEVICE.ListItem>>();
  
    useEffect(() => {
      if (modalVisible) {
        form.setFieldsValue(values as any);
      }
    }, [modalVisible, form, values]);

    const handleSubmit = async () => {
        try {
          const fields = await form.validateFields() as Partial<DEVICE.ListItem>; // 显式转换类型
          onSubmit({...fields,_id:values._id});
        } catch (error) {
          console.error('表单校验失败:', error);
        }
      };
  return (
    <Modal
      width={640}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改设备"
      open={modalVisible}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          保存
        </Button>,
      ]}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="设备名称"
          rules={[{ required: true, message: '请输入设备名称' }]}
        >
          <Input placeholder="请输入设备名称" />
        </Form.Item>
        <Form.Item
          name="label"
          label="标签"
        >
          <Input placeholder="请输入标签" />
        </Form.Item>
        <Form.Item name="isGateway" label="是否网关">
          <Switch />
        </Form.Item>
        <Form.Item
          label="覆盖已连接设备的活动时间"
          shouldUpdate={(prevValues, curValues) => prevValues.isGateway !== curValues.isGateway}
        >
          {({ getFieldValue }) => (
            <Form.Item name="isCover" noStyle>
              {getFieldValue('isGateway') ? <Switch /> : null}
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item
          name="description"
          label="设备描述"
        >
          <Input.TextArea placeholder="请输入设备描述" />
        </Form.Item>
        <Form.Item
          name="customerId"
          label="分配给客户"
        >
          <Select
            showSearch
            placeholder="请选择客户"
            options={[
              { label: '客户1', value: 'customer1' },
              { label: '客户2', value: 'customer2' },
              // 根据实际情况添加更多选项
            ]}
          />
        </Form.Item>
      
      </Form>
    </Modal>
  );
};

export default UpdateForm;
