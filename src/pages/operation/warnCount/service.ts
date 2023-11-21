import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import { downLoadXlsxGet } from '@/utils/downloadfile';
import type { WarnCountParams } from './data.d';

// 查询车辆信息列表
export async function getWarnCountList(params?: WarnCountParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/warn-data/count?${queryString}`), {
    data: params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
export async function getMarkType() {
  return request(getUrl(`/operationApi/warn-data/type`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportWarnCount(params?: WarnCountParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/warn-data/export`),
    { params },
    `warnCount_${new Date().getTime()}.xlsx`,
  );
}
