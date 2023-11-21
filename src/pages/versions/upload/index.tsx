import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { OTAFileType, OTAListParams, OTAVersion, OTAAppType } from './data.d';
import {
  getVersionsUploadList,
  removeVersionsUpload,
  addVersionsUpload,
  updateVersionsUpload,
  getApplyList,
  removeVersionsApp,
  addVersionsApp,
  updateVersionsApp,
} from './service';
import UpdateForm from './components/addModal';
import AppInfoForm from './components/addAppModal';

import WrapContent from '@/components/WrapContent';
import { getDict } from '../../system/dict/service';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: OTAFileType) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addVersionsUpload({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 添加应用
 * @param fields
 * @returns
 */
const handleAddApp = async (fields: OTAAppType) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addVersionsApp({ ...fields });
    hide();
    console.log(resp);
    if (resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 编辑应用
 * @param fields
 * @returns
 */
const handleEditApp = async (fields: OTAAppType) => {
  const hide = message.loading('正在修改');
  try {
    const resp = await updateVersionsApp({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('修改成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 * 发布
 *
 * @param fields
 */
const handleRelease = async (fields: OTAFileType) => {
  const hide = message.loading('正在发布');
  try {
    fields.status = 1;
    const resp = await updateVersionsUpload(fields);
    hide();
    if (resp.code === 200) {
      message.success('发布成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('发布失败请重试！');
    return false;
  }
};

/**
 * 撤销发布
 *
 * @param fields
 */
const handleCancelRelease = async (fields: OTAFileType) => {
  const hide = message.loading('正在撤销发布');
  try {
    fields.status = 2;
    const resp = await updateVersionsUpload(fields);
    hide();
    if (resp.code === 200) {
      message.success('撤销发布成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('撤销发布失败请重试！');
    return false;
  }
};

/**
 * 删除应用及所有版本
 *
 * @param otaVersion
 */
const handleRemove = async (otaVersion: OTAVersion) => {
  const hide = message.loading('正在删除');
  if (!otaVersion || !otaVersion.list) {
    message.error('删除失败!');
    return false;
  }
  try {
    const params = otaVersion.list.map((item) => {
      return item.id;
    });
    console.log('Gunson', params);
    if (params && params.length > 0) {
      const resp = await removeVersionsUpload(params.join(','));

      if (resp.code === 200) {
        const resp1 = await removeVersionsApp(otaVersion.dataType);
        if (resp1.code === 200) {
          hide();
          message.success('删除成功，即将刷新');
        } else {
          hide();
          message.error(resp1.msg);
          return false;
        }
      } else {
        hide();
        message.error(resp.msg);
        return false;
      }
    } else {
      const resp1 = await removeVersionsApp(otaVersion.dataType);
      if (resp1.code === 200) {
        hide();
        message.success('删除成功，即将刷新');
      } else {
        hide();
        message.error(resp1.msg);
        return false;
      }
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 删除版本
 * @param selectedRow
 * @returns
 */
const handleRemoveOne = async (selectedRow: OTAFileType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await removeVersionsUpload(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const OTAUploadTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [appModalVisible, setAppModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<OTAVersion>();
  const [currentAppRow, setCurrentAppRow] = useState<OTAVersion>();

  const [vehicleTypeOptions, setVehicleTypeOption] = useState<any>([]);
  const [vehicleProtocolOptions, setVehicleProtocolOptions] = useState<any>([]);
  const [otaUpdateTypeOptions, setOtaUpdateTypeOptions] = useState<any>([]);
  const [otaVersionStatusOptions, setOtaVersionStatusOptions] = useState<any>([]);
  const [otaApplyList, setOtaApplyList] = useState<any>([]);

  const access = useAccess();

  const loadAppList = () => {
    getApplyList().then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.rows.forEach((item: any) => {
          opts[item.id] = item.apply;
        });
        setOtaApplyList(opts);
      }
    });
  };

  useEffect(() => {
    getDict('vehicle_type').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setVehicleTypeOption(opts);
      }
    });
    getDict('vehicle_protocol').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setVehicleProtocolOptions(opts);
      }
    });
    getDict('ota_update_type').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setOtaUpdateTypeOptions(opts);
      }
    });
    getDict('ota_version_status').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setOtaVersionStatusOptions(opts);
      }
    });
    loadAppList();
  }, []);

  const expandedRowRender = (record0) => {
    const columnsInner: ProColumns<OTAFileType>[] = [
      {
        title: <FormattedMessage id="versions.list.id" defaultMessage="版本ID" />,
        dataIndex: 'id',
        valueType: 'text',
        align: 'center',
        width: '100px',
      },
      {
        title: <FormattedMessage id="versions.list.updateType" defaultMessage="更新标识" />,
        dataIndex: 'updateType',
        valueType: 'select',
        valueEnum: otaUpdateTypeOptions,
      },
      {
        title: <FormattedMessage id="versions.list.fileSize" defaultMessage="文件大小（KB）" />,
        dataIndex: 'fileSize',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: <FormattedMessage id="versions.list.vehicleType" defaultMessage="适配车辆类型" />,
        dataIndex: 'vehicleType',
        valueType: 'select',
        valueEnum: vehicleTypeOptions,
      },
      {
        title: <FormattedMessage id="versions.list.protocol" defaultMessage="适配协议类型" />,
        dataIndex: 'protocol',
        valueType: 'select',
        valueEnum: vehicleProtocolOptions,
      },
      {
        title: <FormattedMessage id="versions.list.status" defaultMessage="版本状态" />,
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: otaVersionStatusOptions,
      },
      {
        title: <FormattedMessage id="versions.list.versionCode" defaultMessage="版本编号" />,
        dataIndex: 'versionCode',
        valueType: 'text',
        hideInTable: false,
      },
      {
        title: <FormattedMessage id="versions.list.fileName" defaultMessage="文件名称" />,
        dataIndex: 'fileName',
        valueType: 'text',
        hideInTable: true,
      },
      {
        title: <FormattedMessage id="versions.list.description" defaultMessage="版本描述" />,
        dataIndex: 'description',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: <FormattedMessage id="versions.list.uploader" defaultMessage="发布人" />,
        dataIndex: 'uploader',
        valueType: 'text',
      },
      {
        title: <FormattedMessage id="versions.list.md5" defaultMessage="MD5" />,
        dataIndex: 'md5',
        valueType: 'text',
        hideInTable: true,
        hideInSearch: true,
      },
      {
        title: <FormattedMessage id="versions.list.fileUrl" defaultMessage="文件地址" />,
        dataIndex: 'description',
        valueType: 'text',
        hideInTable: true,
        hideInSearch: true,
      },
      {
        title: <FormattedMessage id="versions.list.createTime" defaultMessage="创建时间" />,
        dataIndex: 'createTime',
        valueType: 'dateRange',
        render: (_, record) => <span>{record.createTime}</span>,
        search: {
          transform: (value) => {
            return {
              'params[beginTime]': value[0],
              'params[endTime]': value[1],
            };
          },
        },
        hideInSearch: false,
        hideInTable: true,
      },
      {
        title: <FormattedMessage id="versions.list.updateTime" defaultMessage="修改时间" />,
        dataIndex: 'updateTime',
        valueType: 'dateRange',
        render: (_, record) => <span>{record.updateTime}</span>,
        search: {
          transform: (value) => {
            return {
              'params[beginTime]': value[0],
              'params[endTime]': value[1],
            };
          },
        },
        hideInSearch: false,
        hideInTable: true,
      },
      {
        title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
        dataIndex: 'option',
        width: '180px',
        align: 'center',
        valueType: 'option',
        render: (_, record) => [
          <Button
            type="link"
            size="small"
            key="release"
            hidden={
              !access.hasPerms('versions:upload:release') ||
              (record.status !== 0 && record.status !== 1 && record.status !== 2)
            }
            onClick={() => {
              if (record.status === 0 || record.status === 2) {
                Modal.confirm({
                  title: '发布',
                  content: '确定发布该项版本吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleRelease(record);
                    if (success) {
                      actionRef.current?.reloadAndRest?.();
                    }
                  },
                });
              } else if (record.status === 1) {
                Modal.confirm({
                  title: '下架',
                  content: '确定下架该项发布吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleCancelRelease(record);
                    if (success) {
                      actionRef.current?.reloadAndRest?.();
                    }
                  },
                });
              }
            }}
          >
            {record.status === 0 && (
              <FormattedMessage id="pages.searchTable.release" defaultMessage="发布" />
            )}
            {record.status === 1 && (
              <FormattedMessage id="pages.searchTable.cancelRelease" defaultMessage="下架" />
            )}
            {record.status === 2 && (
              <FormattedMessage id="pages.searchTable.reRelease" defaultMessage="恢复发布" />
            )}
          </Button>,
          <Button
            type="link"
            size="small"
            danger
            key="batchRemove"
            hidden={!access.hasPerms('versions:upload:remove')}
            onClick={async () => {
              Modal.confirm({
                title: '删除',
                content: '确定删除该项吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const success = await handleRemoveOne(record);
                  if (success) {
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                },
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
          </Button>,
        ],
      },
    ];

    return (
      <ProTable<OTAFileType>
        rowKey="id"
        key="otaList"
        search={false}
        columns={columnsInner}
        dataSource={record0.list}
        toolBarRender={false}
        rowSelection={false}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<OTAVersion>[] = [
    {
      valueType: () => {
        return (
          //占位
          <span />
        );
      },
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="versions.app.versionName" defaultMessage="应用名称" />,
      dataIndex: 'apply',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.app.versionName" defaultMessage="应用名称" />,
      dataIndex: 'dataType',
      valueType: 'select',
      valueEnum: otaApplyList,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="versions.app.maxVersionCode" defaultMessage="最新版本" />,
      dataIndex: 'maxVersionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.app.count" defaultMessage="版本数量" />,
      dataIndex: 'count',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.app.maxUpdateTime" defaultMessage="更新时间" />,
      dataIndex: 'maxUpdateTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.app.description" defaultMessage="描述" />,
      dataIndex: 'description',
      valueType: 'text',
      hideInSearch: true,
      // render: (_, record) => {
      //   const list = record.list;
      //   if (list && list.length > 0) {
      //     return <span>{list[list.length - 1]?.description}</span>;
      //   }
      //   return <span>无</span>;
      // },
    },
    {
      title: <FormattedMessage id="versions.list.status" defaultMessage="版本状态" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: otaVersionStatusOptions,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '180px',
      align: 'center',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="createApp"
          hidden={!access.hasPerms('versions:upload:add')}
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          <FormattedMessage id="versions.app.create" defaultMessage="创建新版本" />
        </Button>,
        <Button
          type="link"
          size="small"
          key="editApp"
          hidden={!access.hasPerms('versions:app:edit')}
          onClick={() => {
            setCurrentAppRow(record);
            setAppModalVisible(true);
          }}
        >
          <FormattedMessage id="versions.app.edit" defaultMessage="编辑" />
        </Button>,
        <Button
          type="link"
          size="small"
          key="deleteApp"
          hidden={!access.hasPerms('versions:app:remove')}
          onClick={() => {
            Modal.confirm({
              title: '删除应用',
              content: '确定删除应用 ' + record.apply + ' 及所有版本吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemove(record);
                if (success) {
                  actionRef.current?.reloadAndRest?.();
                  loadAppList();
                }
              },
            });
          }}
        >
          <FormattedMessage id="versions.app.delete" defaultMessage="删除" />
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <Button
          style={{ position: 'absolute', zIndex: 20, marginTop: 25, marginLeft: 20 }}
          type="primary"
          key="add"
          hidden={!access.hasPerms('versions:app:add')}
          onClick={async () => {
            setCurrentAppRow(undefined);
            setAppModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.searchTable.newApp" defaultMessage="新建应用" />
        </Button>
        <ProTable<OTAVersion>
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="dataType"
          key="otaUploadList"
          search={{
            labelWidth: 100,
            span: 6,
          }}
          toolBarRender={false}
          request={(params) =>
            getVersionsUploadList({ ...params } as OTAListParams).then((res) => {
              return {
                data: res.rows,
                total: res.total,
                success: true,
              };
            })
          }
          columns={columns}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
          rowSelection={false}
        />
      </div>
      <UpdateForm
        onSubmit={async (values) => {
          const success = await handleAdd({ ...values } as OTAFileType);
          if (success) {
            setModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        visible={modalVisible}
        values={currentRow || {}}
        vehicleProtocolOptions={vehicleProtocolOptions}
        vehicleTypeOptions={vehicleTypeOptions}
        otaUpdateTypeOptions={otaUpdateTypeOptions}
      />

      <AppInfoForm
        onSubmit={async (values) => {
          let success;
          if (values.id) {
            success = await handleEditApp({ ...values } as OTAAppType);
          } else {
            success = await handleAddApp({ ...values } as OTAAppType);
          }
          if (success) {
            setAppModalVisible(false);
            setCurrentAppRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
            loadAppList();
          }
        }}
        onCancel={() => {
          setAppModalVisible(false);
          setCurrentAppRow(undefined);
        }}
        values={currentAppRow || {}}
        visible={appModalVisible}
      />
    </WrapContent>
  );
};

export default OTAUploadTableList;
