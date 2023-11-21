import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { OTAFileType } from './data.d';
import { OTAAppType } from './data';

export async function queryCurrentUserInfo(): Promise<{ data: API.GetUserInfoResult }> {
  return { data: await request(getUrl('/api/getInfo')) };
}

// 查询OTA上传信息列表
export async function getVersionsUploadList(params?: any) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/ota/version?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

//获取应用列表
export async function getApplyList() {
  return request(getUrl(`/ota/apply`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询OSS信息
export async function getOssOption() {
  return request(getUrl(`/ota/oss`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 新增OTA上传信息
export async function addVersionsUpload(params: OTAFileType) {
  return request(getUrl('/ota/version'), {
    method: 'POST',
    data: params,
  });
}

// 修改OTA上传信息
export async function updateVersionsUpload(params: OTAFileType) {
  return request(getUrl('/ota/version'), {
    method: 'PUT',
    data: params,
  });
}

// 删除OTA上传信息
export async function removeVersionsUpload(id: string) {
  return request(getUrl(`/ota/version/${id}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

//添加应用
export async function addVersionsApp(params: OTAAppType) {
  return request(getUrl('/ota/apply'), {
    method: 'POST',
    data: params,
  });
}

// 修改应用信息
export async function updateVersionsApp(params: OTAAppType) {
  return request(getUrl('/ota/apply'), {
    method: 'PUT',
    data: params,
  });
}

// 删除应用
export async function removeVersionsApp(id: number) {
  return request(getUrl(`/ota/apply/${id}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
