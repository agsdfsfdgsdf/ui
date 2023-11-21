import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import {downLoadXlsxGet} from "@/utils/downloadfile";
import {JobDataParams} from "@/pages/operation/jobData/data";

// 查询车辆信息列表
export async function getJobData(params?: JobDataParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/mission-data?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportJobData(params?: JobDataParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/mission-data/export`),
    { params },
    `mission_${new Date().getTime()}.xlsx`,
  );
}
