import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import { downLoadXlsxGet } from '@/utils/downloadfile';
import type { TcsGetInstructionsParams } from './data.d';

// 查询车辆信息列表
export async function getTcsGetInstructionsList(params?: TcsGetInstructionsParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/operationApi/instruct/list?${queryString}`), {
    data: params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function exportTcsGetInstructions(params?: TcsGetInstructionsParams) {
  return downLoadXlsxGet(
    getUrl(`/operationApi/instruct/export`),
    { params },
    `tcsGetInstructions_${new Date().getTime()}.xlsx`,
  );
}
