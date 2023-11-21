/* *
 * @author cxb
 * @datetime  2023/10/27
 * */
export type WarnCount = {
  id: number;
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum: string;
  /**
   * 报警类型字符串
   */
  type: string;
  /**
   * 开始时间
   * yyyy-MM-dd HH:mm:ss
   */
  startTime: string;
  /**
   * 结束时间
   * yyyy-MM-dd HH:mm:ss
   */
  endTime: string;
};

export type WarnCountParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum?: string;
  /**
   * 开始时间
   * yyyy-MM-dd HH:mm:ss
   */
  startTime: string;
  /**
   * 结束时间
   * yyyy-MM-dd HH:mm:ss
   */
  endTime: string;
  type?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
