import { Button, Form, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

const FormItem = Form.Item;

interface Props {
  form: any;
  fetchData: () => void;
}

const SearchForm = ({ form, fetchData }: Props) => {
  return (
    <Form
      layout='inline'
      form={form}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <FormItem name='key'>
          <Input
            allowClear
            placeholder='输入检测条件'
            prefix={<SearchOutlined />}
          />
        </FormItem>
        <Form.Item
          name='scope'
          label='属性类型'
        >
          <Select
            showSearch
            placeholder='请选择类型'
            options={[
              { label: '客户端属性', value: 'CLIENT_SCOPE' },
              { label: '服务端属性', value: 'SERVER_SCOPE' },
              { label: '共享属性', value: 'SHARED_SCOPE' },
            ]}
          />
        </Form.Item>

        <Button
          type='primary'
          icon={<SearchOutlined />}
          onClick={fetchData}
        >
          查询
        </Button>
      </div>
    </Form>
  );
};

export default SearchForm;
