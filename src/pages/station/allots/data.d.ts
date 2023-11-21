/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */
export type TaskAllot = {
  vin: string;
  id: string;
};

export type TaskType = {
  taskId: string;
  vin: string;
  stationLongitude: number;
  stationLatitude: number;
  points: string;
  length: number;
  status: number;
  createTime: string;
  finishTime: string;
};

export type TaskListParams = {
  taskId: string;
  vin: string;
  stationLongitude: string;
  stationLatitude: string;
  points: string;
  length: string;
  status: string;
  createTime: string;
  finishTime: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
