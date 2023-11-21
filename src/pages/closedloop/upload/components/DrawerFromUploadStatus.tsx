import React from 'react';
import { Alert, Drawer } from 'antd';
import Tabs from 'antd/es/tabs';
import { CloseOutlined } from '@ant-design/icons';
import type { UploadFileInfo } from '../data';
import StatusWithUpload from "@/pages/closedloop/upload/components/StatusWithUpload";
import StatusWithUnzip from "@/pages/closedloop/upload/components/StatusWithUnzip";
import StatusWithDownZip from "@/pages/closedloop/upload/components/StatusWithDownZip";

export type UploadFileInfoFormValueType = Record<string, unknown> & Partial<UploadFileInfo>;

export type UploadStatusFormProps = {
  upkey: string;
  show?: boolean;
  onCancel?: (flag?: boolean, formVals?: UploadFileInfoFormValueType) => void;
  onSubmit?: (values: UploadFileInfoFormValueType) => Promise<void>;
};

const DrawerFromUploadStatus: React.FC<UploadStatusFormProps> = (props: any) => {
  const { show, upkey } = props;

  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Drawer
      title="任务列表"
      placement="right"
      closable={false}
      onClose={handleCancel}
      open={show}
      key="uploadTask"
      width={940}
      extra={[<CloseOutlined key="closeUploadTask" onClick={handleCancel} />]}
    >
      <Alert
        message="刷新或关闭浏览器会取消当前上传任务，并清除全部记录。"
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `上传列表`,
            key: 'uploadStatus',
            children: (
              <StatusWithUpload  upkey={upkey} />
            ),
          },
          {
            label: `解压列表`,
            key: 'unzipStatus',
            children: (
              <StatusWithUnzip upkey={upkey} />
            ),
          },
          {
            label: `压缩列表`,
            key: 'downZipStatus',
            children: (
              <StatusWithDownZip  upkey={upkey}/>
            ),
          },
        ]}
      />
    </Drawer>
  );
};

export default DrawerFromUploadStatus;
