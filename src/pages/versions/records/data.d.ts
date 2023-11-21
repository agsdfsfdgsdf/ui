/* *
 * @author 15515
 * @datetime  2022/9/22
 * */
export type RecordType = {
  id: number;
  vin: string;
  dataType: number;
  oldVersionCode: string;
  versionCode: string;
  status: number;
  progress: number;
  description: string;
  createTime: string;
};

export type RecordListParams = {
  vin?: string;
  dataType?: number;
  status?: number;
  createTime?: string;
  startTime?: string;
  endTime?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
