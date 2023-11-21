import type { FormInstance } from 'antd';
import { Button, message,  DatePicker } from 'antd';
import React, { useState,useRef,useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getWarnCountList, exportWarnCount,getMarkType } from './service';
import WrapContent from '@/components/WrapContent';
import type { WarnCount, WarnCountParams } from './data.d';

const {RangePicker} = DatePicker

/**
 * 导出数据
 *
 */
const handleExport = async (warnCountParams: WarnCountParams) => {
  const hide = message.loading('正在导出');
  try {
    await exportWarnCount(warnCountParams);
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const WarnCountTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();
  const [markTypeOptions, setMarkTypeOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getMarkType().then((res) => {
      if (res && res.code === 200 && res.data) {
        setMarkTypeOptions(res.data);
      }
    });
  }, []);
  const columns: ProColumns<WarnCount>[] = [
    {
      title: '集卡号',
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: '统计时间',
      dataIndex: 'deviceTime',
      valueType: 'text',
      renderFormItem: () => <RangePicker format='YYYY-MM-DD' />
    },
    {
      title: '统计周期',
      dataIndex: 'mark',
      valueType: 'select',
      valueEnum: markTypeOptions,
    },
    {
      title: '一级告警',
      dataIndex: 'firstWarn',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '二级告警',
      dataIndex: 'secondWarn',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<WarnCount>
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
                    } as WarnCountParams);
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ];
            },
          }}
          request={ (params) =>{
            // params.deviceNum = "T902"
            // params.startTime= "2023-09-04 1:28:35"
            // params.endTime= "2023-10-24 23:28:35"
           
          return   getWarnCountList({ ...params } as WarnCountParams).then((res) => {
              //const dataFomart = res.map((item) => {
                const dataFomart = res.rows.map((item) => {
                 if (item?.count) {
                 item.firstWarn = item.count?.一级告警
                 item.secondWarn = item.count?.二级告警
                 }
                 return item
                 })
              return {
                //data: res.rows,
                data: dataFomart,
                total: res.total,
                success: true,
              };
            })
          }
            
          }
          columns={columns}
        />
      </div>
    </WrapContent>
  );
};
export default WarnCountTableList;
