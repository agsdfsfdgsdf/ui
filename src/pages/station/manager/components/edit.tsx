import React, { useEffect } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { StationType } from '../data.d';
import StationManagerAmap from './StationManagerAmap';
import DataConfig from '@/global/DataConfig';

export type StationFormValueType = Record<string, unknown> & Partial<StationType>;

export type StationFormProps = {
  onCancel: (flag?: boolean, formVals?: StationFormValueType) => void;
  onSubmit: (values: StationFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<StationType>;
};

const StationForm: React.FC<StationFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      name: props.values.name,
      longitude: props.values.longitude,
      latitude: props.values.latitude,
      address:
        props.values.longitude && props.values.latitude
          ? props.values.longitude + ',' + props.values.latitude
          : '',
      altitude: props.values.altitude,
      yaw: props.values.yaw,
      createTime: props.values.createTime,
      updateTime: props.values.updateTime,
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
    const address = values.address as string;
    if (address && address.length > 0) {
      const lonlat = address.split(',');
      if (lonlat && lonlat.length === 2) {
        values.longitude = Number.parseFloat(lonlat[0]).toFixed(7);
        values.latitude = Number.parseFloat(lonlat[1]).toFixed(7);
      }
    }
    props.onSubmit({ ...values } as StationFormValueType);
  };

  const onMoveMarker = (position: any) => {
    form.setFieldsValue({
      longitude: position[0],
      latitude: position[1],
      address: position[0] + ',' + position[1],
    });
  };

  function isLetter(str) {
    for (const i in str) {
      const asc = str.charCodeAt(i);
      if ((asc >= 65 && asc <= 90) || (asc >= 97 && asc <= 122)) {
        return true;
      }
    }
    return false;
  }

  const checkYaw = (rule: any, value: string) => {
    try {
      if (value.trim().length === 0) {
        return Promise.reject(new Error('请填写正确的站点位置偏向角！'));
      }
      if (Number.parseFloat(value) && !isLetter(value)) {
      } else {
        return Promise.reject(new Error('请填写正确的站点位置偏向角！'));
      }
      if (Number.parseFloat(value) < -3.14 || Number.parseFloat(value) > 3.14) {
        return Promise.reject(new Error('请填写正确的站点位置偏向角！'));
      }
    } catch (e) {
      return Promise.reject(new Error('请填写正确的站点位置偏向角！'));
    }

    return Promise.resolve();
  };

  return (
    <Modal
      width={840}
      title={
        props.values.id
          ? intl.formatMessage({
              id: 'station.edit.title',
              defaultMessage: '编辑站点',
            })
          : intl.formatMessage({
              id: 'station.add.title',
              defaultMessage: '新增站点',
            })
      }
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="id"
              label={intl.formatMessage({
                id: 'station.list.id',
                defaultMessage: '站点ID',
              })}
              labelCol={{ span: 6 }}
              width="xl"
              placeholder=""
              disabled
              hidden
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="name"
              label={intl.formatMessage({
                id: 'station.list.name',
                defaultMessage: '名称',
              })}
              width="xl"
              labelCol={{ span: 6 }}
              placeholder="请输入站点名称"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage id="station.edit.name" defaultMessage="请输入站点名称！" />
                  ),
                },
              ]}
            />
          </Col>
          <Col span={12} order={1}>
            <ProFormText
              name="address"
              label={intl.formatMessage({
                id: 'station.list.address',
                defaultMessage: '位置',
              })}
              width="xl"
              labelCol={{ span: 6 }}
              placeholder="请拖动标注图标选择位置！"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="station.edit.address"
                      defaultMessage="请拖动标注图标选择位置或填写位置！"
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="longitude"
              label={intl.formatMessage({
                id: 'station.list.longitude',
                defaultMessage: '经度',
              })}
              width="xl"
              hidden
            />
          </Col>
          <Col span={12} order={1}>
            <ProFormText
              name="latitude"
              label={intl.formatMessage({
                id: 'station.list.latitude',
                defaultMessage: '纬度',
              })}
              width="xl"
              hidden
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="altitude"
              label={intl.formatMessage({
                id: 'station.list.altitude',
                defaultMessage: '海拔',
              })}
              width="xl"
              labelCol={{ span: 6 }}
              initialValue={0}
              disabled
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="station.edit.altitude"
                      defaultMessage="请填写位置海拔信息！"
                    />
                  ),
                },
              ]}
            />
          </Col>
          <Col span={12} order={1}>
            <ProFormText
              name="yaw"
              label={intl.formatMessage({
                id: 'station.list.yaw',
                defaultMessage: '偏向角',
              })}
              width="xl"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  validator: checkYaw,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ height: document.body.offsetHeight * 0.5 }}>
            <StationManagerAmap
              id={props.values.id ? props.values.id : '0'}
              position={
                props.values.longitude && props.values.latitude
                  ? [props.values.longitude, props.values.latitude]
                  : DataConfig.getConfig().map.initialView.center
              }
              onMoveMarker={onMoveMarker}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default StationForm;
