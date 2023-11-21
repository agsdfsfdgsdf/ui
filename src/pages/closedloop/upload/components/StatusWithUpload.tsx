import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import Tabs from 'antd/es/tabs';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';
import { BizFromUploadFile, UploadStatus } from '../BizFromUploadFile';
import styles from '../style.less';
import type { UploadFileInfo } from '../data';

export type UploadFileInfoFormValueType = Record<string, unknown> & Partial<UploadFileInfo>;

export type UploadStatusFormProps = {
  upkey: string;
  show?: boolean;
  onCancel?: (flag?: boolean, formVals?: UploadFileInfoFormValueType) => void;
  onSubmit?: (values: UploadFileInfoFormValueType) => Promise<void>;
};

const StatusWithUpload: React.FC<UploadStatusFormProps> = (props: any) => {
  const { upkey } = props;

  const [uploadData, setUploadData] = useState<UploadFileInfo[]>(
    BizFromUploadFile.getFileList(upkey),
  );

  useEffect(() => {
    const dataSub = DataBus.subscribe({
      type: DataTypeConfig.ACTION_UPLOAD,
      callback: (data) => {
        if (data) {
          setUploadData(data.filter((file: UploadFileInfo) => file.upkey === upkey));
        }
      },
    });

    return () => {
      dataSub.unsubscribe();
    };
  }, [props]);

  const columns: ProColumns<UploadFileInfo>[] = [
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
        if (record.uploadStatus === UploadStatus.UPLOADING) {
          return record.progress + '%';
        }
        return (
          <span
            className={
              record.uploadStatus === UploadStatus.COMPLETE
                ? styles.itemSpanGreen
                : record.uploadStatus === UploadStatus.FAILURE
                ? styles.itemSpanRed
                : styles.itemSpanDefault
            }
          >
            {record.uploadStatus}
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
          record.uploadStatus === UploadStatus.UPLOADING ||
          record.uploadStatus === UploadStatus.WAITING
        ) {
          return (
            <Row>
              <Col>
                <Button
                  type="link"
                  onClick={() => {
                    BizFromUploadFile.updateUploadStatus(record.uid, UploadStatus.CANCEL);
                  }}
                >
                  暂停
                </Button>
              </Col>
              <Col>
                <Button
                  type="link"
                  onClick={() => {
                    BizFromUploadFile.updateUploadStatus(record.uid, UploadStatus.DESTROY);
                  }}
                >
                  终止
                </Button>
              </Col>
            </Row>
          );
        } else if (
          record.uploadStatus === UploadStatus.PAUSE ||
          record.uploadStatus === UploadStatus.CANCEL ||
          record.uploadStatus === UploadStatus.FAILURE
        ) {
          return (
            <Button
              type="link"
              onClick={() => {
                BizFromUploadFile.uploadFile(record);
              }}
            >
              {record.uploadStatus === UploadStatus.FAILURE ? '重试' : '继续'}
            </Button>
          );
        } else if (record.uploadStatus === UploadStatus.COMPLETE) {
          return (
            <Button
              type="link"
              onClick={() => {
                BizFromUploadFile.removeFile(record.uid);
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
            label: `全部(${uploadData.length})`,
            key: '1',
            children: (
              <ProTable<UploadFileInfo>
                headerTitle=""
                rowKey={(record) => {
                  return `all_${record && record.uid ? record.uid : ''}`;
                }}
                key="allUploadData"
                search={false}
                dataSource={uploadData}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `上传中(${
              uploadData.filter((file) => file.uploadStatus === UploadStatus.UPLOADING).length
            })`,
            key: '2',
            children: (
              <ProTable<UploadFileInfo>
                headerTitle=""
                rowKey={(record) => {
                  return `upload_${record && record.uid ? record.uid : ''}`;
                }}
                key="uploadData"
                search={false}
                dataSource={uploadData.filter(
                  (file) => file.uploadStatus === UploadStatus.UPLOADING,
                )}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `已停止(${
              uploadData.filter((file) => file.uploadStatus === UploadStatus.PAUSE).length
            })`,
            key: '3',
            children: (
              <ProTable<UploadFileInfo>
                headerTitle=""
                rowKey={(record) => {
                  return `pause_${record && record.uid ? record.uid : ''}`;
                }}
                key="pauseData"
                search={false}
                dataSource={uploadData.filter((file) => file.uploadStatus === UploadStatus.PAUSE)}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `上传成功(${
              uploadData.filter((file) => file.uploadStatus === UploadStatus.COMPLETE).length
            })`,
            key: '4',
            children: (
              <ProTable<UploadFileInfo>
                headerTitle=""
                rowKey={(record) => {
                  return `complete_${record && record.uid ? record.uid : ''}`;
                }}
                key="completeData"
                search={false}
                dataSource={uploadData.filter(
                  (file) => file.uploadStatus === UploadStatus.COMPLETE,
                )}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          },
          {
            label: `上传失败(${
              uploadData.filter((file) => file.uploadStatus === UploadStatus.FAILURE).length
            })`,
            key: '5',
            children: (
              <ProTable<UploadFileInfo>
                headerTitle=""
                rowKey={(record) => {
                  return `failure_${record && record.uid ? record.uid : ''}`;
                }}
                key="failureData"
                search={false}
                dataSource={uploadData.filter((file) => file.uploadStatus === UploadStatus.FAILURE)}
                columns={columns}
                rowSelection={false}
                toolBarRender={false}
              />
            ),
          }
        ]}
      />
  );
};

export default StatusWithUpload;
