import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type {PerceiveTypeParams} from './data.d';
import {downLoadXlsxGet} from "@/utils/downloadfile";

// 查询车辆信息列表
export async function getPerceiveList(params?: PerceiveTypeParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/obstacle-data?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportPerceive(params?: PerceiveTypeParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/obstacle-data/export`),
    { params },
    `perceive_${new Date().getTime()}.xlsx`,
  );
}
