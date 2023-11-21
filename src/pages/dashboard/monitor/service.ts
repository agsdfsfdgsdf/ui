import request from '@/utils/request';
import type { TagType } from './data';
import { getUrl } from '@/utils/RequestUrl';

export async function queryTags(): Promise<{ data: { list: TagType[] } }> {
  return request(getUrl('/api/tags'));
}
