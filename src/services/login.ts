import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: Record<string, any>,
) {
  return request<API.FakeCaptcha>(getUrl('/api/login/captcha'), {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.LoginResult>(getUrl('/api/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取验证码
export async function getCaptchaImage() {
  return request(getUrl('/api/captchaImage'), {
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Host: '192.168.1.11:8090',
    },
  });
}

// 获取手机验证码
export async function getMobileCaptcha(mobile: string) {
  return request(getUrl(`/api/login/captcha?mobile=${mobile}`));
}
