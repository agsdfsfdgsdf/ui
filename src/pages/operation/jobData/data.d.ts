/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type JobData = {
  /**
   * 主键ID
   */
  tableId: number;
  /**
   * 任务ID
   */
  id: number;
  /**
   * 落箱距离误差值
   * 集卡背箱时与标准位置的误差判断
   */
  containerDev: number;
  /**
   * 接受指令时间
   * yyyy-MM-dd HH:mm:ss
   */
  receivungTime: string;
  /**
   * 指令完成时间
   * yyyy-MM-dd HH:mm:ss
   */
  finishTime: string;
  /**
   * 集卡号
   */
  deviceNum: number;
  /**
   * 作业箱号
   */
  containerNo: number;
};

export type JobDataParams = {
  id?: string;
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum?: string;
  /**
   * 作业箱号
   */
  containerNo?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
