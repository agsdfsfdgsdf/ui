/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type Alarm = {
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
   * 时间
   * yyyy-MM-dd HH:mm:ss
   */
  deviceTime: string;
};

export type AlarmParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum?: string;
  /**
   * 报警类型字符串
   */
  type?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
