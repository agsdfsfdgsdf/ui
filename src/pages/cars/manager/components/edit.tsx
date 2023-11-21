import React, { useEffect } from 'react';
import { ProFormText, ProFormRadio, ProFormTreeSelect } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { VehicleType } from '../data.d';
import { DataNode } from 'antd/lib/tree';

export type VehicleFormValueType = Record<string, unknown> & Partial<VehicleType>;

export type VehicleFormProps = {
  onCancel: (flag?: boolean, formVals?: VehicleFormValueType) => void;
  onSubmit: (values: VehicleFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<VehicleType>;
  vehicleProtocolOptions: any;
  vehicleTypeOptions: any;
  vehicleStatusOptions: any;
  depts: DataNode[];
};

const VehicleForm: React.FC<VehicleFormProps> = (props) => {
  const [form] = Form.useForm();

  const { vehicleProtocolOptions, vehicleTypeOptions, vehicleStatusOptions, depts } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.vin,
      vin: props.values.vin,
      plateNumber: props.values.plateNumber,
      company: props.values.company,
      protocol: props.values.protocol,
      vehicleType: props.values.vehicleType,
      vehicleStatus: props.values.vehicleStatus,
      createTime: props.values.createTime,
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
    props.onSubmit({ ...values } as VehicleFormValueType);
  };

  return (
    <Modal
      width={640}
      title={
        props.values.vin
          ? intl.formatMessage({
              id: 'vehicle.edit.title',
              defaultMessage: '编辑车辆信息',
            })
          : intl.formatMessage({
              id: 'vehicle.add.title',
              defaultMessage: '新增车辆信息',
            })
      }
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <ProFormText name="id" hidden={true} initialValue={props.values.vin} />
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="vin"
              label={intl.formatMessage({
                id: 'vehicle.list.vin',
                defaultMessage: '车辆VIN',
              })}
              width="xl"
              placeholder="请输入车辆VIN"
              disabled={props.values.vin ? true : false}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage id="vehicle.edit.vinTip" defaultMessage="请输入车辆VIN！" />
                  ),
                },
                {
                  pattern: /^[A-HJ-NPR-Z\d]{17}$/,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.vinTip2"
                      defaultMessage="请输入正确的车辆VIN！!"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="plateNumber"
              label={intl.formatMessage({
                id: 'vehicle.list.plateNumber',
                defaultMessage: '车牌号',
              })}
              width="xl"
              placeholder="请输入车牌号"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.plateNumberTip"
                      defaultMessage="请输入车牌号！"
                    />
                  ),
                },
                {
                  pattern:
                    /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.plateNumberTip2"
                      defaultMessage="请输入正确的车牌号！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="deviceNum"
              label="集卡号"
              width="xl"
              placeholder="请输入集卡号"
              rules={[
                {
                  required: true,
                  message: "请输入集卡号",
                }
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTreeSelect
              name="company"
              label={intl.formatMessage({
                id: 'vehicle.list.company',
                defaultMessage: '所属组织',
              })}
              width="xl"
              placeholder="请选择所属组织"
              request={async () => {
                return depts;
              }}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.companyTip"
                      defaultMessage="请输入所属组织！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} hidden={!!props?.values?.vin}>
          <Col span={24} order={1}>
            <ProFormText.Password
              name="tscPwd"
              label="TCS密码"
              width="xl"
              placeholder="请输入TCS密码"
              rules={[
                {
                  required: !props?.values?.vin,
                  message: "请输入TCS密码",
                }
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormRadio.Group
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
              initialValue={props.values.protocol}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormRadio.Group
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
              initialValue={props.values.vehicleType}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormRadio.Group
              valueEnum={vehicleStatusOptions}
              name="vehicleStatus"
              label={intl.formatMessage({
                id: 'vehicle.list.vehicleStatus',
                defaultMessage: '车辆状态',
              })}
              width="xl"
              placeholder="请选择车辆状态"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="vehicle.edit.vehicleStatus"
                      defaultMessage="请选择车辆状态！"
                    />
                  ),
                },
              ]}
              initialValue={props.values.vehicleStatus}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default VehicleForm;
