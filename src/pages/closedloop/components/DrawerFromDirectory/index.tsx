import React, { useEffect, useState } from 'react';
import { ProFormField } from '@ant-design/pro-form';
import { Form, Row, Col, Button, Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export type DirectoryFormProps = {
  show?: boolean;
  onCancel: () => void;
  onSubmit: (directory: string) => void;
};

const DrawerFromDirectory: React.FC<DirectoryFormProps> = (props: DirectoryFormProps) => {
  const [form] = Form.useForm();

  const [directoryValue, setDirectoryValue] = useState<string>('');

  useEffect(() => {
    form.resetFields();
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
    setDirectoryValue('');
  };
  const handleFinish = (values: Record<string, any>) => {
    props.onSubmit(values['directory']);
    setDirectoryValue('');
  };

  return (
    <Drawer
      width={640}
      title={'新建目录'}
      placement="right"
      closable={false}
      onClose={handleCancel}
      open={props.show}
      
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
      <Form form={form} onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormField
              name="directory"
              label="目录"
              width="xl"
              placeholder="请输入目录名称"
              fieldProps={{
                suffix: (directoryValue ? directoryValue.length + '' : '0') + '/254',
                onChange: (event1) => {
                  setDirectoryValue(event1.target.value);
                },
                value: directoryValue,
              }}
              proFieldProps={{
                suffix: '测试',
              }}
              rules={[
                {
                  required: true,
                  message: '请输入目录名称',
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1} style={{ color: '#aaa', fontSize: 10 }}>
            目录命名规范：
            <br />
            <br />
            1.不允许使用表情符，请使用符合要求的 UTF-8 字符；
            <br />
            2./ 用于分割路径，可快速创建子目录，但不要以 / 或 \ 开头，不要出现连续的 /；
            <br />
            3.不允许出现名为 .. 的子目录；
            <br />
            4.总长度控制在 1~254 个字符。
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default DrawerFromDirectory;
