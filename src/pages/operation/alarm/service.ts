import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import { downLoadXlsxGet } from '@/utils/downloadfile';
import type { AlarmParams } from './data.d';

// 查询车辆信息列表
export async function getAlarmList(params?: AlarmParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/warn-data?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function getAlarmType() {
  return request(getUrl(`/operationApi/warn-data/type-list`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportAlarm(params?: AlarmParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/warn-data/export`),
    { params },
    `alarm_${new Date().getTime()}.xlsx`,
  );
}
