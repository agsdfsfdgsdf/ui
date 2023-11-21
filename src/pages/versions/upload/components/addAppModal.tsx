import React, { useEffect } from 'react';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { OTAAppType, OTAVersion } from '../data';

export type OTAAppFormValueType = Record<string, unknown> & Partial<OTAAppType>;

export type OTAFormProps = {
  onCancel: (flag?: boolean, formVals?: OTAAppFormValueType) => void;
  onSubmit: (values: OTAAppFormValueType) => Promise<void>;
  values: Partial<OTAVersion>;
  visible: boolean;
};

const AppForm: React.FC<OTAFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      apply: props.values?.apply,
      id: props.values?.dataType,
      description: props.values?.description,
    });
  }, [form, props]);

  const intl = useIntl();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = (values: Record<string, any>) => {
    //values.uploader = userInfo?.user?.userName;
    console.log('Gunson', values);
    props.onSubmit({ ...values } as OTAAppFormValueType);
  };

  return (
    <Modal
      width={640}
      title={
        props.values?.dataType
          ? intl.formatMessage({ id: 'versions.appEdit.title', defaultMessage: '编辑应用' })
          : intl.formatMessage({ id: 'versions.appAdd.title', defaultMessage: '创建应用' })
      }
      visible={props.visible}
      destroyOnClose={true}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText name="id" label={'应用ID'} width="xl" hidden={true} disabled={true} />
            <ProFormText
              name="apply"
              label={intl.formatMessage({
                id: 'versions.list.appName',
                defaultMessage: '应用名称',
              })}
              width="xl"
              placeholder="请输入应用名称"
              rules={[
                {
                  required: true,
                  message: '请输入应用名称!',
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
                id: 'versions.list.appDescription',
                defaultMessage: '应用描述',
              })}
              width="xl"
              placeholder="请简略描述该应用"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="versions.edit.appDescription"
                      defaultMessage="请简略描述该应用！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AppForm;
