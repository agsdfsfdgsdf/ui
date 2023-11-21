import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { ListItemDataType } from './data.d';

export async function queryCurrentUserInfo(): Promise<{
  user: any;
  data: API.GetUserInfoResult;
}> {
  return { data: await request(getUrl('/api/getInfo')) };
}

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: ListItemDataType[] } }> {
  return request(getUrl('/api/fake_list_Detail'), {
    params,
  });
}
