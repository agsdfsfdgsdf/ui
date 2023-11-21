import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { ModelTypeParam, ModelType } from './data';

export async function getModelDataList(params?: ModelTypeParam) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/closure/model-file?${queryString}`));
}

export async function addModelData(data: ModelType) {
  return request(getUrl(`/closure/model-file`), {
    method: 'POST',
    data: data,
  });
}

export async function updateModelData(data: ModelType[]) {
  return request(getUrl(`/closure/model-file`), {
    method: 'PUT',
    data: data,
  });
}

export async function deleteModelData(ids: string) {
  return request(getUrl(`/closure/model-file/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function getModelDataInfo(id: string) {
  return request(getUrl(`/closure/model-file/${id}`), {
    method: 'GET',
  });
}


export async function createDir(name: string, parent: string) {
  return request(getUrl(`/closure/oss/dir/mkdir`), {
    method: 'POST',
    data: {
      name: name,
      parent: parent === 'modelRoot' ? null : parent,
      type: 3
    }
  });
}

export async function getDirList(parent: string) {
  return request(getUrl(`/closure/oss/dir/list`), {
    method: 'POST',
    data: {
      parent: parent === 'modelRoot' ? null : parent,
      type: 3
    }
  });
}
