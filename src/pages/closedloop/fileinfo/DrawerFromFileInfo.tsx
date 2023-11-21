import React, { useEffect, useState } from 'react';
import { Drawer, Row, Col, Image, Button, message, Form } from 'antd';
import {
  CloseOutlined,
  EditOutlined,
  LeftCircleFilled,
  RightCircleFilled,
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { ProFormSelect } from '@ant-design/pro-form';
import type { MarkingType } from '../rawdata/data';

import { BizFromUploadFile } from '../upload/BizFromUploadFile';
import type { FileInfo, ShowInfoData } from './data';
import copyToClip from './copy';
import { BizFromUnzipFile } from '../upload/BizFromUnzipFile';

export type FileInfoFormValueType = Record<string, unknown> & Partial<MarkingType>;

export type FileInfoFormProps = {
  weathers?: any;
  events?: any;
  times?: any;
  showInfoData?: ShowInfoData;
  showLabel?: boolean;
  onCancel?: () => void;
  onSubmit?: (data: any, values: FileInfoFormValueType, upkey?: string) => Promise<void>;
};

const DrawerFromFileInfo: React.FC<FileInfoFormProps> = (props: any) => {
  const [form] = Form.useForm();

  const { weathers, events, times, showInfoData, showLabel } = props;
  const allData: FileInfo[] = showInfoData?.allData;
  const show = showInfoData?.isShow;

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [mouseIn, setMouseIn] = useState<boolean>(false);

  const [selectData, setSelectData] = useState<FileInfo>(showInfoData?.data);

  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    if (showInfoData?.data && showInfoData?.data?.url) {
      BizFromUnzipFile.getFileUrl(showInfoData?.data?.url, showInfoData?.data?.fileName).then(
        (result) => {
          setFileUrl(result);
        },
      );
    }

    form.resetFields();
    form.setFieldsValue({
      weather: showInfoData?.data?.label?.weather,
      event: showInfoData?.data?.label?.event,
      timeInterval: showInfoData?.data?.label?.timeInterval,
    });

    setSelectData(showInfoData?.data);
  }, [showInfoData?.data, form, props]);

  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Drawer
      title="详情"
      placement="right"
      closable={false}
      destroyOnClose
      onClose={handleCancel}
      open={show}
      key="uploadTask"
      width={640}
      extra={[<CloseOutlined key="closeUploadTask" onClick={handleCancel} />]}
    >
      <Row align={'middle'}>
        <Col span={24}>
          <div
            style={{
              width: '100%',
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F2F2F2',
            }}
            onMouseOver={() => {
              setMouseIn(true);
            }}
            onMouseOut={() => {
              setMouseIn(false);
            }}
          >
            {selectData &&
              selectData.type &&
              (selectData.type.indexOf('jpg') !== -1 ||
                selectData.type.indexOf('png') !== -1 ||
                selectData.type.indexOf('jpeg') !== -1) && (
                <Image
                  height={180}
                  preview={false}
                  src={fileUrl ? fileUrl : ''}
                  style={{ width: 'auto', height: '100%' }}
                />
              )}
            {!selectData ||
              !selectData.type ||
              (selectData.type.indexOf('jpg') === -1 &&
                selectData.type.indexOf('png') === -1 &&
                selectData.type.indexOf('jpeg') === -1 && <span>当前格式不支持预览。</span>)}
          </div>

          <LeftCircleFilled
            style={{ float: 'left', marginTop: -106, marginLeft: 10, fontSize: 32 }}
            hidden={!mouseIn || !allData || allData.length < 2}
            onMouseOver={() => {
              setMouseIn(true);
            }}
            onMouseOut={() => {
              setMouseIn(false);
            }}
            onClick={() => {
              let index = allData.findIndex((data) => data.id === selectData.id);
              if (--index < 0) {
                message.info('已是第一个');
                index = 0;
              }
              setSelectData(allData[index]);
              BizFromUnzipFile.getFileUrl(allData[index]?.url, allData[index]?.fileName).then(
                (result) => {
                  setFileUrl(result);
                },
              );
            }}
          />

          <RightCircleFilled
            style={{ float: 'right', marginTop: -106, marginRight: 10, fontSize: 32 }}
            hidden={!mouseIn || !allData || allData.length < 2}
            onMouseOver={() => {
              setMouseIn(true);
            }}
            onMouseOut={() => {
              setMouseIn(false);
            }}
            onClick={() => {
              let index = allData.findIndex((data) => data.id === selectData.id);
              if (++index > allData.length - 1) {
                message.info('已是最后一个');
                index = allData.length - 1;
              }
              setSelectData(allData[index]);
              BizFromUnzipFile.getFileUrl(allData[index]?.url, allData[index]?.fileName).then(
                (result) => {
                  setFileUrl(result);
                },
              );
            }}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={4}>
          <span style={{ userSelect: 'none' }}>文件名：</span>
        </Col>
        <Col span={19}>
          <span>{selectData ? selectData.fileName : ''}</span>
          <Button
            type="link"
            onClick={() => {
              if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(selectData ? selectData.fileName : '');
                message.info('复制成功');
              } else {
                copyToClip(selectData ? selectData.fileName : '');
              }
            }}
          >
            复制
          </Button>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={4}>
          <span style={{ userSelect: 'none' }}>URL：</span>
        </Col>
        <Col span={19}>
          <TextArea rows={4} value={fileUrl} />
          <Button
            type="link"
            onClick={() => {
              if (!selectData) {
                message.error('数据获取错误！');
                return;
              }
              BizFromUploadFile.download(selectData.url, selectData.fileName);
            }}
          >
            下载
          </Button>{' '}
          |
          <Button
            type="link"
            onClick={() => {
              if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(fileUrl);
                message.info('复制成功');
              } else {
                copyToClip(fileUrl);
              }
            }}
          >
            复制URL
          </Button>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={4}>
          <span style={{ userSelect: 'none' }}>类型：</span>
        </Col>
        <Col span={19}>{selectData && selectData.type ? selectData.type : '未知'}</Col>
      </Row>

      <Form
        form={form}
        hidden={!showLabel}
        onFinish={() => {
          const value = form.getFieldsValue();
          props.onSubmit(selectData, value as MarkingType, showInfoData.upkey);
          setShowEdit(false);
        }}
      >
        <Form.Item>
          <Row style={{ marginTop: 20 }}>
            <Col span={4}>
              <span style={{ userSelect: 'none' }}>
                标签：
                <EditOutlined
                  onClick={() => {
                    setShowEdit(!showEdit);
                  }}
                />
              </span>
            </Col>
            <Col span={19}>
              <Row>
                <Col span={10}>
                  <ProFormSelect
                    label="天气："
                    name="weather"
                    valueEnum={weathers}
                    initialValue={selectData?.label?.weather}
                    placeholder={'未标注'}
                    disabled={!showEdit}
                  />
                </Col>
                <Col span={1} />
                <Col span={10}>
                  <ProFormSelect
                    label="事件："
                    name="event"
                    valueEnum={events}
                    initialValue={selectData?.label?.event}
                    placeholder={'未标注'}
                    disabled={!showEdit}
                  />
                </Col>
                <Col span={10}>
                  <ProFormSelect
                    label="时段："
                    name="timeInterval"
                    valueEnum={times}
                    initialValue={selectData?.label?.timeInterval}
                    placeholder={'未标注'}
                    disabled={!showEdit}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item hidden={!showEdit}>
          <Col span={4} />
          <Col span={19}>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 30 }}>
              确定
            </Button>
            <Button
              type="default"
              htmlType="button"
              onClick={handleCancel}
              style={{ marginLeft: 20 }}
            >
              取消
            </Button>
          </Col>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerFromFileInfo;
