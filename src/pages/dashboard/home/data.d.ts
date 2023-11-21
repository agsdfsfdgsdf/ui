import { DataItem } from '@antv/g2plot/esm/interface/config';

export { DataItem };

export interface VisitDataType {
  total: number;
  discrepancy: number;
}

export type SpeedData = {
  today: [];
  yesterday: [];
};

export type RadarData = {
  name: string;
  label: string;
  value: number;
};

export interface HomeData {
  mileage: DataItem[];
  VehicleCount: DataItem[];
  RunCount: DataItem[];
  time: DataItem[];
  online: DataItem[];
  warning: DataItem[];
  speed: DataItem<SpeedData>[];
  Common: DataItem[];
}
