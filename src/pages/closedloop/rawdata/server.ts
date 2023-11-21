import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { DataTypeParam, MarkingType } from './data';
import type { DataType } from './data';

export async function getRawDataList(params?: DataTypeParam, label?: MarkingType) {
  let queryString = new URLSearchParams(params).toString();
  if (label) {
    if (label.weather) {
      queryString += '&label.weather=' + label.weather;
    }
    if (label.event) {
      queryString += '&label.event=' + label.event;
    }
    if (label.timeInterval) {
      queryString += '&label.timeInterval=' + label.timeInterval;
    }
  }
  return request(getUrl(`/closure/source-file?${queryString}`));
}

export async function addRawData(data: DataType) {
  return request(getUrl(`/closure/source-file`), {
    method: 'POST',
    data: data,
  });
}

export async function updateRawData(data: DataType[]) {
  return request(getUrl(`/closure/source-file`), {
    method: 'PUT',
    data: data,
  });
}

export async function deleteRawData(ids: string) {
  return request(getUrl(`/closure/source-file/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function getRawDataInfo(id: string) {
  return request(getUrl(`/closure/source-file/${id}`), {
    method: 'GET',
  });
}

export async function createDir(name: string, parent: string) {
  return request(getUrl(`/closure/oss/dir/mkdir`), {
    method: 'POST',
    data: {
      name: name,
      parent: parent === 'sourceRoot' ? null : parent,
      type: 1
    }
  });
}

export async function getDirList(parent: string) {
  return request(getUrl(`/closure/oss/dir/list`), {
    method: 'POST',
    data: {
      parent: parent === 'sourceRoot' ? null : parent,
      type: 1
    }
  });
}