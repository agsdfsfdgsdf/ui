import { downLoadXlsx } from '@/utils/downloadfile';
import request from '@/utils/request';
import type { DictTypeType, DictTypeListParams } from './data.d';
import { getUrl } from '@/utils/RequestUrl';

// 查询字典类型列表
export async function getDictTypeList(params?: DictTypeListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/closure/label-data/page?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询字典类型详细
export function getDictType(dictId: string) {
  return request(getUrl(`/closure/label-data/page/${dictId}`), {
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
  return request(getUrl('/closure/label-data/page'), {
    method: 'POST',
    data: params,
  });
}

// 修改字典类型
export async function updateDictType(params: DictTypeType) {
  return request(getUrl('/closure/label-data/page'), {
    method: 'PUT',
    data: params,
  });
}

// 删除字典类型
export async function removeDictType(ids: string) {
  return request(getUrl(`/closure/label-data/page/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 导出字典类型
export function exportDictType(params?: DictTypeListParams) {
  return downLoadXlsx(
    getUrl(`/closure/label-data/page/export`),
    { params },
    `dict_type_${new Date().getTime()}.xlsx`,
  );
}
