import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

// 获取服务器信息
export async function getServerInfo() {
  return request(getUrl('/api/monitor/server'), {
    method: 'GET',
  });
}
