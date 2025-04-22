import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Divider, List, Skeleton } from 'antd';
import { DEVICE } from '@/types/device';
import { useRouter } from 'next/router';
import { fetchDeviceMessagesPage, getDeviceCredential } from '@/services/api';

interface Message {
  deviceId: string;
  payload: Record<string, any>;
  receivedAt: string;
}

const DeviceMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [current, setCurrent] = useState(1);
  const router = useRouter();
  const { deviceId } = router.query;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DEVICE.deviceMessage[]>([]);

  let client: mqtt.MqttClient | null = null;

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetchDeviceMessagesPage({
      current,
      pageSize: 10,
      deviceId: deviceId as string,
    })
      .then((body) => {
        setData([...data, ...body.records]);
        setCurrent(current + 1);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getCredential = async (deviceId: string) => {
    const data = await getDeviceCredential({ deviceId });
    const { clientId, username, password } = data;
    const options = {
      clientId,
      username,
      password,
      connectTimeout: 60000, // 设置连接超时时间为 60 秒
      keepalive: 30,
      version:'3.1.1'
    };
    client = mqtt.connect('mqtt://localhost:1883', options);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('iot/device/attributes/update', (err) => {
        if (!err) {
          console.log('Subscribed to iot/device/attributes/update');
        }
      });
    });

    client.on('message', (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      if (topic === 'iot/device/attributes/update') {
        try {
          const payload = JSON.parse(message.toString());
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              deviceId: 'Unknown',
              payload,
              receivedAt: new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error('Error parsing payload:', error);
        }
      }
    });

    client.on('error', (error) => {
      console.error('MQTT Error:', error);
    });

    client.on('close', () => {
      console.log('MQTT connection closed');
    });
  };

  useEffect(() => {
    loadMoreData();
    if (deviceId) {
      getCredential(deviceId as string);
    }
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [deviceId]);

  return (
    <div
      id='scrollableDiv'
      style={{
        height: 600,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={
          <Skeleton
            avatar
            paragraph={{ rows: 1 }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget='scrollableDiv'
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item._id}>
              {/* <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href='https://ant.design'>{item.name.last}</a>}
                description={item.email}
              /> */}
              <div>{JSON.stringify(item.msg)}</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default DeviceMessages;
