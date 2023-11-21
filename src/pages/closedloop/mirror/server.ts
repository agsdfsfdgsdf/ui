import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { MirrorTypeParam } from './data';
import type { MirrorType } from './data';

export async function getMirrorDataList(params?: MirrorTypeParam) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/closure/image-file?${queryString}`));
}

export async function addMirrorData(data: MirrorType) {
  return request(getUrl(`/closure/image-file`), {
    method: 'POST',
    data: data,
  });
}

export async function updateMirrorData(data: MirrorType[]) {
  return request(getUrl(`/closure/image-file`), {
    method: 'PUT',
    data: data,
  });
}

export async function deleteMirrorData(ids: string) {
  return request(getUrl(`/closure/image-file/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export async function getMirrorDataInfo(id: string) {
  return request(getUrl(`/closure/image-file/${id}`), {
    method: 'GET',
  });
}

export async function createDir(name: string, parent: string) {
  return request(getUrl(`/closure/oss/dir/mkdir`), {
    method: 'POST',
    data: {
      name: name,
      parent: parent === 'imageRoot' ? null : parent,
      type: 4
    }
  });
}

export async function getDirList(parent: string) {
  return request(getUrl(`/closure/oss/dir/list`), {
    method: 'POST',
    data: {
      parent: parent === 'imageRoot' ? null : parent,
      type: 4
    }
  });
}
