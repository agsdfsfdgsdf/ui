import React, { useEffect, useState } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { Form, Modal, Row, Col, Timeline } from 'antd';
import type { RecordType, RecordListParams } from '../data';
import { getRecordProgress } from '../service';

export type RecordFormValueType = Record<string, unknown> & Partial<RecordType>;

export type VehicleFormProps = {
  onCancel: (flag?: boolean, formVals?: RecordFormValueType) => void;
  onSubmit: (values: RecordFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<RecordType>;
  apps: any[];
  otaUpgradeProgressOptions: any[];
};

const RecordForm: React.FC<VehicleFormProps> = (props) => {
  const [form] = Form.useForm();

  const applyList = props.apps;

  const [pregressData, setProgressData] = useState<any>([]);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      vin: props.values.vin,
      dataType: props.values.dataType,
      oldVersionCode: props.values.oldVersionCode,
      versionCode: props.values.versionCode,
      status: props.values.status,
      createTime: props.values.createTime,
    });

    if (props.values.vin && props.values.dataType && props.values.versionCode) {
      getRecordProgress(props.values.vin, props.values.dataType, props.values.versionCode).then(
        (res) => {
          if (res && res.code === 200) {
            setProgressData(res.data);
          }
        },
      );
    }
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = (values: Record<string, any>) => {
    props.onSubmit({ ...values } as RecordListParams);
  };

  const a = applyList && applyList.filter((app) => app.id === props.values.dataType);

  return (
    <Modal
      width={640}
      title="升级记录日志"
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <ProFormText name="id" hidden={true} initialValue={props.values.vin} />
        <Row gutter={[16, 16]}>
          <Col span={10}>
            <span>车辆VIN: {props.values.vin}</span>
          </Col>
          <Col span={7}>
            <span>应用名称: {a && a[0] && a[0].apply ? a[0].apply : '-'}</span>
          </Col>
          <Col span={7}>
            <span>升级版本: {props.values.versionCode}</span>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Timeline style={{ marginTop: 30 }}>
              {pregressData &&
                pregressData.map((data, index) => {
                  return (
                    <Timeline.Item key={'data_' + index}>
                      {data.createTime +
                        '\t' +
                        (props.otaUpgradeProgressOptions[data.progress] ||
                          data.description ||
                          '获取状态失败')}
                    </Timeline.Item>
                  );
                })}
            </Timeline>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RecordForm;
