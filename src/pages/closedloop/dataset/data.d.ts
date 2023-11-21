import type { MarkingType } from '../rawdata/data';

export type DataSetType = {
  id: number;
  cid?: number;
  vin?: string;
  collect: string;
  parent: string;
  fileName: string;
  url: string;
  type: string;
  size: number;
  label?: MarkingType;
  marking: number;
  creator: string;
  createTime: Date;
  updateTime: Date;
};

export type DataSetParam = {
  pageSize?: string;
  current?: string;
  collect?: string;
  parent?: string;
  marking?: string;
};
