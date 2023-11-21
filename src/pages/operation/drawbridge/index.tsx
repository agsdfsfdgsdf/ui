import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useRef } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getTcsWebsocketGetQdInfoList, exportTcsWebsocketGetQdInfo } from './service';

import WrapContent from '@/components/WrapContent';

import type { TcsWebsocketGetQdInfo, TcsWebsocketGetQdInfoParams } from './data.d';

/**
 * 导出数据
 *
 */
const handleExport = async (tcsWebsocketGetQdInfoParams: TcsWebsocketGetQdInfoParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportTcsWebsocketGetQdInfo(tcsWebsocketGetQdInfoParams);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};
const TcsWebsocketGetQdInfoTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();

  //const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  const columns: ProColumns<TcsWebsocketGetQdInfo>[] = [
    {
      title: '集卡号',
      dataIndex: 'truckNo',
      valueType: 'text',
    },
    {
      title: '吊桥名称',
      dataIndex: 'resName',
      valueType: 'text',
    },
    {
      title: '时间',
      dataIndex: 'time',
      valueType: 'text',
    },
    {
      title: '变化内容',
      dataIndex: 'resChangedtype',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '桥吊id',
      dataIndex: 'resId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'resState',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '尺寸',
      dataIndex: 'resSling',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '关路信息',
      dataIndex: 'resClosedlanes',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '刷新时间',
      dataIndex: 'resRefreshtime',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<TcsWebsocketGetQdInfo>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="controller"
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
                // hidden={!access.hasPerms('operation:jobData:export')}
                onClick={async () => {
                  const truckNo = form?.getFieldValue('truckNo');
                  const time = form?.getFieldValue('time');
                  console.log(truckNo, time);
                  await handleExport({
                    truckNo,
                    time,
                  } as TcsWebsocketGetQdInfoParams);
                }}
              >
                <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
              </Button>,
              ];
            },
          }}
          request={(params) =>
            getTcsWebsocketGetQdInfoList({ ...params } as TcsWebsocketGetQdInfoParams).then((res) => {
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

export default TcsWebsocketGetQdInfoTableList;
