import {
  message,
  Divider,
  Card,
  Form,
  Tag,
  Button,
  Tooltip,
  Menu,
  Dropdown,
  Modal,
} from 'antd';
import React, { useState, useEffect, ReactElement } from 'react';
import {
  fetchDevicePage,
  updateDevice,
  removeDevice,
  addDevice,
  updateDeviceCredential,
} from '@/services/api';
import { useRouter } from 'next/navigation';
import  { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import usePaginationRequest from '@/hooks/usePagination';
import SearchForm from '@/pages/device/components/SearchForm';
import ProTable from '@/components/ProTable';
import CreateForm from '@/pages/device/components/CreateForm';
import UpdateForm from '@/pages/device/components/UpdateForm';
import UpdateCertForm from '@/pages/device/components/UpdateCertForm';
import { API } from '@/types/typings';
import dayjs from 'dayjs';
import { DEVICE } from '@/types/device';
import {
  CheckSquareOutlined,
  BorderOutlined,
  DeleteOutlined,
  FormOutlined,
  MoreOutlined,
  EyeOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';


const { confirm } = Modal;
const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateCertVisible, setUpdateCertVisible] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>('');

  const [updateFormValues, setUpdateFormValues] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
const router = useRouter();
  const request = async (params: API.PageParams) => {
    const values = form.getFieldsValue();
    return await fetchDevicePage({
      ...values,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<DEVICE.ListItem>((params) => request(params));

  const handleAction = async (action: string, fields: any) => {
    const infoArr = {
      update: '修改',
      create: '添加',
      remove: '删除',
      updateCert: '修改凭证',
    };
    setLoadingAction(
      Object.getOwnPropertyNames(infoArr)[
        Object.values(infoArr).indexOf(action)
      ]
    );
    try {
      switch (action) {
        case 'update':
          await updateDevice(fields);
          setSuccessMessage('修改成功');
          setUpdateModalVisible(false);
          setUpdateFormValues({});
          break;
        case 'create':
          await addDevice(fields);
          setSuccessMessage('添加成功');
          setCreateModalVisible(false);
          break;
        case 'remove':
          await removeDevice({ ids: fields });
          setSuccessMessage('删除成功，即将刷新');
          break;
        case 'updateCert':
          await updateDeviceCredential(fields);
          setSuccessMessage('修改成功！');
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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '凭证',
    },
  ];


  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');

  const showModal = (dataId: string) => {
    setDeleteId(dataId);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await handleAction('remove', [deleteId]);
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

  const columns: ColumnsType<DEVICE.ListItem> = [
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: (_, record) =>
        dayjs(record.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: '标签',
      dataIndex: 'label',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'active',
      render: (_, record) => {
        const state = record.active ? '活动' : '非活动';
        const color = record.active ? 'green' : 'red';
        return <Tag color={color}>{state}</Tag>;
      },
      sorter: true,
    },
    {
      title: '客户',
      dataIndex: 'customerTitle',
      render: (_, record) =>
        record.customerIsPublic ? '公开' : record.customerTitle,
      sorter: true,
    },
    {
      title: '公开',
      dataIndex: 'customerIsPublic',
      render: (_, record) =>
        record.customerIsPublic ? (
          <CheckSquareOutlined style={{ fontSize: 20 }} />
        ) : (
          <BorderOutlined style={{ fontSize: 20 }} />
        ),
      sorter: true,
    },
    {
      title: '是否网关',
      dataIndex: 'isGateway',
      render: (_, record) =>
        record.isGateway ? (
          <CheckSquareOutlined style={{ fontSize: 20 }} />
        ) : (
          <BorderOutlined style={{ fontSize: 20 }} />
        ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <Tooltip
            placement='topLeft'
            title='修改'
          >
            <a
              onClick={() => {
                setUpdateModalVisible(true);
                setUpdateFormValues(record);
              }}
            >
              <FormOutlined />
            </a>
          </Tooltip>
          <Divider type='vertical' />
          <Tooltip
            placement='topLeft'
            title='详情'
          >
              <a
              onClick={() => {
               router.push('/device/details/'+record._id);
              }}
            >
              <EyeOutlined />
            </a>
          </Tooltip>
          <Divider type='vertical' />
          <Tooltip
            placement='topLeft'
            title='删除'
          >
            <a onClick={() => showModal(record._id)}>
              <DeleteOutlined style={{ color: '#e94242' }} />
            </a>
          </Tooltip>
          <Divider type='vertical' />
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case '1':
                    setUpdateCertVisible(true);
                    setDeviceId(record._id);
                    break;
                }
              },
            }}
            trigger={['click']}
          >
            <a>
              <MoreOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <BaseLayout>
      {contextHolder}
      <Card variant='borderless'>
        <div className='search-form-wrapper'>
          <SearchForm
            form={form}
            fetchData={fetchData}
          />
                    <div>
                        <Button
            type='primary'
            onClick={() => {fetchData().then();}}
            style={{ marginBottom: 16, marginTop: 16 ,marginRight:16 }}
          >
            刷新
          </Button>
          <Button
            type='primary'
            onClick={() => setCreateModalVisible(true)}
            style={{ marginBottom: 16, marginTop: 16 }}
          >
            新增设备
          </Button>
                    </div>
        </div>

        <ProTable<DEVICE.ListItem>
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

      <CreateForm
        onSubmit={(values) => handleAction('create', values)}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={(values) => handleAction('update', values)}
          onCancel={() => {
            setUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}

      {deviceId && deviceId.length ? (
        <UpdateCertForm
          onSubmit={(values) => handleAction('updateCert', values)}
          onCancel={() => {
            setUpdateCertVisible(false);
            setDeviceId('');
          }}
          modalVisible={updateCertVisible}
          deviceId={deviceId}
        />
      ) : null}

          <Modal
      title="确认删除"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <p>确定要删除此设备吗？</p>
    </Modal>
    </BaseLayout>

  );
};

export default TableList;
