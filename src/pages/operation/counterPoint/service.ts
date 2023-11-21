import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import {downLoadXlsxGet} from "@/utils/downloadfile";
import {CounterPointTypeParams} from "@/pages/operation/counterPoint/data";

// 查询车辆信息列表
export async function getCounterPointData(params?: CounterPointTypeParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/aligning-data?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportCounterPoint(params?: CounterPointTypeParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/aligning-data/export`),
    { params },
    `aligning_${new Date().getTime()}.xlsx`,
  );
}
