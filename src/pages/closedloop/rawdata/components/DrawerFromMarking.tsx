import React, { useEffect } from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { Form, Row, Col, Alert, Button, Drawer } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { MarkingType } from '../data';
import { CloseOutlined } from '@ant-design/icons';

export type MarkingFormValueType = Record<string, unknown> & Partial<MarkingType>;

export type MarkingFormProps = {
  label?: MarkingType | undefined | false;
  weathers?: any;
  events?: any;
  times?: any;
  show?: boolean;
  onCancel: (flag?: boolean, formVals?: MarkingFormValueType) => void;
  onSubmit: (values: MarkingFormValueType) => Promise<void>;
};

const DrawerFromMarking: React.FC<MarkingFormProps> = (props: MarkingFormProps) => {
  const [form] = Form.useForm();

  const { label, weathers, events, times, show } = props;

  useEffect(() => {
    form.resetFields();
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
    props.onSubmit({ ...values } as MarkingFormValueType);
  };

  return (
    <Drawer
      width={640}
      title={'数据标签'}
      placement="right"
      closable={false}
      onClose={handleCancel}
      open={show}
      key="uploadTask"
      footer={[
        <Button key="submit" type="primary" style={{ marginLeft: 30 }} onClick={handleOk}>
          确定
        </Button>,
        <Button key="back" style={{ marginLeft: 20 }} onClick={handleCancel}>
          取消
        </Button>,
      ]}
      extra={[<CloseOutlined key="closeUploadTask" onClick={handleCancel} />]}
    >
      <Alert
        message="方便用户在搜索中快速找到所需数据"
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Form form={form} onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              name="weather"
              label={intl.formatMessage({
                id: 'rawdata.marking.weather',
                defaultMessage: '天气',
              })}
              width="xl"
              placeholder="请选择"
              valueEnum={weathers}
              initialValue={label && label.weather ? label.weather : ''}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="rawdata.marking.weatherTip"
                      defaultMessage="请选择天气！"
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
              name="event"
              label={intl.formatMessage({
                id: 'rawdata.marking.event',
                defaultMessage: '事件',
              })}
              width="xl"
              placeholder="请选择"
              initialValue={label && label.event ? label.event : ''}
              valueEnum={events}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage id="rawdata.marking.eventTip" defaultMessage="请选择事件！" />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              name="timeInterval"
              label={intl.formatMessage({
                id: 'rawdata.marking.time',
                defaultMessage: '时段',
              })}
              width="xl"
              placeholder="请选择"
              valueEnum={times}
              initialValue={label && label.timeInterval ? label.timeInterval : ''}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage id="rawdata.marking.timeTip" defaultMessage="请选择时段！" />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default DrawerFromMarking;
