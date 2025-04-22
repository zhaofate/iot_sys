import BaseLayout from '@/components/Layout';
import DeviceUse from '@/markdown/use.mdx';
import SysIntro from '@/markdown/sys_intro.mdx';
import { Tabs, TabsProps } from 'antd';

const ManualPage: React.FC = () => {
  const items: TabsProps['items'] = [
    { key: '1', label: '系统简介', children: <SysIntro /> },
    { key: '2', label: '添加一个设备？', children: <DeviceUse /> },
    { key: '3', label: '连接到系统？', children: <DeviceUse /> },
    { key: '4', label: '发送数据', children: <DeviceUse /> },
    { key: '5', label: '创建预警规则', children: <DeviceUse /> },
  ];
  return (
    <BaseLayout>
      <Tabs
        defaultActiveKey='1'
        tabPosition='left'
        style={{ height: '100%', marginTop: '20px' }}
        items={items}
      />
    </BaseLayout>
  );
};

export default ManualPage;
