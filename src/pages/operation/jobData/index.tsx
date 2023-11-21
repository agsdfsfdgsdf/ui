import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WrapContent from '@/components/WrapContent';

import type { JobData, JobDataParams } from './data.d';
import { exportJobData, getJobData } from '@/pages/operation/jobData/service';

/**
 * 导出数据
 */
const handleExport = async (params: JobDataParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportJobData(params);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const JobDataTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();
  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {}, []);

  const columns: ProColumns<JobData>[] = [
    {
      title: '作业ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '作业箱号',
      dataIndex: 'containerNo',
      valueType: 'text',
    },
    {
      title: '集卡号',
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: '落箱距离误差值',
      dataIndex: 'containerDev',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '接受指令时间',
      dataIndex: 'receivungTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '指令完成时间',
      dataIndex: 'finishTime',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<JobData>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="jobData"
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
                    const id = form?.getFieldValue('id');
                    const deviceNum = form?.getFieldValue('deviceNum');
                    const containerNo = form?.getFieldValue('containerNo');
                    await handleExport({
                      id,
                      deviceNum,
                      containerNo,
                    } as JobDataParams);
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ];
            },
          }}
          request={(params) =>
            getJobData({ ...params } as JobDataParams).then((res) => {
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

export default JobDataTableList;
