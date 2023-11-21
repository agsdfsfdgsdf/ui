import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import Tabs from 'antd/es/tabs';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';
import { UploadStatus } from '../BizFromUploadFile';
import styles from '../style.less';
import type {DownZipFile, UploadFileInfo} from '../data';
import {BizFromDownZipFile, DownZipStatus} from "@/pages/closedloop/upload/BizFromDownZipFile";

export type UploadFileInfoFormValueType = Record<string, unknown> & Partial<UploadFileInfo>;

export type UploadStatusFormProps = {
  upkey: string;
  show?: boolean;
  onCancel?: (flag?: boolean, formVals?: UploadFileInfoFormValueType) => void;
  onSubmit?: (values: UploadFileInfoFormValueType) => Promise<void>;
};

const StatusWithDownZip: React.FC<UploadStatusFormProps> = (props: any) => {
  const { upkey } = props;

  const type = upkey === 'dataset_upload' ? 2 : upkey === 'mirrordata_upload' ? 4 : upkey === 'modeldata_upload' ? 3 : 1;

  const [downZipData, setDownZipData] = useState<DownZipFile[]>(
    BizFromDownZipFile.getFileList(type),
  );

  useEffect(() => {
    const dataSub = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DOWNZIP,
      callback: (data) => {
        if (data) {
          setDownZipData(BizFromDownZipFile.getFileList(type));
        }
      },
    });

    return () => {
      dataSub.unsubscribe();
    };
  }, [props]);

  const columns: ProColumns<DownZipFile>[] = [
    {
      title: <FormattedMessage id="closeloop.upload.name" defaultMessage="名称" />,
      dataIndex: 'fileName',
      valueType: 'text',
      width: '55%',
      align: 'left',
    },
    {
      title: <FormattedMessage id="closeloop.upload.status" defaultMessage="状态" />,
      dataIndex: 'uploadStatus',
      valueType: 'text',
      width: '20%',
      align: 'center',
      render: (_, record) => {
        if (record.zipStatus === DownZipStatus.COMPRESSING) {
          return record.rate + '%';
        }
        return (
          <span
            className={
              record.zipStatus === DownZipStatus.COMPLETE
                ? styles.itemSpanGreen
                : record.zipStatus === DownZipStatus.FAILURE
                ? styles.itemSpanRed
                : styles.itemSpanDefault
            }
          >
            {record.rateDesc}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="closeloop.upload.options" defaultMessage="操作" />,
      dataIndex: 'options',
      valueType: 'text',
      width: '25%',
      align: 'center',
      render: (_, record) => {
        if (
          record.zipStatus === DownZipStatus.COMPRESSING ||
          record.zipStatus === DownZipStatus.WAITING
        ) {
          return (
            <Row>
              <Col>
                <Button
                  type="link"
                  onClick={() => {
                    BizFromDownZipFile.cancelDownZip(record);
                  }}
                >
                  取消
                </Button>
              </Col>
            </Row>
          );
        } else if (
          record.zipStatus === DownZipStatus.CANCEL ||
          record.zipStatus === DownZipStatus.FAILURE
        ) {
          return (
            <Button
              type="link"
              onClick={() => {
                BizFromDownZipFile.removeDownZip(record);
                BizFromDownZipFile.putFileList(record);
              }}
            >
              重试
            </Button>
          );
        } else if (record.zipStatus === UploadStatus.COMPLETE) {
          return (
            <Button
              type="link"
              onClick={() => {
                BizFromDownZipFile.removeDownZip(record);
              }}
            >
              清除记录
            </Button>
          );
        }
        return '-';
      },
    },
  ];

  return (
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            label: `全部(${downZipData.length})`,
            key: '1',
            children: (
              <ProTable<DownZipFile>
                headerTitle=""
                rowKey={(record) => {
                  return `all_${record && record.uid ? record.uid : ''}`;
                }}
                key="allUploadData"
                search={false}
                dataSource={downZipData}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `等待中(${
              downZipData.filter((file) => file.zipStatus === DownZipStatus.WAITING).length
            })`,
            key: '3',
            children: (
              <ProTable<DownZipFile>
                headerTitle=""
                rowKey={(record) => {
                  return `pause_${record && record.uid ? record.uid : ''}`;
                }}
                key="pauseData"
                search={false}
                dataSource={downZipData.filter((file) => file.zipStatus === DownZipStatus.WAITING)}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `打包中(${
              downZipData.filter((file) => file.zipStatus === DownZipStatus.COMPRESSING).length
            })`,
            key: '2',
            children: (
              <ProTable<DownZipFile>
                headerTitle=""
                rowKey={(record) => {
                  return `upload_${record && record.uid ? record.uid : ''}`;
                }}
                key="uploadData"
                search={false}
                dataSource={downZipData.filter(
                  (file) => file.zipStatus === DownZipStatus.COMPRESSING,
                )}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `打包成功(${
              downZipData.filter((file) => file.zipStatus === UploadStatus.COMPLETE).length
            })`,
            key: '4',
            children: (
              <ProTable<DownZipFile>
                headerTitle=""
                rowKey={(record) => {
                  return `complete_${record && record.uid ? record.uid : ''}`;
                }}
                key="completeData"
                search={false}
                dataSource={downZipData.filter(
                  (file) => file.zipStatus === UploadStatus.COMPLETE,
                )}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `打包失败(${
              downZipData.filter((file) => file.zipStatus === UploadStatus.FAILURE).length
            })`,
            key: '5',
            children: (
              <ProTable<DownZipFile>
                headerTitle=""
                rowKey={(record) => {
                  return `failure_${record && record.uid ? record.uid : ''}`;
                }}
                key="failureData"
                search={false}
                dataSource={downZipData.filter((file) => file.zipStatus === UploadStatus.FAILURE)}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
        ]}
      />
  );
};

export default StatusWithDownZip;
