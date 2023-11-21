export type Mileage = {
  count: number;
  newAdd: number;
};

export type Box = {
  count: number;
  time: string;
};

export type RunTime = {
  count: number;
  newAdd: number;
};

export type WeekWork = {
  containerCount: number;
  date: string;
  efficiency: number;
};

export type PositionInfo = {
  automatic: number;
  manualCount: number;
};

export type VehicleInfo = {
  vehicleOffline: number;
  vehicleOnline: number;
};

export type HomeDxData = {
  mileage?: Mileage;
  box?: Box;
  runTime?: RunTime;
  avgSpeed?: number;
  weekWorks?: WeekWork[];
  positionInfo?: PositionInfo;
  vehicleInfo?: VehicleInfo;
  warnCount?: any;
};
