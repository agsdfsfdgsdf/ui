/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

export type StationType = {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  altitude: number;
  yaw: number;
  createTime: string;
  updateTime: string;
};

export type StationListParams = {
  id: string;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  altitude: string;
  yaw: string;
  createTime: string;
  updateTime: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
