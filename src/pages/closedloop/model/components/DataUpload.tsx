import React, { useRef, useState, useEffect } from 'react';
import { Alert, Button, Form, message, Radio, Row, Col, TreeSelect } from 'antd';
import Input from 'antd/lib/input/Input';
import UploadDragger from '../../upload/components/UploadDragger';
import { BizFromUploadFile, UploadStatus } from '../../upload/BizFromUploadFile';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import type { OSSInfoFull, UploadFileInfo } from '../../upload/data';
import { addModelData } from '../server';
import type { ModelType } from '../data';
import { queryCurrentUserInfo } from '@/pages/account/center/service';

type DataUploadProps = {
  show?: boolean;
  current: string | undefined;
  clickUploadStatus: () => void;
  cancel: () => void;
};

const DataUpload: React.FC<DataUploadProps> = (props: DataUploadProps) => {
  const modeldata_key = 'modeldata_upload';
  const uploadRef = useRef<any>();

  const {current} = props;

  let creator;
  const [disable, setDisable] = useState<boolean>(false);
  const [currentDir, setCurrentDir] = useState<boolean>(true);
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
    props?.cancel();
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      if (!values || !values.version || values.version === '') {
        message.error('未检测到版本号，请手动输入！');
        return;
      }
      if (!values || !values.filename || values.filename === '') {
        message.error('未检测到文件名，请手动输入！');
        return;
      }
      const oss = (await BizFromUploadFile.getOssOptions()) as OSSInfoFull;

      if (oss && oss.data && oss.data.securityToken) {
        BizFromUploadFile.initOssClient(oss.data);
        BizFromUploadFile.uploadFile(
          BizFromUploadFile.getFileList(modeldata_key).filter(
            (file) => file.uploadStatus === UploadStatus.WAITING,
          )[0],
        );

        setDisable(true);
        props?.clickUploadStatus();
      } else {
        message.error('数据上传失败！');
      }
    } catch (errInfo) {
      console.log(errInfo);
      message.error('数据上传失败！！');
    }
  };

  useEffect(() => {
    queryCurrentUserInfo().then((result) => {
      creator = result?.data?.user?.userName;
    });

    const rowFiles = BizFromUploadFile.getFileList(modeldata_key);
    if (rowFiles && rowFiles.length > 0) {
      rowFiles.forEach((file) => {
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
              file.upkey === modeldata_key &&
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

        if (data && data.upkey === modeldata_key) {
          console.log('上传完成', data, creator);
          const result = await addModelData({
            creator: creator ? creator : 'none',
            name: values.filename,
            version: values.version,
            fileName: data.fileName,
            url: data.fileUrl,
            type: data.fileType,
            size: data.fileSize,
          } as ModelType);
          console.log('提交结果', result);

          uploadRef.current?.refresh();
        }
      },
    });

    return () => {
      dataSub.unsubscribe();
      dataSub1.unsubscribe();
      DataBus.destroy(DataTypeConfig.ACTION_UPLOAD);
      DataBus.destroy(DataTypeConfig.ACTION_UPLOAD_COMPLETE);
    };
  }, []);

  return (
    <div>
      <div style={{ padding: '10px 16px', clear: 'both', display: props.show ? 'block' : 'none' }}>
        <Form form={form} layout="horizontal" onFinish={onFinish}>
          <Form.Item>
            <Alert
              message="提示：上传压缩包文件成功后，后台需解压获取目录结构方可显示在模型管理列表页，请刷新页面耐心等待！"
              type="info"
              showIcon
              style={{ float: 'left' }}
            />
            <Button
              type="link"
              style={{ margin: '10px 16px', float: 'right', cursor: 'pointer' }}
              onClick={() => {
                props?.clickUploadStatus();
                console.log('任务列表');
              }}
            >
              任务列表
            </Button>
          </Form.Item>

          <Form.Item
            name="uploadTo"
            label="上传到："
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
          >
            <Radio.Group
              onChange={(event) => {
                setCurrentDir(event.target.value === 1);
              }}
              defaultValue={1}
            >
              <Radio value={1}>当前目录</Radio>
              <Radio value={2}>指定目录</Radio>
            </Radio.Group>
          </Form.Item>
          <Row style={{ marginBottom: 20, minHeight: 36 }}>
            <Col span={2}></Col>
            <Col>
              {currentDir ? (
                '模型管理：//' + (current || '')
              ) : (
                <TreeSelect placeholder="请选择目录！" disabled={disable} />
              )}
            </Col>
          </Row>
          <Form.Item
            name="version"
            label="版本号："
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
          >
            <Input placeholder="请输入版本号！" disabled={disable} />
          </Form.Item>
          <Form.Item name="filename" label="文件名：" labelCol={{ span: 2 }} wrapperCol={{ span: 14 }}>
            <Input placeholder="请输入文件名！" disabled={disable} />
          </Form.Item>
          <Form.Item
            name="files"
            label="待上传文件："
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <UploadDragger
              onRef={uploadRef}
              upkey={modeldata_key}
              fileDir=""
              onChangeInfo={(project, vin) => {
                if (project && vin) {
                  form.setFieldValue('project', project);
                  form.setFieldValue('vin', vin);
                }
              }}
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
