import { message, Card, Form, Button } from 'antd';
import React, { useState } from 'react';
import { removeUser, fetchAlarmsPage } from '@/services/api';
import { ColumnsType } from 'antd/es/table';
import usePaginationRequest from '@/hooks/usePagination';
import ProTable from '@/components/ProTable';
import { API } from '@/types/typings';
import Alarm from '@/types/alarm';
import { useRouter } from 'next/router';
import { ALARM_SEVERITY_OPTIONS } from '@/enums/alarmEnum';
import dayjs from 'dayjs';

const AlarmPage: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  const router = useRouter();
  const { deviceId } = router.query;

  const request = async (params: API.PageParams) => {
    return await fetchAlarmsPage({
      current: params.current as number,
      pageSize: params.pageSize as number,
      entityId: deviceId as string,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<Alarm.AlarmItem>((params) => request(params));
  const handleRemove = async (selectedRows: any[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return;
    try {
      await removeUser({ ids: selectedRows });
      hide();
      message.success('删除成功，即将刷新');
      fetchData().then();
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const columns: ColumnsType<Alarm.AlarmItem> = [
    {
      title: '告警类型',
      dataIndex: 'alarmType',
    },
    {
      title: '发起者',
      dataIndex: 'entityName',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      render: (_, record) => (
        <span>
          {
            ALARM_SEVERITY_OPTIONS.find((e) => e.value === record.severity)
              ?.label
          }
        </span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'actionType',
    },
    {
      title: '状态',
      dataIndex: 'actionStatus',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record) =>
        dayjs(record.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
  ];

  return (
    <Card variant='borderless'>
      <div className='search-form-wrapper'>
        <div></div>
        <Button
          type='primary'
          onClick={() => {
            fetchData().then();
          }}
          style={{ marginBottom: 16, marginTop: 16, marginRight: 16 }}
        >
          刷新
        </Button>
      </div>

      <ProTable<Alarm.AlarmItem>
        columns={columns}
        tableData={tableData}
        loading={loading}
        tableParams={tableParams}
        onTableChange={onTableChange}
        onBatchDelete={(rows) => handleRemove(rows.map((e) => e.id))}
      />
    </Card>
  );
};

export default AlarmPage;
