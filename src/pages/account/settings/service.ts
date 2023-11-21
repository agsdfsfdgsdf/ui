import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { GeographicItemType } from './data';

export async function queryCurrentUserInfo(): Promise<{ data: API.GetUserInfoResult }> {
  return { data: await request(getUrl('/api/getInfo')) };
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request(getUrl('/api/geographic/province'));
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(getUrl(`/api/geographic/city/${province}`));
}

export async function query() {
  return request(getUrl('/api/users'));
}
