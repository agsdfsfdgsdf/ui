/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type CounterPointType = {
  /**
   * 主键自增
   */
  id: number;
  /**
   * 对位设备类型,激光对位，视觉对位，龙门吊对位
   */
  containerDev: string;
  /**
   * 具体移动的物理值
   */
  containerNo: number;
  /**
   * 操作模式
   */
  controlMode: boolean;
  /**
   * 设备号
   */
  deviceNo: string;
  /**
   * 具体移动的百分比
   */
  rate: number;
  timestamp: string;
  truckNo: string;
};

export type CounterPointTypeParams = {
  truckNo?: string;
  deviceNo?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
