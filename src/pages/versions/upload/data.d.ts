/* *
 * @author 15515
 * @datetime  2022/11/22
 * */
export type OTAAppType = {
  dataType: number;
  apply: string;
  description: string;
};

export type OTAVersion = {
  id: number;
  apply: string;
  versionName: string;
  dataType: number;
  maxVersionCode: string;
  count: number;
  maxUpdateTime: string;
  description: string;
  list: OTAFileType[];
};

export type OTAFileType = {
  id: number;
  versionCode: string;
  dataType: number;
  fileName: string;
  vehicleType: int;
  protocol: string;
  uploader: string;
  updateType: int;
  fileSize: number;
  md5: string;
  sign: string;
  description: varchar;
  status: int;
  fileUrl: varchar;
  createTime: timestamp;
  updateTime: timestamp;
};

export type OTAListParams = {
  id: int;
  dataType: number;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
