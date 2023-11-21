import type { RcFile } from 'antd/lib/upload';

export type UploadFileInfo = {
  uid: string;
  upkey: string; //数据类型（原始数据、数据集），需保持唯一
  fileName: string;
  fileSize: number;
  fileStatus: string;
  fileType: string;
  fileDir: string; //只有数据集包含
  marking?: number; //只有数据集包含
  fileObj: RcFile | undefined;
  fileUrl: string;
  progress: number;
  uploadStatus: string;
  currentCheckPoint: any;
};

export type OSSInfoFull = {
  data: OSSInfo;
};

export type OSSInfo = {
  region: string;
  bucketName: string;
  accessKeyId: string;
  accessKeySecret: string;
  expiration: string;
  securityToken: string;
};

export type UnzipParam = {
  filepath: string[];
  type: number;
  uid: string;
};

export type DownZipFile = {
  uid: string;
  fileName: string;
  zipStatus?: string;
  filepath: string[];
  type: number;
  rate?: number;
  rateDesc: string;
  fileCount?: number;
  zipCount?: number;
  requestControl?: any;
}
