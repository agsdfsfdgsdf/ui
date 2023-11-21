/* *
 * @author 15515
 * @datetime  2022/9/22
 * */

export type Controller = {
  /**
   * 主键
   */
  id: number;
  /**
   * 刹车期望
   */
  brakeD: number;
  /**
   * 刹车控制 取值范围0.0～1.0，代表期望刹车的百分比。0.0对应0%不踩刹车，1.0对应100%踩死
   */
  brakeR: number;
  /**
   * 底层制动反馈量与决策目标量差值
   */
  brakeS: number;
  /**
   * 是否对位结束 无人集卡确认对位完成；是：1，否：0
   */
  cpEnd: number;
  /**
   * 是否对位开始 距目标点5米时触发；是：1，否：0
   */
  cpStart: number;
  /**
   * 车道中心线偏移
   */
  devDistance: number;
  /**
   * 集卡号, TOS中集卡号
   */
  deviceNum: string;
  /**
   * 时间 yyyy-MM-dd HH:mm:ss
   */
  deviceTime: string;
  /**
   * 挡位期望
   */
  gearD: string;
  /**
   * 挡位控制 取值范围：D、R、P、N，代表前进挡、倒车档、驻车档、空挡
   */
  gearR: string;
  /**
   * 是否对位 对位中1，非对位0
   */
  isCp: number;
  /**
   * 规划纬度
   */
  latitudeD: number;
  /**
   * 实际纬度
   */
  latitudeR: number;
  /**
   * 车灯期望 取值范围：L、R、E、N，代表左转向、右转向、双闪、无
   */
  lightD: string;
  /**
   * 车灯控制
   */
  lightR: string;
  /**
   * 规划经度
   */
  longitudeD: number;
  /**
   * 实际经度
   */
  longitudeR: number;
  /**
   *  所在位置
   *  1、集中装卸锁站 2、0W查验场地 3、熏蒸场地 4、CFS过磅场地 5、H986查验场地 6、调箱门场地 7、其它指定点位
   */
  position: number;
  /**
   * 规划速度 单位km/h
   */
  speedD: number;
  /**
   * 区域限速 单位km/h
   */
  speedL: number;
  /**
   * 实际速度 单位km/h
   */
  speedR: number;
  /**
   * 油门期望
   */
  throttleD: number;
  /**
   *  油门控制 取值范围0.0～1.0，代表期望油门的百分比。0.0对应0%不踩油门，1.0对应100%满油。油门期望/控制与反馈量和决策目标值差量之间统一度量衡
   */
  throttleR: number;
  /**
   * 底层油门反馈量与决策目标量差值
   */
  throttleS: number;
  /**
   * 转向期望
   */
  wheelD: number;
  /**
   * 转向控制
   * 取值范围-1.0~1.0，代表反馈方向盘转角的百分比。-1.0对应向左打满100%，0.0代表无转向，1.0代表向右打满100%
   */
  wheelR: number;
  /**
   * 底层转向反馈信息与决策目标量差值
   */
  wheelS: number;
};

export type ControllerParams = {
  /**
   * 集卡号
   * TOS中集卡号
   */
  deviceNum?: string;
  pageSize?: string;
  current?: string;
  filter?: string;
  sorter?: string;
};
