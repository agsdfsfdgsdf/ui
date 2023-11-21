import request from '@/utils/request';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
};

export function downLoadZip(url: string) {
  request(url, {
    method: 'GET',
    responseType: 'blob',
    getResponse: true,
  }).then((res) => {
    resolveBlob(res, mimeMap.zip);
  });
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res: any, mimeType: string) {
  const aLink = document.createElement('a');
  const blob = new Blob([res.data], { type: mimeType });
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
  const contentDisposition = decodeURI(res.response.headers.get('content-disposition'));
  const result = patt.exec(contentDisposition);
  let fileName = result ? result[1] : 'file';
  fileName = fileName.replace(/"/g, '');
  aLink.style.display = 'none';
  aLink.href = URL.createObjectURL(blob);
  aLink.setAttribute('download', fileName); // 设置下载文件名称
  document.body.appendChild(aLink);
  aLink.click();
  URL.revokeObjectURL(aLink.href); // 清除引用
  document.body.removeChild(aLink);
}

export async function downLoadXlsx(url: string, params: any, fileName: string) {
  return request(url, {
    ...params,
    method: 'POST',
    responseType: 'blob',
  }).then((data: any) => {
    const aLink = document.createElement('a');
    const blob = data; // new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    aLink.style.display = 'none';
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('download', fileName); // 设置下载文件名称
    document.body.appendChild(aLink);
    aLink.click();
    URL.revokeObjectURL(aLink.href); // 清除引用
    document.body.removeChild(aLink);
  });
}

export async function downLoadXlsxGet(url: string, params: any, fileName: string) {
  return request(url, {
    ...params,
    method: 'GET',
    responseType: 'blob',
  }).then((data: any) => {
    const aLink = document.createElement('a');
    const blob = data; // new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    aLink.style.display = 'none';
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('download', fileName); // 设置下载文件名称
    document.body.appendChild(aLink);
    aLink.click();
    URL.revokeObjectURL(aLink.href); // 清除引用
    document.body.removeChild(aLink);
  });
}

const getFile = (url: string) => {
  return new Promise((resolve, reject) => {
    request(url, {
      method: 'GET',
      responseType: 'blob',
    })
      .then((res: any) => {
        resolve(res);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

/**
 * 打包压缩下载
 * @param data  源文件数组
 * @param fileName  压缩文件的名称
 */
export default function compressAndDownload(data: any[], fileName?: string) {
  const zip = new JSZip();
  const promises: any[] = []; //用于存储多个promise
  data.forEach((item: any) => {
    const promise = getFile(item.fileUrl).then((res: any) => {
      const fileName1 = item.fileName;
      console.log(fileName1, res);
      zip.file(fileName1, res, { binary: true });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(() => {
    zip
      .generateAsync({
        type: 'blob',
        compression: 'DEFLATE', // STORE：默认不压缩 DEFLATE：需要压缩
        compressionOptions: {
          level: 9, // 压缩等级1~9    1压缩速度最快，9最优压缩方式
        },
      })
      .then((res: any) => {
        FileSaver.saveAs(res, fileName ? fileName : '压缩包.zip'); // 利用file-saver保存文件
      });
  });
}
