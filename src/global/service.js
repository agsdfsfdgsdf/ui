import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';

export async function getConfig() {
  return request(getUrl(`/config.json`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
