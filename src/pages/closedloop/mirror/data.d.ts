export type MirrorType = {
  id: number;
  name: string;
  version: string;
  fileName: string;
  parent: string;
  url: string;
  type: string;
  size: number;
  marking: number;
  creator: string;
  label?: MarkingType;
  createTime: Date;
  updateTime: Date;
};

export type MirrorTypeParam = {
  pageSize?: string;
  current?: string;
  project?: string;
  vin?: string;
  parent?: string;
  type?: string;
  filter?: string;
  sorter?: string;
  startTime?: string;
  endTime?: string;
};
