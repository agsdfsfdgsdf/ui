/* *
 * @author cxb
 * @datetime  2023/9/22
 * */

export type TcsWebsocketGetQdInfo = {
  id: number;
  /**
   * 时间
   * yyyy-MM-dd HH:mm:ss
   */
  time: string;
  /**
   * 集卡号
   * TOS中集卡号
   */
  truckNo: string;
/**
     * 变化的内容
     */
  resChangedtype: number;

/**
 * 桥吊ids
 */
  resId: string;

/**
 * 桥吊名称
 */
  resName: string;

/**
 * 0 正常工作状态  1 桥吊不可用  2 桥吊关路信息
 */
  resState: number;

/**
 * S20 小，S40 40尺箱，S45 45尺箱， S220 双小箱
 */
  resSling: string;

/**
 * GPS位置  预留
 */
  resPosition: string;

/**
 * 关路信息
 */
  resClosedlanes: string;

/**
 * 刷新时间
 */
  resRefreshtime: string;

/**
 * 刷新时间信息
 */
  resRefreshtimevalue: string;
};

export type TcsWebsocketGetQdInfoParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  truckNo?: string;
  /**
   * 请求时间
   */
  time?: string;
  /**
 * 桥吊名称
 */
  resName: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
