import request from 'umi-request';
import { getUrl } from '@/utils/RequestUrl';
import { UnzipParam } from '@/pages/closedloop/upload/data';

export async function getZipProgress(uids: string[]) {
  return request(getUrl(`/closure/oss/file-zip-rate`),{
    method: 'POST',
    data: uids,
  });
}

export async function postZipDownload(param: UnzipParam) {
  return request(getUrl(`/closure/oss/file-download`), {
    method: 'POST',
    data: param,
  });
}
