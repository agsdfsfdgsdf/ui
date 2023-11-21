import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { VehicleType, VehicleListParams } from './data.d';
import { getTreeList as getDeptTreeList } from '../../system/dept/service';
import { getVehicleList, removeVehicle, addVehicle, updateVehicle } from './service';
import UpdateForm from './components/edit';

import WrapContent from '@/components/WrapContent';
import { getDict } from '../../system/dict/service';
import type { DataNode } from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: VehicleType) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addVehicle({ ...fields });
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
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: VehicleType) => {
  const hide = message.loading('正在配置');
  try {
    const resp = await updateVehicle(fields);
    hide();
    if (resp.code === 200) {
      message.success('配置成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: VehicleType[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await removeVehicle(selectedRows.map((row) => row.vin).join(','));
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

const handleRemoveOne = async (selectedRow: VehicleType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.vin];
    const resp = await removeVehicle(params.join(','));
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

/**
 * 导出数据
 *
 * @param id
 */
// const handleExport = async () => {
//   const hide = message.loading('正在导出');
//   try {
//     await exportRole();
//     hide();
//     message.success('导出成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('导出失败，请重试');
//     return false;
//   }
// };

const VehicleTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<VehicleType>();
  const [selectedRowsState, setSelectedRows] = useState<VehicleType[]>([]);

  const [vehicleTypeOptions, setVehicleTypeOption] = useState<any>([]);
  const [vehicleStatusOptions, setVehicleStatusOptions] = useState<any>([]);
  const [vehicleProtocolOptions, setVehicleProtocolOptions] = useState<any>([]);
  const [deptTree, setDeptTree] = useState<DataNode[]>();

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDict('vehicle_type').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setVehicleTypeOption(opts);
      }
    });
    getDict('vehicle_status').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setVehicleStatusOptions(opts);
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
    getDeptTreeList({ status: 0 }).then((treeData) => {
      setDeptTree(treeData);
    });
  }, []);

  let deptStr = '';
  function getDeptTitle(data: any, company: string) {
    data?.map((dept: any) => {
      if (dept.value === Number.parseInt(company)) {
        deptStr = dept.title;
      } else {
        getDeptTitle(dept.children, company);
      }
    });
  }

  const columns: ProColumns<VehicleType>[] = [
    {
      title: <FormattedMessage id="vehicle.list.vin" defaultMessage="车辆VIN" />,
      dataIndex: 'vin',
      valueType: 'text',
      //hideInSearch: true,
    },
    {
      title: <FormattedMessage id="vehicle.list.plateNumber" defaultMessage="车牌号" />,
      dataIndex: 'plateNumber',
      valueType: 'text',
    },
    {
      title: "集卡号",
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="vehicle.list.company" defaultMessage="所属组织" />,
      dataIndex: 'company',
      valueType: 'text',
      render: (_, record) => {
        deptStr = '';
        getDeptTitle(deptTree, record.company);
        return <span>{deptStr}</span>;
      },
      hideInSearch: true,
    },
    {
      title: '所属组织',
      dataIndex: 'company',
      hideInTable: true,
      renderFormItem: (_, fieldConfig, form) => {
        if (fieldConfig.type === 'form') {
          return null;
        }
        const status = form.getFieldValue('state');
        if (status !== 'open') {
          return (
            // value 和 onchange 会通过 form 自动注入。
            <TreeSelect
              showSearch
              treeData={deptTree}
              treeDefaultExpandAll
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择所属组织"
              treeNodeFilterProp="title"
            />
          );
        }
        return fieldConfig.defaultRender(_);
      },
    },
    {
      title: <FormattedMessage id="vehicle.list.protocol" defaultMessage="协议类型" />,
      dataIndex: 'protocol',
      valueType: 'select',
      valueEnum: vehicleProtocolOptions,
    },
    {
      title: <FormattedMessage id="vehicle.list.vehicleType" defaultMessage="车辆类型" />,
      dataIndex: 'vehicleType',
      valueType: 'select',
      valueEnum: vehicleTypeOptions,
    },
    {
      title: <FormattedMessage id="vehicle.list.vehicleStatus" defaultMessage="车辆状态" />,
      dataIndex: 'vehicleStatus',
      valueType: 'select',
      valueEnum: vehicleStatusOptions,
      render: (_, record) => {
        return <span>{record.vehicleStatus}</span>;
      },
    },
    {
      title: <FormattedMessage id="vehicle.list.createTime" defaultMessage="创建时间" />,
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
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('cars:manager:edit')}
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="编辑" />
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('cars:manager:remove')}
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
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<VehicleType>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="vin"
          key="vehicleList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('cars:manager:add')}
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
            </Button>,
            <Button
              type="primary"
              key="remove"
              hidden={selectedRowsState?.length === 0 || !access.hasPerms('cars:manager:remove')}
              onClick={async () => {
                const success = await handleRemove(selectedRowsState);
                if (success) {
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }}
            >
              <DeleteOutlined />
              <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
            </Button>,
          ]}
          request={(params) =>
            getVehicleList({ ...params } as VehicleListParams).then((res) => {
              return {
                data: res.rows,
                total: res.total,
                success: true,
              };
            })
          }
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      </div>
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            key="remove"
            hidden={!access.hasPerms('cars:manager:remove')}
            onClick={async () => {
              Modal.confirm({
                title: '删除',
                content: '确定删除该项吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const success = await handleRemove(selectedRowsState);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.id) {
            success = await handleUpdate({ ...values } as VehicleType);
          } else {
            success = await handleAdd({ ...values } as VehicleType);
          }
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
        vehicleStatusOptions={vehicleStatusOptions}
        depts={deptTree || []}
      />
    </WrapContent>
  );
};

export default VehicleTableList;
