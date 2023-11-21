export type DataType = {
  id: number;
  project: string;
  vin: string;
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

export type MarkingType = {
  weather?: string;
  event?: string;
  timeInterval?: string;
};

export type DataTypeParam = {
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
