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
  updateDevice,
  addDeviceAttributes,
  removeDeviceAttributes,
  fetchDeviceAttributesPage,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import usePaginationRequest from '@/hooks/usePagination';
import SearchForm from './SearchForm';
import ProTable from '@/components/ProTable';
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
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
import { useRouter } from 'next/router';

const { confirm } = Modal;
const DeviceAttributes: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const [updateFormValues, setUpdateFormValues] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const { deviceId } = router.query;
  const [entityId, setEntityId] = useState<string>(deviceId as string);

  const request = async (params: API.PageParams) => {
    const values = form.getFieldsValue();
    return await fetchDeviceAttributesPage({
      ...values,
      entityId:deviceId as string,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<DEVICE.attributesResponse>((params) =>
      request(params)
    );

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
          await updateDevice(fields);
          setSuccessMessage('修改成功');
          setUpdateModalVisible(false);
          setUpdateFormValues({});
          break;
        case 'create':
          await addDeviceAttributes(fields);
          setSuccessMessage('添加成功');
          setCreateModalVisible(false);
          break;
        case 'remove':
          await removeDeviceAttributes({ ids: fields });
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

    const renderMessage: React.FC = (msg:any) => {
      switch (msg.type) {
        case 'text':
          return <span>{msg.content}</span>;
        case 'image':
          return (
            <img
              src={msg.content}
              alt='image'
              style={{ maxWidth: '100px', height: 'auto' }}
            />
          );
        case 'audio':
          return (
            <audio
              controls
              src={msg.content}
            />
          );
        case 'video':
          return (
            <video
              controls
              src={msg.content}
              style={{ width: '100px' }}
            />
          );
        default:
          return null;
      }
    };

  const columns: ColumnsType<DEVICE.attributesResponse> = [
    {
      title: '创建时间',
      dataIndex: 'lastUpdateTs',
      render: (_, record) =>
        dayjs(record.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
    {
      title: '名称',
      dataIndex: 'key',
      sorter: true,
    },
    {
      title: '值',
      dataIndex: 'value',
      sorter: true,
      render: (_, record) => (
        <>
        {renderMessage({
          type:record.dataType,
          content:record.value
        })}
        </>
      )
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
            title='删除'
          >
            <a onClick={() => showModal(record._id)}>
              <DeleteOutlined style={{ color: '#e94242' }} />
            </a>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div>
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
            新增属性
          </Button>
        </div>
        </div>

        <ProTable<DEVICE.attributesResponse>
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

      <Modal
        title='确认删除'
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>确定要删除此设备吗？</p>
      </Modal>
    </div>
  );
};

export default DeviceAttributes;
