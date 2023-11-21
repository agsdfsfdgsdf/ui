import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, Form, message } from 'antd';
import { BizFromUploadFile, UploadStatus } from '../../upload/BizFromUploadFile';
import UploadDragger from '../../upload/components/UploadDragger';
import { ProFormRadio } from '@ant-design/pro-form';
import type { OSSInfoFull, UploadFileInfo } from '../../upload/data';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { addDataSet } from '../server';
import type { DataSetType } from '../data';

type DataUploadProps = {
  dataSet: DataSetType;
  markStatus?: any;
  show?: boolean;
  clickUploadStatus: () => void;
  cancel: () => void;
};

const DataUpload: React.FC<DataUploadProps> = (props: DataUploadProps) => {
  const dataset_key = 'dataset_upload';
  const uploadRef = useRef<any>();

  const { dataSet } = props;

  const [disable, setDisable] = useState<boolean>(false);

  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
    props?.cancel();
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      if (!values || !values.marking || values.marking === '') {
        message.error('未检测到标注状态，请重新选择！');
        return;
      }

      const oss = (await BizFromUploadFile.getOssOptions()) as OSSInfoFull;
      if (oss && oss.data && oss.data.securityToken) {
        BizFromUploadFile.initOssClient(oss.data);
        BizFromUploadFile.setMarking(values.marking);
        BizFromUploadFile.uploadFile(
          BizFromUploadFile.getFileList(dataset_key).filter(
            (file) => file.uploadStatus === UploadStatus.WAITING,
          )[0],
        );

        setDisable(true);
        props?.clickUploadStatus();
      } else {
        message.error('数据上传失败！');
      }
    } catch (errInfo) {
      message.error('数据上传失败！！');
    }
  };

  useEffect(() => {
    const setFiles = BizFromUploadFile.getFileList(dataset_key);
    if (setFiles && setFiles.length > 0) {
      setFiles.forEach((file) => {
        if (file && file.uploadStatus === UploadStatus.WAITING) {
          BizFromUploadFile.removeFile(file.uid);
        }
      });
    }

    const dataSub = DataBus.subscribe({
      type: DataTypeConfig.ACTION_UPLOAD,
      callback: (data) => {
        if (data) {
          const uploadFiles = data.filter(
            (file: UploadFileInfo) =>
              file.upkey === dataset_key &&
              (file.fileStatus === UploadStatus.UPLOADING ||
                file.fileStatus === UploadStatus.WAITING),
          );
          if (!uploadFiles || uploadFiles.length === 0) {
            setDisable(false);
          }
        }
      },
    });

    const dataSub1 = DataBus.subscribe({
      type: DataTypeConfig.ACTION_UPLOAD_COMPLETE,
      callback: async (data: UploadFileInfo) => {
        const values = await form.validateFields();
        console.log('Submit:', values);

        if (data && data.upkey === dataset_key) {
          console.log('上传完成', data);
          const cid = dataSet.cid;
          console.log('cid', cid);
          const result = await addDataSet({
            cid: cid,
            fileName: data.fileName,
            url: data.fileUrl,
            type: data.fileType,
            size: data.fileSize,
            marking: data.marking,
          } as DataSetType);
          console.log('提交结果', result);

          if (result && result.code === 200) {
            uploadRef?.current?.refresh();
          } else {
            message.error(result.message);
          }
        }
      },
    });

    return () => {
      dataSub.unsubscribe();
      dataSub1.unsubscribe();
      DataBus.destroy(DataTypeConfig.ACTION_UPLOAD);
      DataBus.destroy(DataTypeConfig.ACTION_UPLOAD_COMPLETE);
    };
  }, [dataSet.cid, form]);

  return (
    <div>
      <div style={{ padding: '10px 16px', clear: 'both', display: props.show ? 'block' : 'none' }}>
        <Form form={form} layout="horizontal" onFinish={onFinish}>
          <Form.Item>
            <Alert
              message="提示：上传压缩包文件成功后，后台需解压获取目录结构方可显示在数据集管理列表页，请刷新页面耐心等待！"
              type="info"
              showIcon
              style={{ float: 'left' }}
            />
            <Button
              type="link"
              style={{ margin: '10px 16px', float: 'right', cursor: 'pointer' }}
              onClick={() => {
                props?.clickUploadStatus();
              }}
            >
              任务列表
            </Button>
          </Form.Item>
          <Form.Item
            name="files"
            label="待上传文件："
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <UploadDragger onRef={uploadRef} upkey={dataset_key} fileDir={dataSet.url} />
          </Form.Item>
          <Form.Item
            name="marking"
            label="是否标注："
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
          >
            <ProFormRadio.Group
              valueEnum={props?.markStatus}
              name="protocol"
              label={false}
              disabled={disable}
              width="xl"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 20, offset: 2 }}>
            <Button htmlType="submit" type="primary" disabled={disable}>
              上传文件
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              htmlType="button"
              onClick={() => {
                onReset();
                uploadRef?.current?.cancel();
              }}
              disabled={disable}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DataUpload;
