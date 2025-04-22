import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Popconfirm,
  message,
  Collapse,
  Row,
  Col,
  Tag,
  Tooltip,
  Modal,
} from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import AddRuleForm from './components/AddRuleForm';
import { fetchDeviceRulesPage,addDeviceRule, removeDeviceRule } from '@/services/api';
import { useDeviceId } from '@/components/Provider/DeviceIdContext';
import ProTable from '@/components/ProTable';
import Alarm from '@/types/alarm';
import usePaginationRequest from '@/hooks/usePagination';
import { API } from '@/types/typings';
import { useRouter } from 'next/router';
import { ALARM_SEVERITY_OPTIONS, PREDICATE_OPERATION_OPTIONS } from '@/enums/alarmEnum';

const { Title, Text } = Typography;
const { Panel } = Collapse;


const RuleManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const { deviceId } = router.query;

  const request = async (params: API.PageParams) => {
    return await fetchDeviceRulesPage({
      entityId: deviceId as string,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<Alarm.Alarm>((params) =>
      request(params)
    );

  useEffect(() => {
    fetchData();
  },[]);
    const handleAction = async (action: string, fields: any) => {
    const infoArr = {
      update: '修改',
      create: '添加',
      remove: '删除',
    };
    setLoadingAction(
      Object.getOwnPropertyNames(infoArr)[
        Object.values(infoArr).indexOf(action)
      ]
    );
    try {
      switch (action) {
        case 'update':
          // await updateDevice(fields);
          // setSuccessMessage('修改成功');
          // setUpdateModalVisible(false);
          // setUpdateFormValues({});
          break;
        case 'create':
          await addDeviceRule({...fields,entityId:deviceId});
          setSuccessMessage('添加成功');
          setShowAddForm(false);
          break;
        case 'remove':
          await removeDeviceRule({ id: fields });
          setSuccessMessage('删除成功，即将刷新');
          break;
        default:
          break;
      }
          fetchData().then();
    } catch (error) {
      setErrorMessage('操作失败，请重试！');
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    if (loadingAction) {
      const hide = messageApi.open({
        type: 'loading',
        content: `正在${loadingAction}...`,
        duration: 0,
      });
      return () => {
        hide();
      };
    }
  }, [loadingAction, messageApi]);

  useEffect(() => {
    if (successMessage) {
      messageApi.success(successMessage);
      setSuccessMessage(null);
    }
  }, [successMessage, messageApi]);

  useEffect(() => {
    if (errorMessage) {
      messageApi.error(errorMessage);
      setErrorMessage(null);
    }
  }, [errorMessage, messageApi]);


    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [ruleId, setRuleId] = useState<string>('');

    const showModal = (dataId: string) => {
      setRuleId(dataId);
      setOpen(true);
    };

    const handleOk = async () => {
      setConfirmLoading(true);
      try {
        await handleAction('remove', ruleId);
        setOpen(false);
      } catch (error) {
        messageApi.error('删除失败，请重试！');
      } finally {
        setConfirmLoading(false);
      }
    };

    const handleCancel = () => {
      setOpen(false);
    };

  const columns = [
    {
      title: '告警类型',
      dataIndex: 'alarmType',
      key: 'alarmType',
    },
    // {
    //   title: '传播设置',
    //   key: 'propagate',
    //   render: (_: any, record: Alarm.Alarm) => (
    //     <Space>
    //       {record.propagate && <Tag color='blue'>传播</Tag>}
    //       {record.propagateToOwner && <Tag color='green'>所有者</Tag>}
    //       {record.propagateToTenant && <Tag color='orange'>租户</Tag>}
    //     </Space>
    //   ),
    // },
    {
      title: '条件',
      key: 'createRules',
      render: (_: any, record: Alarm.Alarm) => (
        <>
          {record?.createRules[0]?.condition.map((item: any, index: number) => (
            <Text key={index}>
              <Text className='text-red-500'>{item.key.key}</Text>
              {PREDICATE_OPERATION_OPTIONS!.find(
                (da) => da.value == item.predicate.operation
              )?.label || ''}{' '}
              {item.predicate.value.defaultValue}
            </Text>
          ))}
        </>
      ),
    },
    {
      title: '预警等级',
      key: 'severity',
      render: (_: any, record: Alarm.Alarm) => (
        <Text>
          {
            ALARM_SEVERITY_OPTIONS.find(
              (item) => item.value == record.createRules[0].severity
            )?.label
          }
        </Text>
      ),
    },

    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Alarm.Alarm) => (
        <Space size='middle'>
          <Tooltip
            placement='topLeft'
            title='删除'
          >
            <a onClick={() => showModal(record._id)}>
              <DeleteOutlined style={{ color: '#e94242' }} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Card
        style={{
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className='search-form-wrapper'>
          <Space/>
          <Button
            type='primary'
            onClick={() => setShowAddForm(true)}
            style={{ marginBottom: 16, marginTop: 16 }}
          >
            新增规则
          </Button>
        </div>


        <AddRuleForm
          onSubmit={(values) => handleAction('create', values)}
          onCancel={() => setShowAddForm(false)}
          modalVisible={showAddForm}
        />

        <ProTable<Alarm.Alarm>
          columns={columns}
          key='_id'
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) =>
            handleAction(
              'remove',
              rows.map((e) => e._id)
            )
          }
        />
      </Card>
      <Modal
        title='确认删除'
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>确定要删除该规则吗？</p>
      </Modal>
    </div>
  );
};

export default RuleManagement;
