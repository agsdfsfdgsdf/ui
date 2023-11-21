import request from '@/utils/request';
import type { OnlineUserListParams } from './data.d';
import { getUrl } from '@/utils/RequestUrl';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

// 查询在线用户列表
export async function getOnlineUserList(params?: OnlineUserListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/api/monitor/online/list?${queryString}`), {
    data: params,
    method: 'GET',
  });
}

// 强退用户
export async function forceLogout(tokenId: string) {
  return request(getUrl(`/api/monitor/online/${tokenId}`), {
    method: 'DELETE',
  });
}
