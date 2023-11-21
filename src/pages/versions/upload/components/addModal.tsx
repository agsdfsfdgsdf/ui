import React, { useEffect } from 'react';
import { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Modal, Row, Col, message } from 'antd';
import { useIntl, FormattedMessage, useRequest } from 'umi';
import type { OTAFileType, OTAVersion } from '../data';
import { AliyunOSSUpload } from './AliyunOSSUpload';
import { useState } from 'react';
import { queryCurrentUserInfo } from '../service';

export type OTAUploadFormValueType = Record<string, unknown> & Partial<OTAFileType>;

export type OTAFormProps = {
  onCancel: (flag?: boolean, formVals?: OTAUploadFormValueType) => void;
  onSubmit: (values: OTAUploadFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<OTAVersion>;
  vehicleProtocolOptions: any;
  vehicleTypeOptions: any;
  otaUpdateTypeOptions: any;
};

const UploadForm: React.FC<OTAFormProps> = (props) => {
  const [form] = Form.useForm();

  const { vehicleProtocolOptions, vehicleTypeOptions, otaUpdateTypeOptions } = props;

  const [versionEnable, setVersionEnable] = useState<boolean>(true);
  const [fileInfo, setFileInfo] = useState<any>({});
  const [fileProgress, setFileProgress] = useState<number>(0);
  //const [ apply, setApply] = useState<string>('');
  const [versionCode, setVersionCode] = useState<string>('');

  const { data: userInfo } = useRequest(() => {
    return queryCurrentUserInfo();
  });

  useEffect(() => {
    form.resetFields();
    setFileInfo({});
    console.log(props.values);
    form.setFieldsValue({
      id: props.values.id,
      apply: props.values?.apply,
      dataType: props.values?.dataType,
      maxVersionCode: props.values?.maxVersionCode,
      description: '',
    });
    setVersionEnable(true);
    setVersionCode('');
  }, [form, props]);

  const intl = useIntl();
  const handleOk = () => {
    if (!fileInfo || !fileInfo.md5 || !fileInfo.fileSize) {
      message.error('未获取到正确的文件信息!');
      return;
    }
    console.log(fileProgress);

    if (fileProgress < 100) {
      message.error('文件传输未完成，请稍候!');
      return;
    }
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = (values: Record<string, any>) => {
    values.md5 = fileInfo.md5;
    values.fileName = fileInfo.fileName;
    values.fileSize = fileInfo.fileSize;
    values.fileUrl = props.values?.dataType + '/' + versionCode + '/' + fileInfo.fileName;
    values.uploader = userInfo?.user?.userName;
    props.onSubmit({ ...values } as OTAUploadFormValueType);
  };

  const checkVersion = (rule: any, value: string) => {
    const maxVersionCode = form.getFieldValue('maxVersionCode');

    console.log(maxVersionCode, maxVersionCode && maxVersionCode.indexOf('.'));
    if (
      maxVersionCode &&
      maxVersionCode.indexOf('.') !== -1 &&
      maxVersionCode.split('.') &&
      maxVersionCode.split('.').length === 3
    ) {
      if (
        !value ||
        value.indexOf('.') === -1 ||
        !value.split('.') ||
        value.split('.').length !== 3
      ) {
        return Promise.reject(new Error('请输入正确版本编号，格式：数字.数字.数字'));
      }

      const maxVersion =
        Number.parseInt(maxVersionCode.split('.')[0]) * 100 +
        Number.parseInt(maxVersionCode.split('.')[1]) * 10 +
        Number.parseInt(maxVersionCode.split('.')[2]);
      const currentVersion =
        Number.parseInt(value.split('.')[0]) * 100 +
        Number.parseInt(value.split('.')[1]) * 10 +
        Number.parseInt(value.split('.')[2]);
      console.log(maxVersion + ' --------- ' + currentVersion);
      if (Number.isNaN(currentVersion)) {
        return Promise.reject(new Error('请输入正确版本编号，格式：数字.数字.数字'));
      }
    }

    if (!value || value.indexOf('.') === -1 || !value.split('.') || value.split('.').length !== 3) {
      return Promise.reject(new Error('请输入正确版本编号，格式：数字.数字.数字'));
    }

    return Promise.resolve();
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({ id: 'versions.add.title', defaultMessage: '创建新版本' })}
      visible={props.visible}
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="dataType"
              disabled={true}
              label="应用ID"
              width="xl"
              hidden={true}
              initialValue={props.values.dataType}
            />
            <ProFormText
              name="apply"
              disabled={props.values.apply ? true : false}
              label="应用名称"
              width="xl"
              placeholder="请输入应用名称"
              rules={[
                {
                  required: true,
                  message: '请输入应用名称!',
                },
              ]}
              initialValue={props.values.apply}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="versionCode"
              label={intl.formatMessage({
                id: 'versions.list.versionCode',
                defaultMessage: '版本编号',
              })}
              width="xl"
              placeholder="请输入版本编号，如 1.1.0"
              disabled={!versionEnable}
              onChange={(e: any) => {
                setVersionCode(e.target.value);
              }}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="versions.edit.versionCode"
                      defaultMessage="请输入版本编号，如 1.1.0"
                    />
                  ),
                },
                {
                  validator: checkVersion,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              valueEnum={otaUpdateTypeOptions}
              name="updateType"
              label={intl.formatMessage({
                id: 'versions.list.type',
                defaultMessage: '更新标识',
              })}
              width="xl"
              placeholder="请选择版本更新标识"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="versions.edit.updateType"
                      defaultMessage="请选择版本更新标识！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              valueEnum={vehicleTypeOptions}
              name="vehicleType"
              label={intl.formatMessage({
                id: 'vehicle.list.vehicleType',
                defaultMessage: '车辆类型',
              })}
              width="xl"
              placeholder="请选择车辆类型"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.vehicleType"
                      defaultMessage="请选择车辆类型！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              valueEnum={vehicleProtocolOptions}
              name="protocol"
              label={intl.formatMessage({
                id: 'vehicle.list.protocol',
                defaultMessage: '协议类型',
              })}
              width="xl"
              placeholder="请选择协议类型"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.protocolTip"
                      defaultMessage="请选择协议类型！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="description"
              label={intl.formatMessage({
                id: 'versions.list.description',
                defaultMessage: '版本描述',
              })}
              width="xl"
              placeholder="请描述该版本更新内容"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="versions.edit.description"
                      defaultMessage="版本描述内容不能为空！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 22]}>
          <Col span={24} order={1} style={{ marginBottom: 20 }}>
            <span>&nbsp;上传文件：&nbsp; </span>
            <AliyunOSSUpload
              directory={props.values?.dataType + '/' + versionCode}
              openFileDialogOnClick={versionCode !== ''}
              onChange={(fileList) => {
                console.log(fileList);
                setVersionEnable(!(fileList && fileList.length > 0));
              }}
              onUploadProgress={(percent) => {
                setFileProgress(percent);
              }}
              onFileResult={(md5: string, fileName: string, fileSize: number) => {
                setFileInfo({ md5, fileName, fileSize });
              }}
            />
          </Col>
          <Col span={24} order={2}>
            {!versionCode && (
              <span style={{ color: '#F00' }}>注： 请填写版本编号后选择上传文件！</span>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UploadForm;
