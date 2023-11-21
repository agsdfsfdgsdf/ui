import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getControllerList, exportController } from './service';

import WrapContent from '@/components/WrapContent';

import { Controller, ControllerParams } from './data.d';

/**
 * 导出数据
 * @param params
 */
const handleExport = async (params?: ControllerParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportController(params);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const ControlTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {}, []);

  const columns: ProColumns<Controller>[] = [
    {
      title: '集卡号',
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: '实际经度',
      dataIndex: 'longitudeR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '实际纬度',
      dataIndex: 'latitudeR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '规划经度',
      dataIndex: 'longitudeD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '规划纬度',
      dataIndex: 'latitudeD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '实际速度(km/h)',
      dataIndex: 'speedR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '规划速度(km/h)',
      dataIndex: 'speedD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '区域速度(km/h)',
      dataIndex: 'speedL',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '所在位置',
      dataIndex: 'position',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.position === 1
          ? '集中装卸锁站'
          : record.position === 2
          ? '0W查验场地'
          : record.position === 3
          ? '熏蒸场地'
          : record.position === 4
          ? 'CFS过磅场地'
          : record.position === 5
          ? 'H986查验场地'
          : record.position === 6
          ? '调箱门场地'
          : record.position === 7
          ? '其它指定点位'
          : '';
      },
    },
    {
      title: '油门控制',
      dataIndex: 'throttleR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '油门期望',
      dataIndex: 'throttleD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '油门差值',
      dataIndex: 'throttleS',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '刹车控制',
      dataIndex: 'brakeR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '刹车期望',
      dataIndex: 'brakeD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '转向控制',
      dataIndex: 'wheelR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '转向期望',
      dataIndex: 'wheelD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '转向差值',
      dataIndex: 'wheelS',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '挡位控制',
      dataIndex: 'gearR',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '挡位期望',
      dataIndex: 'gearD',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '车灯控制',
      dataIndex: 'lightR',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.lightR === 'L'
          ? '左转向'
          : record.lightR === 'R'
          ? '右转向'
          : record.lightR === 'E'
          ? '双闪'
          : record.lightR === 'N'
          ? '无'
          : '-';
      },
    },
    {
      title: '车灯期望',
      dataIndex: 'lightD',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.lightD === 'L'
          ? '左转向'
          : record.lightD === 'R'
          ? '右转向'
          : record.lightD === 'E'
          ? '双闪'
          : record.lightD === 'N'
          ? '无'
          : '-';
      },
    },
    {
      title: '是否对位',
      dataIndex: 'isCp',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.isCp === 1 ? '是' : '否';
      },
    },
    {
      title: '是否对位开始',
      dataIndex: 'cpStart',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.cpStart === 1 ? '是' : '否';
      },
    },
    {
      title: '是否对位结束',
      dataIndex: 'cpEnd',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.cpEnd === 1 ? '是' : '否';
      },
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
        <ProTable<Controller>
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
                    await handleExport({
                      deviceNum,
                    } as ControllerParams);
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ];
            },
          }}
          request={(params) =>
            getControllerList({ ...params } as ControllerParams).then((res) => {
              return {
                data: res.rows,
                total: res.total,
                success: true,
              };
            })
          }
          columns={columns}
          scroll={{ x: 2000 }}
        />
      </div>
    </WrapContent>
  );
};

export default ControlTableList;
