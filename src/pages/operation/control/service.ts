import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type {ControllerParams} from './data.d';
import {downLoadXlsxGet} from "@/utils/downloadfile";

// 查询车辆信息列表
export async function getControllerList(params?: ControllerParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/control-data?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportController(params?: ControllerParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/control-data/export`),
    { params },
    `controller_${new Date().getTime()}.xlsx`,
  );
}
