import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { VehicleType, VehicleListParams } from './data.d';

// 查询车辆信息列表
export async function getVehicleList(params?: VehicleListParams) {
  console.log('params', params);
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/vehicle/list?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 新增车辆信息
export async function addVehicle(params: VehicleType) {
  return request(getUrl('/vehicle/add'), {
    method: 'POST',
    data: params,
  });
}

// 修改车辆信息
export async function updateVehicle(params: VehicleType) {
  return request(getUrl('/vehicle/edit'), {
    method: 'PUT',
    data: params,
  });
}

// 删除车辆信息
export async function removeVehicle(vin: string) {
  return request(getUrl(`/vehicle/delete/${vin}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
