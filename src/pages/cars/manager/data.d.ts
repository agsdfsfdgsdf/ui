/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type VehicleType = {
  vin: string;
  plateNumber: string;
  deviceNum: string;
  company: string;
  protocol: string;
  vehicleType: string;
  vehicleStatus: string;
  tscPwd: string;
  createTime: string;
};

export type VehicleListParams = {
  vin?: string;
  plateNumber?: string;
  company?: string;
  protocol?: string;
  vehicleType?: string;
  vehicleStatus?: string;
  createTime?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
