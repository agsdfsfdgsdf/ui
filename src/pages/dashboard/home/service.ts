import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { HomeData } from './data';

export async function getChartData(): Promise<{ code: number; data: HomeData }> {
  return request(getUrl('/vehicle/home/list'));
}
