import React, { useEffect, useState } from 'react';
import {

  Col,

  Row,

  Flex,
  Button,

} from 'antd';
import {

  ArrowLeftOutlined,
} from '@ant-design/icons';
import BaseLayout from '@/components/Layout';
import { DEVICE } from '@/types/device';
import type { RadioChangeEvent } from 'antd';
import { Radio, Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import DeviceAttributes from './components/deviceAttributes/index';
import DeviceMessages from './components/deviceMessage/index';
import { useRouter } from 'next/router';
import DeviceRules from './components/deviceRules';
import { getDeviceDetail } from '@/services/api';
import DeviceContainer from './components/deviceBase/index'
import DeviceCert from './components/deviceCert/index';
import AlarmPage from './components/deviceAlarm/index';
import TransPage from './components/transConfig/index';
import DeviceLogs from './components/deviceLogs/index'

type TabPosition = 'left' | 'right' | 'top' | 'bottom';

const DeviceDetails: React.FC = () => {
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<any>();
  const [chartData, setChartData] = useState([]);

  const [deviceDetails, setDeviceDetails] = useState<DEVICE.ListItem>();

  const router = useRouter();
  const { deviceId } = router.query;
  const [mode, setMode] = useState<TabPosition>('top');

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  const getDeviceData = async () => 
  {
      const data = await getDeviceDetail({ deviceId: deviceId as string });
    setDeviceDetails(data);
  }

      useEffect(() => {
      if(deviceId){
      getDeviceData();

      }
    }, [deviceId]);


  const items: TabsProps['items'] = [
    { key: '1', label: '概要', children: <DeviceContainer /> },
    { key: '2', label: '设备属性', children: <DeviceAttributes /> },
    { key: '3', label: '云透传', children: <DeviceMessages /> },
    { key: '4', label: '审计日志', children: <DeviceLogs /> },
    // { key: '5', label: '事件', children: 'Content of Tab Pane 3' },
    { key: '6', label: '告警', children: <AlarmPage /> },
    { key: '7', label: '规则配置', children: <DeviceRules /> },
    { key: '8', label: '传输配置', children: <TransPage /> },
    { key: '9', label: '设备凭证', children: <DeviceCert /> },
  ];

  return (

      <BaseLayout>
        <Row
          gutter={16}
          style={{
            alignItems: 'center', // 垂直居中
            height: '50px', // 行高度减小
            backgroundColor: '#ffffff',
          }}
        >
          <Col flex='80px'>
            <ArrowLeftOutlined
              style={{ color: '#23a8f2', marginLeft: '20px' }}
              onClick={() => router.back()}
            />
          </Col>
          <Col flex='100px'>{deviceDetails?.name || ''}</Col>
          <Col flex='auto'>{deviceDetails?.label || ''}</Col>
          <Col flex='150px'>
            <Radio.Group
              onChange={handleModeChange}
              value={mode}
            >
              <Radio.Button value='top'>水平</Radio.Button>
              <Radio.Button value='left'>垂直</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Flex
              gap='small'
              wrap
            >
              <Button
                color='primary'
                variant='outlined'
              >
                关机
              </Button>
              <Button
                color='primary'
                variant='outlined'
              >
                重启
              </Button>
            </Flex>
          </Col>
        </Row>

        <Tabs
          defaultActiveKey='1'
          tabPosition={mode}
          style={{ height: '100%', marginTop: '20px' }}
          items={items}
        />
      </BaseLayout>
 
  );
};

export default DeviceDetails;
