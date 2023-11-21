import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import { downLoadXlsxGet } from '@/utils/downloadfile';
import type { TcsWebsocketGetQdInfoParams } from './data.d';

// 查询车辆信息列表
export async function getTcsWebsocketGetQdInfoList(params?: TcsWebsocketGetQdInfoParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/websocketGetQdInfo/list?${queryString}`), {
    data: params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportTcsWebsocketGetQdInfo(params?: TcsWebsocketGetQdInfoParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/websocketGetQdInfo/export`),
    { params },
    `tcsWebsocketGetQdInfo${new Date().getTime()}.xlsx`,
  );
}
