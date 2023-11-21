import type { UploadFile } from 'antd';
import { message } from 'antd';
import { Alert, Button, Upload } from 'antd';
import { useImperativeHandle, useState, useReducer } from 'react';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import styles from '../style.less';
import { BizFromUploadFile, UploadStatus } from '../BizFromUploadFile';
import type { UploadFileInfo } from '../data';

/**
 * 拖拽上传组件，管理列表识别及展示
 */
export type UploadFormProps = {
  upkey: string;
  fileDir: string;
  show?: boolean;
  onRef?: any;
  onChangeInfo?: any;
};

const UploadDragger: React.FC<UploadFormProps> = (props: any) => {
  const { upkey, fileDir, onChangeInfo } = props;

  const { Dragger } = Upload;
  const [fileUploadList, setFileUploadList] = useState<UploadFileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [any, forceUpdate] = useReducer((num) => {
    return num + 1;
  }, 1);

  useImperativeHandle(props.onRef, () => {
    return {
      refresh: refresh,
      cancel: cancel,
    };
  });

  function refresh() {
    setFileUploadList([]);
    forceUpdate();
  }

  function cancel() {
    fileUploadList.forEach((file) => {
      if (file && file.uid) {
        BizFromUploadFile.removeFile(file.uid);
      }
    });
    setFileUploadList([]);
    forceUpdate();
  }

  let timer;

  const uploadProps: UploadProps = {
    name: 'file',
    accept: upkey === 'rawdata_upload' ? '.zip' : '.zip,.json',
    multiple: true,
    maxCount: 10000,
    directory: false,
    onChange(info) {
      console.log(info.fileList.length);
      if (info.fileList.length > 10000) {
        message.error('每次上传文件个数不得超过10000个，请分批上传文件！');
        return;
      }

      const file: UploadFile = info.fileList.filter((file0) => file0.uid === info.file.uid)[0];

      if (!file) return;

      if (!loading) {
        setLoading(true);
      }

      BizFromUploadFile.putFileList({
        uid: file.uid,
        upkey: upkey,
        fileName: file.name,
        fileSize: file.size ? file.size : 0,
        fileStatus: '已扫描完成',
        fileDir: fileDir,
        fileType: file.type ? file.type : '未知',
        fileObj: file.originFileObj,
        fileUrl: file.originFileObj?.webkitRelativePath
          ? file.originFileObj?.webkitRelativePath
          : '',
        progress: 0,
        uploadStatus: UploadStatus.WAITING,
        currentCheckPoint: null,
      });
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        let fileList = BizFromUploadFile.getFileList(upkey);

        const newFileList = fileList.filter((file11) => {
          const inFile = info.fileList.filter((filei) => file11.uid === filei.uid);
          return inFile && inFile.length === 1;
        });

        setFileUploadList(newFileList);

        fileList = fileList.filter((fileP) => fileP.uploadStatus === UploadStatus.WAITING);

        if (
          fileList &&
          fileList.length > 0 &&
          fileList[0] &&
          fileList[0].fileName &&
          fileList[0].fileName.indexOf('_') !== -1
        ) {
          const infos = fileList[0].fileName.split('_');
          if (onChangeInfo && infos.length > 2) {
            onChangeInfo(infos[0], infos[1]);
          }
        }
        setLoading(false);
      }, 500);
    },
    showUploadList: false,
    beforeUpload: () => {
      return false;
    },
  };

  const columns: ProColumns<UploadFileInfo>[] = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      valueType: 'text',
      width: '60%',
      align: 'left',
      render: (_, record) => {
        if (record.fileName.length > 100) {
          return record.fileName.substring(0, 100) + '...';
        }
        return record.fileName;
      },
    },
    {
      title: '文件大小(KB)',
      dataIndex: 'fileSize',
      valueType: 'text',
      width: '15%',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      width: '15%',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'options',
      width: '10%',
      align: 'center',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              BizFromUploadFile.removeFile(record.uid);
              setFileUploadList(fileUploadList.filter(({ uid }) => uid !== record.uid));
            }}
          >
            移除
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Dragger {...uploadProps} key={any}>
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined color="#40A9FF" />
        </p>
        <p className="ant-upload-hint">
          拖拽本地单个文件或多个文件至此处，或
          <span style={{ color: '#40A9FF' }}>添加文件</span>
        </p>

        <Alert
          message="添加的文件大小不能超过20GB,文件个数不得超过10000个！"
          type="warning"
          showIcon
          style={{ width: '60%', marginLeft: '20%', marginTop: '10px' }}
        />
      </Dragger>
      <ProTable<UploadFileInfo>
        headerTitle=""
        rowKey="uid"
        key="uid"
        className={styles.uploadTable}
        search={false}
        dataSource={fileUploadList}
        columns={columns}
        pagination={false}
        loading={loading}
        toolbar={{
          style: {
            display: 'none',
          },
        }}
      />
    </div>
  );
};

export default UploadDragger;
