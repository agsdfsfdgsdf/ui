/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type PerceiveType = {
  /**
   * 主键自增
   */
  id: number;
  /**
   * 人工介入，人工介入
   */
  artIntervention: boolean;
  /**
   * 批次号，标记哪条数据为同一次上传
   */
  batchNo: number;
  /**
   * 集卡号，TOS中集卡号
   */
  deviceNum: string;
  /**
   * 因车道线质量差无法准确识别，因车道线质量差无法准确识别0.00-1，数字越大表示质量越好
   */
  lineBreak: number;
  /**
   * 感知障碍物1碰撞时间，感知障碍物1碰撞时间
   */
  obstacleCollision: number;
  /**
   * 感知障碍物1_横坐标位置，感知障碍物1 X位置
   */
  obstacleDistanceX: number;
  /**
   * 感知障碍物1_纵坐标位置，感知障碍物1 Y位置
   */
  obstacleDistanceY: number;
  /**
   * 感知障碍物1置信度，感知障碍物1置信度
   */
  obstacleSafelevel: number;
  /**
   * 感知障碍物1尺寸，长宽高
   */
  obstacleSize: string;
  /**
   * 感知障碍物1横坐标速度，感知障碍物1 X速度
   */
  obstacleSpeedX: number;
  /**
   * 感知障碍物1纵坐标速度，感知障碍物1 Y速度
   */
  obstacleSpeedY: number;
  /**
   * 感知障碍物1类型，龙门吊:R；桥吊：Q；集卡：T；小车：C；其他静态障碍物：E；其他动态障碍物：M---厂商
   */
  obstacleStatus: string;
};

export type PerceiveTypeParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum: string;
  /**
   * 能源模式
   * 用油：O；用电：E；油电混合：M
   */
  energy: string;
  /**
   * 作业模式    Int  自动驾驶：0；人工驾驶：1；未登录：默认为-1
   */
  operationMode: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
