import { getDeviceDetail } from "@/services/api";
import { Card, Col, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect,useState} from "react";

const DeviceContainer:React.FC = () => {
  {
    const router = useRouter();
    const { deviceId } = router.query;

    const [deviceInfo,setDeviceInfo] = useState([
      { label: '设备', value: '设备名称', key: 'name' },
      { label: '设备标签', value: '标签', key: 'label' },
      { label: '客户', value: '客户名称', key: 'userName' },
      { label: '设备状态', value: false, key: 'active' },
      { label: '公开状态', value: '公开', key: 'userIsPublic' },
      //  {
      //    label: (
      //      <Tooltip title='设备登录系统的唯一凭证。'>
      //        凭证
      //        <InfoOutlined style={{ color: '#797979', marginLeft: '10px' }} />
      //      </Tooltip>
      //    ),
      //    value: '公开',
      //  },
    ]);
    const getDeviceData = async () => {
      const data = await getDeviceDetail({ deviceId: deviceId as string });
      const res = deviceInfo.map((item:any) => {
    
        return {...item,value: data[item.key]}});
      setDeviceInfo(res);
    };

    useEffect(() => {
      if(deviceId){
      getDeviceData();

      }
    }, [deviceId]);
    return (
      <div style={{ margin: '10px 20px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title='设备信息'
              variant='borderless'
            >
              <Row gutter={16}>
                <Col span={24}>
                  {deviceInfo.map((info, index) => (
                    <Row
                      key={index}
                      gutter={16}
                      style={{ height: '40px' }}
                    >
                      <Col span={2}></Col>
                      <Col span={8}>
                        <p style={{ color: '#797979', fontSize: '12px' }}>
                          {info.label}
                        </p>
                      </Col>
                    {  info.key ==='active' ?
                    ( <Col span={8}>
                        <p>{info.value ? '在线':'离线'}</p>
                      </Col>):
                     ( <Col span={8}>
                        <p>{info.value}</p>
                      </Col>)}
                    </Row>
                  ))}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title='连接信息'
              variant='borderless'
            >
              连接状态
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
};

export default DeviceContainer;
