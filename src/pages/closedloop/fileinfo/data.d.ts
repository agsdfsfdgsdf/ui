import type { MarkingType } from '../rawdata/data';

export type FileInfo = {
  id: number;
  fileName: string;
  url: string;
  type: string;
  size: number;
  label?: MarkingType;
};

export type ShowInfoData = {
  isShow?: boolean;
  data?: FileInfo;
  allData?: FileInfo[];
  upkey?: string;
};
