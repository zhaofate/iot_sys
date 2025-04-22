import { message, Divider, Card, Form } from 'antd';
import React, { useState } from 'react';
import { removeUser, fetchAuditLogsPage } from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import usePaginationRequest from '@/hooks/usePagination';
import ProTable from '@/components/ProTable';
import { API } from '@/types/typings';
import Alarm from '@/types/alarm';
import { useRouter } from 'next/router';
import { ALARM_SEVERITY_OPTIONS } from '@/enums/alarmEnum';
import dayjs from 'dayjs';

const LogPage: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  const router = useRouter();
  const { deviceId } = router.query;

  const request = async (params: API.PageParams) => {
    return await fetchAuditLogsPage({
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
      title: '实体类型',
      dataIndex: 'entityType',
    },
    {
      title: '实体名称',
      dataIndex: 'entityName',
    },
    {
      title: '用户',
      dataIndex: 'userName',
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
        <div className='search-form-wrapper'></div>

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

export default LogPage;
