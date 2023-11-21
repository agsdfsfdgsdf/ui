import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getAlarmList, exportAlarm, getAlarmType } from './service';

import WrapContent from '@/components/WrapContent';

import type { Alarm, AlarmParams } from './data.d';

/**
 * 导出数据
 *
 */
const handleExport = async (alarmParams: AlarmParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportAlarm(alarmParams);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const AlarmTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();

  const [alarmTypeOptions, setAlarmTypeOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getAlarmType().then((res) => {
      if (res && res.code === 200 && res.data) {
        setAlarmTypeOptions(res.data);
      }
    });
  }, []);

  const columns: ProColumns<Alarm>[] = [
    {
      title: '集卡号',
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: '报警类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: alarmTypeOptions,
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
        <ProTable<Alarm>
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
                  hidden={!access.hasPerms('operation:jobData:export')}
                  onClick={async () => {
                    const deviceNum = form?.getFieldValue('deviceNum');
                    const type = form?.getFieldValue('type');
                    console.log(deviceNum, type);
                    await handleExport({
                      deviceNum,
                      type,
                    } as AlarmParams);
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ];
            },
          }}
          request={(params) =>
            getAlarmList({ ...params } as AlarmParams).then((res) => {
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

export default AlarmTableList;
