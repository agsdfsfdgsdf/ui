import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, {useRef, useEffect, useState} from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  getPerceiveList,
  exportPerceive
} from './service';

import WrapContent from '@/components/WrapContent';
import { getDict } from '../../system/dict/service';

import {PerceiveType, PerceiveTypeParams} from "./data.d";


/**
 * 导出数据
 *
 * @param id
 */
const handleExport = async () => {
  const hide = message.loading('正在导出');
  try {
    await exportPerceive();
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const PerceiveTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();

  const [obstacleTypeOptions, setObstacleTypeOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDict('operation_obstacle_type').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setObstacleTypeOptions(opts);
      }
    });
  }, []);


  const columns: ProColumns<PerceiveType>[] = [
    {
      title: '集卡号',
      dataIndex: 'deviceNum',
      valueType: 'text',
    },
    {
      title: '障碍物类型',
      dataIndex: 'obstacleStatus',
      valueType: 'select',
      valueEnum: obstacleTypeOptions
    },
    {
      title: '障碍物尺寸',
      dataIndex: 'obstacleSize',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '障碍物横坐标',
      dataIndex: 'obstacleDistanceX',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '障碍物横坐标速度',
      dataIndex: 'obstacleSpeedX',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '障碍物纵坐标',
      dataIndex: 'obstacleDistanceY',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '障碍物纵坐标速度',
      dataIndex: 'obstacleSpeedY',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '障碍物碰撞时间',
      dataIndex: 'obstacleCollision',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '障碍物置信度',
      dataIndex: 'obstacleSafelevel',
      valueType: 'text',
      hideInSearch: true
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<PerceiveType>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deviceNum"
          key="perceive"
          search={{
            labelWidth: 120,
            optionRender: ({searchText, resetText}, {form}, dom) => {
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
                    await handleExport();
                  }}
                >
                  <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
                </Button>,
              ]
            }
          }}
          request={(params) =>
            getPerceiveList({ ...params } as PerceiveTypeParams).then((res) => {
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

export default PerceiveTableList;
