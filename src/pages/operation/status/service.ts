import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type {VehicleStatusParams} from './data.d';
import {downLoadXlsxGet} from "@/utils/downloadfile";

// 查询车辆信息列表
export async function getVehicleStatusList(params?: VehicleStatusParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/status-data?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportVehicleStatus(params?: VehicleStatusParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/status-data/export`),
    { params },
    `status_${new Date().getTime()}.xlsx`,
  );
}
