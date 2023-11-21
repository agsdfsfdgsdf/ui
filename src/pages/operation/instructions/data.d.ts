/* *
 * @author cxb
 * @datetime  2023/9/22
 * */

export type TcsGetInstructions = {
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
   * 指令数据
   */
  resData: string;
};

export type TcsGetInstructionsParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  truckNo?: string;
  /**
   * 请求时间
   */
  time?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
