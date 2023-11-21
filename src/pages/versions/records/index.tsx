import type { FormInstance } from 'antd';
import { Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { RecordType, RecordListParams } from './data.d';
import { getRecordList } from './service';
import UpdateForm from './components/info';

import WrapContent from '@/components/WrapContent';
import { getApplyList } from '../upload/service';
import { getDict } from '@/pages/system/dict/service';

const RecordTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const [applyList, setApplyList] = useState<any[]>();
  const [currentRow, setCurrentRow] = useState<RecordType>();
  const [otaUpgradeStatusOptions, setOtaUpgradeStatusOptions] = useState<any>([]);
  const [otaUpgradeProgressOptions, setOtaUpgradeProgressOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDict('ota_upgrade_status').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setOtaUpgradeStatusOptions(opts);
      }
    });

    getDict('ota_upgrade_progress').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setOtaUpgradeProgressOptions(opts);
      }
    });

    getApplyList().then((res) => {
      if (res && res.code === 200) {
        setApplyList(res.rows);
      }
    });
  }, []);

  const columns: ProColumns<RecordType>[] = [
    {
      title: <FormattedMessage id="vehicle.list.vin" defaultMessage="车辆VIN" />,
      dataIndex: 'vin',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="versions.records.appName" defaultMessage="应用名称" />,
      valueType: 'text',
      render: (_, record) => {
        const a = applyList && applyList.filter((app) => app.id === record.dataType);
        return <span>{a && a[0] && a[0].apply ? a[0].apply : '-'}</span>;
      },
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.app.versionName" defaultMessage="应用名称" />,
      dataIndex: 'dataType',
      valueType: 'select',
      valueEnum: () => {
        const opts = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        applyList &&
          applyList.forEach((item) => {
            opts[item.id] = item.apply;
          });
        return opts;
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="versions.records.oldVersion" defaultMessage="原版本" />,
      dataIndex: 'oldVersionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.records.currentVersion" defaultMessage="升级版本" />,
      dataIndex: 'versionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="versions.records.upgradeStatus" defaultMessage="升级状态" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: otaUpgradeStatusOptions,
    },
    {
      title: <FormattedMessage id="versions.records.upgradeTime" defaultMessage="升级时间" />,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => <span>{record.createTime}</span>,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
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
          key="info"
          hidden={!access.hasPerms('versions:records:info')}
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.searchTable.info" defaultMessage="查看详情" />
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<RecordType>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="recordList"
          search={{
            labelWidth: 120,
          }}
          request={(params) => {
            console.log({ ...params } as RecordListParams);
            return getRecordList({ ...params } as RecordListParams).then((res) => {
              if (!res) return {};

              return {
                data: res.rows,
                total: res.total,
                success: true,
              };
            });
          }}
          columns={columns}
        />
      </div>
      <UpdateForm
        onSubmit={async () => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        visible={modalVisible}
        values={currentRow || {}}
        apps={applyList || []}
        otaUpgradeProgressOptions={otaUpgradeProgressOptions}
      />
    </WrapContent>
  );
};

export default RecordTableList;
