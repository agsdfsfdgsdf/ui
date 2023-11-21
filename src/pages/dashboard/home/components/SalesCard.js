import { Card, Col, Row, Radio } from 'antd';

import { Area } from '@ant-design/charts';

import styles from '../style.less';
import icon_speed_chart from '../assets/images/icon_speed_chart.png';
import icon_count_current from '../assets/images/icon_count_current.png';
import icon_warn from '../assets/images/icon_warn.png';
import Meta from 'antd/lib/card/Meta';
import { useEffect, useState } from 'react';
import PieChart from './Charts/PieChart';
import { ChartCard } from './Charts';
import numeral from 'numeral';
import { getChartData } from '../service';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';

const topColResponsiveProps1 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 18,
  style: { marginBottom: 24 },
};

const topColResponsiveProps2 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 6,
  style: { marginBottom: 24 },
};

const topColResponsiveProps3 = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 24,
  style: { marginBottom: 24 },
};

let time = 0;
const TIME_UPDATE = 10;

const SalesCard = ({ speed, online, warning, loading, callback }) => {
  const [day, setDay] = useState('today');
  const [time0, setTime] = useState(TIME_UPDATE);

  const [todaySpeed, setTodaySpeed] = useState([]);
  const [yesterdaySpeed, setYesterdaySpeed] = useState([]);

  const [onlineData, setOnlineData] = useState([]);
  const [warningData, setWarningData] = useState([]);

  time = time0;
  const onChange = (e) => {
    setDay(e.target.value);
  };

  const getSpeedData = (speeds) => {
    const data = [];
    if (speeds.length > 0) {
      Array.from(speeds).forEach((cSpeed) => {
        const time1 = (cSpeed.time + '').split(' ')[1];
        data.push({
          n: '平均速度',
          x: time1,
          y: cSpeed.avg,
        });
        data.push({
          n: '最高速度',
          x: time1,
          y: cSpeed.max,
        });
      });
    }
    return data;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      let t = time - 1;
      if (t < 0) {
        t = TIME_UPDATE;
        time = TIME_UPDATE;

        getChartData().then((res) => {
          if (res && res.code === 200) {
            if (res.data) {
              const { speed, online, warning } = res.data;
              if (speed && speed.length > 0) {
                if (!todaySpeed || todaySpeed.length === 0) {
                  setTodaySpeed(getSpeedData(speed[0].today));
                }

                if (!yesterdaySpeed || yesterdaySpeed.length === 0) {
                  setYesterdaySpeed(getSpeedData(speed[0].yesterday));
                }
              }

              if (online && online.length > 0) {
                setOnlineData(online);
              }

              if (warning && warning.length > 0) {
                setWarningData(warning);
              }

              DataBus.push({
                type: DataTypeConfig.ACTION_HOME,
                data: res.data,
              });
            }
          }
        });

        callback();
      }

      setTime(t);
    }, 1000);

    if (speed && speed.length > 0) {
      if (!todaySpeed || todaySpeed.length === 0) {
        setTodaySpeed(getSpeedData(speed[0].today));
      }

      if (!yesterdaySpeed || yesterdaySpeed.length === 0) {
        setYesterdaySpeed(getSpeedData(speed[0].yesterday));
      }
    }

    if (online && online.length > 0) {
      if (!onlineData || onlineData.length === 0) {
        setOnlineData(online);
      }
    }

    if (warning && warning.length > 0) {
      if (!warningData || warningData.length === 0) {
        setWarningData(warning);
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps1}>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tabHeader}>
            <Meta
              className={styles.cardMeta}
              avatar={<img src={icon_speed_chart} />}
              title="车辆运营速度分布"
            />

            <div className={styles.tabHeaderSpace} />

            <Radio.Group className={styles.tabHeaderRight} value={day} onChange={onChange}>
              <Radio.Button value="today">今日</Radio.Button>
              <Radio.Button value="yesterday">昨日</Radio.Button>
            </Radio.Group>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

          <div className={styles.salesCard}>
            {day === 'yesterday' && (
              <Area
                height={391}
                forceFit
                data={yesterdaySpeed}
                seriesField="n"
                xField="x"
                yField="y"
                legend={{
                  position: 'bottom-center',
                }}
                xAxis={{
                  visible: true,
                  title: {
                    visible: false,
                  },
                }}
                yAxis={{
                  visible: true,
                  tickInterval: 20,
                  title: {
                    visible: false,
                  },
                }}
                title={{
                  visible: false,
                  text: '昨日',
                  style: {
                    fontSize: 14,
                  },
                }}
                meta={{
                  y: {
                    alias: '速度',
                  },
                }}
              />
            )}

            {day === 'today' && (
              <Area
                height={391}
                forceFit
                data={todaySpeed}
                seriesField="n"
                xField="x"
                yField="y"
                legend={{
                  position: 'bottom-center',
                }}
                xAxis={{
                  visible: true,
                  title: {
                    visible: false,
                  },
                }}
                yAxis={{
                  visible: true,
                  tickInterval: 20,
                  title: {
                    visible: false,
                  },
                }}
                title={{
                  visible: false,
                  text: '今日',
                  style: {
                    fontSize: 14,
                  },
                }}
                meta={{
                  y: {
                    alias: '速度',
                  },
                }}
              />
            )}
          </div>
        </Card>
      </Col>
      <Col {...topColResponsiveProps2}>
        <Row gutter={24}>
          <Col {...topColResponsiveProps3}>
            <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <div className={styles.tabHeader}>
                <Meta
                  className={styles.cardMeta}
                  avatar={<img src={icon_count_current} />}
                  title="当前在线"
                />
              </div>

              <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

              <div className={styles.salesRightCard}>
                {onlineData[0] && (
                  <ChartCard
                    bordered={false}
                    label={onlineData[0].time + ''}
                    loading={loading}
                    title="在线运营车辆"
                    total={numeral(onlineData[0].total).format('0')}
                    contentHeight={26}
                  >
                    <Row>
                      <span>⚪</span>
                      <span>{time0}</span>
                      <>秒后更新</>
                    </Row>
                  </ChartCard>
                )}
              </div>
            </Card>
          </Col>
          <Col {...topColResponsiveProps3}>
            <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <div className={styles.tabHeader}>
                <Meta
                  className={styles.cardMeta}
                  avatar={<img src={icon_warn} />}
                  title="告警统计"
                />
              </div>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />
              <div className={styles.salesRightCard1}>
                {warningData[0] && <PieChart optionData={warningData[0]} />}
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SalesCard;
