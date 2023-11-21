import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { RecordListParams } from './data';

// 查询升级记录列表
export async function getRecordList(params?: RecordListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/ota/progress?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询升级记录列表
export async function getRecordProgress(vin: string, dataType: number, versionCode: string) {
  return request(getUrl(`/ota/progress/${vin}/${dataType}/${versionCode}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
