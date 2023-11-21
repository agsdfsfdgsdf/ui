import request from 'umi-request';
import Client from 'ali-oss';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import type { OSSInfo, OSSInfoFull, UploadFileInfo } from './data';
import { getUrl } from '@/utils/RequestUrl';

let fileList: UploadFileInfo[] = [];
let ossClient;
let retryCount = 0;
const retryCountMax = 3;
let cancelOne = false;

const UploadStatus = {
  WAITING: '准备中',
  UPLOADING: '上传中',
  COMPLETE: '上传完成',
  FAILURE: '上传失败',
  CANCEL: '取消上传',
  DESTROY: '终止上传',
  PAUSE: '暂停上传',
} as const;

const BizFromUnzipFile = {
  putFileList: (file: UploadFileInfo) => {
    file.uploadStatus = UploadStatus.WAITING;
    fileList.push(file);
  },
  getFileList: (upkey: string) => {
    return fileList.filter((file) => file.upkey === upkey);
  },
  getOssOptions: () => {
    return request(getUrl('/closure/oss/token'), {
      method: 'Get',
    });
  },
  setMarking: (marking: number) => {
    fileList = fileList.map((file) => {
      if (file.upkey === 'dataset_upload') {
        file.marking = marking;
      }
      return file;
    });
  },
  initOssClient: (ossInfo: OSSInfo) => {
    ossClient = new Client({
      region: ossInfo.region,
      accessKeyId: ossInfo.accessKeyId,
      accessKeySecret: ossInfo.accessKeySecret,
      stsToken: ossInfo.securityToken,
      bucket: ossInfo.bucketName,
    });
  },
  uploadFile: (fileInfo: UploadFileInfo) => {
    const uploadList = fileList.filter((file0) => file0.uploadStatus == UploadStatus.UPLOADING);
    if (uploadList && uploadList[0]) {
      //包含已经上传中文件，直接修改状态为等待
      fileList = fileList.map((file1) => {
        if (file1.uid == fileInfo.uid) {
          file1.uploadStatus = UploadStatus.WAITING;
        }
        return file1;
      });
      return;
    }

    const options: any = {
      progress: (progress, checkpoint) => {
        fileList = fileList.map((file1) => {
          if (file1.uid == fileInfo.uid) {
            file1.uploadStatus = UploadStatus.UPLOADING;
            file1.progress = Number.parseFloat((progress * 100).toFixed(1));
            file1.currentCheckPoint = checkpoint;
          }
          return file1;
        });
        DataBus.push({
          type: DataTypeConfig.ACTION_UPLOAD,
          data: fileList,
        });
      },
      partSize: 500 * 1024,
      timeout: 60000,
    };

    console.log(fileInfo);
    const oldFileInfo = fileList.filter((file0) => file0.uid === fileInfo.uid);
    if (oldFileInfo && oldFileInfo[0] && oldFileInfo[0].currentCheckPoint) {
      options.checkpoint = oldFileInfo[0].currentCheckPoint;
    }

    const dir = fileInfo.upkey === 'dataset_upload' ? fileInfo.fileDir : 'zipRoot';

    return ossClient
      .multipartUpload(dir + '/' + fileInfo.fileName, fileInfo.fileObj, options)
      .then((res) => {
        console.log('upload success: ', res);
        let fileComplete;
        fileList = fileList.map((file2) => {
          if (file2.uid == fileInfo.uid) {
            file2.uploadStatus = UploadStatus.COMPLETE;
            file2.progress = 100;
            file2.fileUrl = dir + '/' + fileInfo.fileName;
            file2.fileName = fileInfo.fileName;
            fileComplete = file2;
          }
          return file2;
        });
        DataBus.push({
          type: DataTypeConfig.ACTION_UPLOAD,
          data: fileList,
        });
        if (fileComplete) {
          DataBus.push({
            type: DataTypeConfig.ACTION_UPLOAD_COMPLETE,
            data: fileComplete,
          });
        }
        const waitList = fileList.filter((file3) => file3.uploadStatus === UploadStatus.WAITING);
        if (waitList && waitList.length > 0) {
          BizFromUnzipFile.uploadFile(waitList[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        if (ossClient && ossClient.isCancel()) {
          console.log('stop-upload!');
          fileList = fileList.map((file4) => {
            if (file4.uid == fileInfo.uid) {
              file4.uploadStatus = UploadStatus.PAUSE;
            }
            return file4;
          });
          DataBus.push({
            type: DataTypeConfig.ACTION_UPLOAD,
            data: fileList,
          });
          if (cancelOne) {
            cancelOne = false;
            const waitList = fileList.filter(
              (file3) => file3.uploadStatus === UploadStatus.WAITING,
            );
            if (waitList && waitList.length > 0) {
              BizFromUnzipFile.uploadFile(waitList[0]);
            }
          }
        } else {
          fileList = fileList.map((file5) => {
            if (file5.uid == fileInfo.uid) {
              file5.uploadStatus = UploadStatus.FAILURE;
            }
            return file5;
          });
          DataBus.push({
            type: DataTypeConfig.ACTION_UPLOAD,
            data: fileList,
          });
          const waitList = fileList.filter((file6) => file6.uploadStatus === UploadStatus.WAITING);
          if (waitList && waitList.length > 0) {
            BizFromUnzipFile.uploadFile(waitList[0]);
            return;
          }
          if (err.name.toLowerCase().indexOf('connectiontimeout') !== -1) {
            // timeout retry
            if (retryCount < retryCountMax) {
              retryCount++;
              console.error(`retryCount : ${retryCount}`);
              BizFromUnzipFile.uploadFile(fileInfo);
            }
          }
        }
      });
  },
  updateUploadStatus: (fileUid, uploadStatus) => {
    if (uploadStatus === UploadStatus.CANCEL || uploadStatus === UploadStatus.DESTROY) {
      const file = fileList.filter((file0) => file0.uid === fileUid);
      if (file && file[0]) {
        if (file[0].uploadStatus === UploadStatus.UPLOADING) {
          cancelOne = true;
          ossClient.cancel();
        }
        fileList = fileList.map((file1) => {
          if (file1.uid === fileUid) {
            file1.uploadStatus = uploadStatus;
          }
          return file1;
        });
        if (uploadStatus === UploadStatus.DESTROY) {
          fileList = fileList.filter((fileP) => fileP.uploadStatus !== UploadStatus.DESTROY);
        }
        DataBus.push({
          type: DataTypeConfig.ACTION_UPLOAD,
          data: fileList,
        });

        return;
      }
    }

    fileList = fileList.map((file) => {
      if (file.uid === fileUid) {
        file.uploadStatus = uploadStatus;
      }
      return file;
    });
    DataBus.push({
      type: DataTypeConfig.ACTION_UPLOAD,
      data: fileList,
    });
  },
  removeFile: (fileUid) => {
    const file = fileList.filter((file0) => file0.uid === fileUid);

    if (file && file[0] && file[0].uploadStatus === UploadStatus.UPLOADING && ossClient)
      ossClient.cancel();

    fileList = fileList.filter((file0) => file0.uid !== fileUid);

    DataBus.push({
      type: DataTypeConfig.ACTION_UPLOAD,
      data: fileList,
    });
  },
  getFileUrl: async (url: string, fileName: string) => {
    if (!ossClient) {
      const oss = (await BizFromUnzipFile.getOssOptions()) as OSSInfoFull;
      if (oss && oss.data && oss.data.securityToken) {
        BizFromUnzipFile.initOssClient(oss.data);
      }
    }
    const result = ossClient.signatureUrl(url, {
      response: {
        'content-disposition': `attachment; filename="${fileName}"`,
      },
    });
    return result;
  },
};

export { BizFromUnzipFile, UploadStatus };
