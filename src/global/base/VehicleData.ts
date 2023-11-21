export type VehicleData = {
  deviceNum: string;
  tos: string;
  latitude?: number;
  longitude?: number;
  operationMode?: string;
  speed?: number;
  timestamp?: string;

  containerNo?: string;

  vin?: string;
  plateNumber?: string;
  company?: string;
  protocol?: string;
  vehicleType?: string;
  vehicleStatus?: string;
  tscPwd?: string;
  createTime?: string;

  heading: number;
  position: number[];
};
