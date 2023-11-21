import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { StationType, StationListParams } from './data.d';

// 查询站点信息列表
export async function getStationList(params?: StationListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/dispatch/station/list?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 新增站点信息
export async function addStation(params: StationType) {
  return request(getUrl('/dispatch/station/add'), {
    method: 'POST',
    data: params,
  });
}

// 修改站点信息
export async function updateStation(params: StationType) {
  return request(getUrl('/dispatch/station/edit'), {
    method: 'PUT',
    data: params,
  });
}

// 删除站点信息
export async function removeStation(vin: string) {
  return request(getUrl(`/dispatch/station/delete/${vin}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
