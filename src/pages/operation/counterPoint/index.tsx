import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WrapContent from '@/components/WrapContent';

import type { CounterPointType, CounterPointTypeParams } from './data.d';
import { exportCounterPoint, getCounterPointData } from '@/pages/operation/counterPoint/service';
import { getDict } from '@/pages/system/dict/service';

/**
 * 导出数据
 */
const handleExport = async (params: CounterPointTypeParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportCounterPoint(params);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const CounterPointTableList: React.FC = () => {
  const [counterPointTypeOptions, setCounterPointTypeOptions] = useState<any>([]);

  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDict('operation_counterpoint_type').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setCounterPointTypeOptions(opts);
      }
    });
  }, []);

  const columns: ProColumns<CounterPointType>[] = [
    {
      title: '集卡号',
      dataIndex: 'truckNo',
      valueType: 'text',
    },
    {
      title: '设备号',
      dataIndex: 'deviceNo',
      valueType: 'text',
    },
    {
      title: '对位设备类型',
      dataIndex: 'containerDev',
      valueType: 'select',
      valueEnum: counterPointTypeOptions,
    },
    {
      title: '具体移动的物理值',
      dataIndex: 'containerNo',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '具体移动的百分比',
      dataIndex: 'rate',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作模式',
      dataIndex: 'controlMode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<CounterPointType>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="counterPoint"
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
                    const truckNo = form?.getFieldValue('truckNo');
                    const deviceNo = form?.getFieldValue('deviceNo');

                    await handleExport({
                      truckNo,
                      deviceNo,
                    } as CounterPointTypeParams);
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ];
            },
          }}
          request={(params) =>
            getCounterPointData({ ...params } as CounterPointTypeParams).then((res) => {
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

export default CounterPointTableList;
