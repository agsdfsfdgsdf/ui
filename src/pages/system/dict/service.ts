import { downLoadXlsx } from '@/utils/downloadfile';
import request from '@/utils/request';
import type { DictTypeType, DictTypeListParams } from './data.d';
import { getUrl } from '@/utils/RequestUrl';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

// 查询字典类型列表
export async function getDictTypeList(params?: DictTypeListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/api/system/dict/type/list?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询字典类型详细
export function getDictType(dictId: string) {
  return request(getUrl(`/api/system/dict/type/${dictId}`), {
    method: 'GET',
  });
}

// 查询字典数据详细
export function getDict(dictType: string) {
  return request(getUrl(`/api/system/dict/data/type/${dictType}`), {
    method: 'GET',
  });
}

// 新增字典类型
export async function addDictType(params: DictTypeType) {
  return request(getUrl('/api/system/dict/type'), {
    method: 'POST',
    data: params,
  });
}

// 修改字典类型
export async function updateDictType(params: DictTypeType) {
  return request(getUrl('/api/system/dict/type'), {
    method: 'PUT',
    data: params,
  });
}

// 删除字典类型
export async function removeDictType(ids: string) {
  return request(getUrl(`/api/system/dict/type/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 导出字典类型
export function exportDictType(params?: DictTypeListParams) {
  return downLoadXlsx(
    getUrl(`/api/system/dict/type/export`),
    { params },
    `dict_type_${new Date().getTime()}.xlsx`,
  );
}
