/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type VehicleStatus = {
  id: number;
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum: string;
  /**
   * 所属车队
   */
  fleet: string;
  /**
   * 能源模式
   * 用油：O；用电：E；油电混合：M
   */
  energy: string;
  /**
   * 登录状态
   * Int	登录：1；未登录：0；故障：9
   */
  loginStatus: number;
  /**
   * 作业模式    Int  自动驾驶：0；人工驾驶：1；未登录：默认为-1
   */
  operationMode: number;
  /**
   * 版本号
   * 当前发布的版本号
   */
  version: string;
  /**
   * 时间
   * yyyy-MM-dd HH:mm:ss
   */
  deviceTime: string;
};

export type VehicleStatusParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum?: string;
  /**
   * 能源模式
   * 用油：O；用电：E；油电混合：M
   */
  energy?: string;
  /**
   * 作业模式    Int  自动驾驶：0；人工驾驶：1；未登录：默认为-1
   */
  operationMode?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
