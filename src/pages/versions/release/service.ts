import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';

// 获取已发布版本信息
export async function getMaxVersion() {
  return request(getUrl(`/ota/version/max-version`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 车辆批量版本升级
export async function addVersionsRelease(params: any) {
  return request(getUrl(`/ota/publish`), {
    method: 'POST',
    data: params,
  });
}
