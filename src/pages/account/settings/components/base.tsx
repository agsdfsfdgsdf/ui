import React, { useState } from 'react';
import { message, Form } from 'antd';
import AvatarCropper from '../../center/components/AvatarCropper';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { queryCurrentUserInfo } from '../service';

import styles from './BaseView.less';
import { getUrl } from '@/utils/RequestUrl';
import { updateUserProfile } from '@/pages/system/user/service';
import { useRequest } from 'umi';

const BaseView: React.FC = () => {
  const [cropperModalVisible, setCropperModalVisible] = useState<boolean>(false);

  const [form] = Form.useForm();
  //  获取用户信息
  const { data: userInfo } = useRequest(() => {
    return queryCurrentUserInfo();
  });

  console.log(userInfo);

  const currentUser = userInfo?.user;

  if (!currentUser) {
    return null;
  }

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return getUrl(currentUser.avatar);
      }
      return '/images/default.png';
    }
    return '';
  };

  const handleFinish = async (values: Record<string, any>) => {
    const data = { ...currentUser, ...values } as API.CurrentUser;
    const resp = await updateUserProfile(data);
    if (resp.code === 200) {
      message.success('基本信息修改成功！');
    } else {
      message.warn(resp.msg);
    }
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <ProForm
          layout="vertical"
          onFinish={handleFinish}
          form={form}
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            submitButtonProps: {
              children: '更新基本信息',
            },
          }}
          initialValues={{
            ...currentUser,
            email: currentUser?.email,
            phone: currentUser?.phonenumber,
          }}
          hideRequiredMark
        >
          <ProFormText
            width="md"
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: '请输入您的邮箱!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="userName"
            label="用戶名"
            disabled={true}
            rules={[
              {
                required: true,
                message: '请输入您的用戶名!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="nickName"
            label="昵称"
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          />
          <ProFormTextArea
            name="remark"
            label="个人简介"
            rules={[
              {
                required: true,
                message: '请输入个人简介!',
              },
            ]}
            placeholder="个人简介"
          />
          {/* <ProFormSelect
            width="sm"
            name="country"
            label="国家/地区"
            rules={[
              {
                required: true,
                message: '请输入您的国家或地区!',
              },
            ]}
            options={[
              {
                label: '中国',
                value: 'China',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="address"
            label="街道地址"
            rules={[
              {
                required: true,
                message: '请输入您的街道地址!',
              },
            ]}
          /> */}
          <ProFormText
            name="phonenumber"
            label="联系电话"
            rules={[
              {
                required: true,
                message: '请输入您的联系电话!',
              },
              // { validator: validatorPhone },
            ]}
          />
        </ProForm>
      </div>
      <div className={styles.right}>
        <div
          className={styles.avatarHolder}
          onClick={() => {
            setCropperModalVisible(true);
          }}
        >
          <img alt="" src={getAvatarURL()} />
        </div>
      </div>

      <AvatarCropper
        onFinished={() => {
          setCropperModalVisible(false);
          window.location.reload();
        }}
        visible={cropperModalVisible}
        data={currentUser.avatar}
      />
    </div>
  );
};

export default BaseView;
