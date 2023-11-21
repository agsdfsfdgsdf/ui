import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Col, message, Row, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import { getCaptchaImage, login } from '@/services/login';

import styles from './index.less';
import { clearSessionToken, setSessionToken } from '@/access';
import { DefaultFooter } from '@ant-design/pro-layout';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [showCaptchCode, setShowCaptchCode] = useState<boolean>(false);
  const [userLoginState, setUserLoginState] = useState<any>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');

  const intl = useIntl();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const getCaptchaCode = async () => {
    const response = await getCaptchaImage();
    if (!response) return;
    if (response.img) {
      setShowCaptchCode(true);
    } else {
      setShowCaptchCode(false);
      setUuid(response.uuid);
      return;
    }
    const imgdata = `data:image/png;base64,${response.img}`;
    setCaptchaCode(imgdata);
    setUuid(response.uuid);
  };
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const response = await login({ ...values, uuid });
      if (response.code === 200) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        const current = new Date();
        const expireTime = current.setTime(current.getTime() + 7 * 24 * 60 * 60 * 1000);
        setSessionToken(response.token, response.token, expireTime);
        message.success(defaultLoginSuccessMessage);

        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;

        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else {
        console.log('login failed');
        clearSessionToken();
        // 如果失败去设置用户错误信息
        setUserLoginState({ status: 'error', type: 'account', massage: response.msg });
        message.error(response.msg);
        getCaptchaCode();
      }
    } catch (error) {
      clearSessionToken();
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
      getCaptchaCode();
    }
  };
  const { status, type: loginType, massage } = userLoginState;
  useEffect(() => {
    getCaptchaCode();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <Row className={styles.logoContent}>
          <img alt="logo" className={styles.logoImg} src="/images/logo.png" />
        </Row>

        <LoginForm
          title=""
          subTitle={null}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          style={{ paddingTop: 30 }}
        >
          {status === 'error' && loginType === 'account' && <LoginMessage content={massage} />}
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.username.placeholder',
              defaultMessage: '请输入用户名111111',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名111!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
              defaultMessage: '请输入密码111111',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />
          <Row hidden={!showCaptchCode}>
            <Col flex={3}>
              <ProFormText
                style={{
                  float: 'right',
                }}
                name="code"
                placeholder={intl.formatMessage({
                  id: 'pages.login.code.placeholder',
                  defaultMessage: '请输入验证',
                })}
                rules={[
                  {
                    required: showCaptchCode,
                    message: (
                      <FormattedMessage
                        id="pages.searchTable.updateForm.ruleName.nameRules"
                        defaultMessage="请输入验证"
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col flex={2}>
              <Image
                src={captchaCode}
                alt="验证码"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'top',
                  cursor: 'pointer',
                  paddingLeft: '10px',
                  width: '100px',
                }}
                preview={false}
                onClick={() => getCaptchaCode()}
              />
            </Col>
          </Row>

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}

          <Row
            style={{
              marginBottom: 35,
            }}
          >
            <Col flex={2} className={styles.autoLogin}>
              {/*<ProFormCheckbox name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
            </Col>
            <Col flex={3}>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a> */}
            </Col>
          </Row>
        </LoginForm>
      </div>
      <DefaultFooter
        copyright={`${new Date().getFullYear()} ${intl.formatMessage({
          id: 'app.copyright.produced',
          defaultMessage: '德创未来汽车科技有限公司',
        })}`}
        className={styles.footer}
      />
    </div>
  );
};

export default Login;
