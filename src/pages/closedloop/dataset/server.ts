import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { DataSetParam, DataSetType } from './data';

export async function getDataSetList(params?: DataSetParam) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/closure/data-set?${queryString}`));
}

export async function createDataSet(data: any) {
  return request(getUrl(`/closure/data-set/collect`), {
    method: 'POST',
    data: data,
  });
}

export async function addDataSet(data: DataSetType) {
  return request(getUrl(`/closure/data-set`), {
    method: 'POST',
    data: data,
  });
}

export async function updateDataSet(data: DataSetType[]) {
  return request(getUrl(`/closure/data-set`), {
    method: 'PUT',
    data: data,
  });
}

export async function deleteDataSet(ids: string) {
  return request(getUrl(`/closure/data-set/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function getDataSetInfo(id: string) {
  return request(getUrl(`/closure/data-set/${id}`), {
    method: 'GET',
  });
}

export async function createDir(name: string, parent: string) {
  return request(getUrl(`/closure/oss/dir/mkdir`), {
    method: 'POST',
    data: {
      name: name,
      parent: parent === 'collectRoot' ? null : parent,
      type: 2
    }
  });
}

export async function getDirList(parent: string) {
  return request(getUrl(`/closure/oss/dir/list`), {
    method: 'POST',
    data: {
      parent: parent === 'collectRoot' ? null : parent,
      type: 2
    }
  });
}
