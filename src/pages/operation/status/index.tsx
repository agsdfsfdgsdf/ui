import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getVehicleStatusList, exportVehicleStatus } from './service';

import WrapContent from '@/components/WrapContent';
import { getDict } from '../../system/dict/service';

import { VehicleStatus, VehicleStatusParams } from './data.d';

/**
 * 导出数据
 *
 * @param params
 */
const handleExport = async (params: VehicleStatusParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportVehicleStatus(params);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const StatusTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();

  const [energyModelOptions, setEnergyModelOptions] = useState<any>([]);
  const [jobModelOptions, setJobModelOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDict('operation_energy_model').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setEnergyModelOptions(opts);
      }
    });
    getDict('operation_job_model').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setJobModelOptions(opts);
      }
    });
  }, []);

  const columns: ProColumns<VehicleStatus>[] = [
    {
      title: '集卡号',
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: '所属车队',
      dataIndex: 'fleet',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '能源模式',
      dataIndex: 'energy',
      valueType: 'select',
      valueEnum: energyModelOptions,
      render: (_, record) => {
        const energy = record.energy;
        if (energy === 'O') {
          return '用油';
        } else if (energy === 'E') {
          return '用电';
        } else if (energy === 'M') {
          return '油电混合';
        } else {
          return '-';
        }
      },
    },
    {
      title: '登录状态',
      dataIndex: 'loginStatus',
      valueType: 'text',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        const loginStatus = record.loginStatus;
        if (loginStatus === 1) {
          return '登录';
        } else if (loginStatus === 0) {
          return '未登录';
        } else if (loginStatus === 9) {
          return '故障';
        } else {
          return '-';
        }
      },
    },
    {
      title: '作业模式',
      dataIndex: 'operationMode',
      valueType: 'select',
      valueEnum: jobModelOptions,
      render: (_, record) => {
        const operationMode = record.operationMode;
        if (operationMode === 1) {
          return '人工驾驶';
        } else if (operationMode === 0) {
          return '自动驾驶';
        } else if (operationMode === -1) {
          return '未登录';
        } else {
          return '-';
        }
      },
    },
    {
      title: '版本号',
      dataIndex: 'version',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '时间',
      dataIndex: 'deviceTime',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<VehicleStatus>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="vehicleStatus"
          search={{
            labelWidth: 120,
            optionRender: ({ searchText, resetText }, { form }, dom) => {
              return [
                <Button
                  key="searchText"
                  type="primary"
                  onClick={() => {
                    form?.submit();
                  }}
                >
                  {searchText}
                </Button>,
                <Button
                  key="resetText"
                  onClick={() => {
                    form?.resetFields();
                  }}
                >
                  {resetText}
                </Button>,
                <Button
                  type="primary"
                  key="export"
                  hidden={!access.hasPerms('operation:jobData:export')}
                  onClick={async () => {
                    const deviceNum = form?.getFieldValue('deviceNum');
                    const energy = form?.getFieldValue('energy');
                    const operationMode = form?.getFieldValue('operationMode');
                    await handleExport({
                      deviceNum,
                      energy,
                      operationMode,
                    } as VehicleStatusParams);
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ];
            },
          }}
          request={(params) =>
            getVehicleStatusList({ ...params } as VehicleStatusParams).then((res) => {
              return {
                data: res.rows,
                total: res.total,
                success: true,
              };
            })
          }
          columns={columns}
        />
      </div>
    </WrapContent>
  );
};

export default StatusTableList;
