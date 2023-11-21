import { Card, Col, Row, Radio } from 'antd';

import { DualAxes } from '@ant-design/plots';
import styles from '../style.less';
import icon_speed_chart from '../assets/images/icon_speed_chart.png';
import icon_count_current from '../assets/images/icon_count_current.png';
import icon_vinfo from '../assets/images/icon_vehicleinfo.png';
import icon_common from '../assets/images/icon_common.png';
import Meta from 'antd/lib/card/Meta';
import { useEffect, useState } from 'react';
import { ChartCard } from './Charts';
import numeral from 'numeral';
import { getChartData } from '../service';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import JobChart from '@/pages/dashboard/laboratory/components/JobChart';
import GaugeChart from '@/pages/dashboard/laboratory/components/GaugeChart';
import PieChart from '@/pages/dashboard/laboratory/components/PieChart';
import Pie2Chart from '@/pages/dashboard/laboratory/components/Pie2Chart';

const topColResponsiveProps1 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 12,
  style: { marginBottom: 24 },
};

const topColResponsiveProps01 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 6,
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

const topColResponsiveProps03 = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 24,
};

let time = 0;
const TIME_UPDATE = 10;

const SalesCard = ({ loading }) => {
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps1}>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tabHeader}>
            <Meta
              className={styles.cardMeta}
              avatar={<img src={icon_speed_chart} />}
              title="周作业量和作业效率"
            />
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

          <div className={styles.salesCard}>
            <JobChart />
          </div>
        </Card>
      </Col>
      <Col {...topColResponsiveProps01}>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tabHeader}>
            <Meta
              className={styles.cardMeta}
              avatar={<img src={icon_count_current} />}
              title="自动驾驶数据"
            />
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

          <div className={styles.salesCenterCard}>
            <div className={styles.salesCenterContent}>
              <GaugeChart
                keyD="guz"
                title="故障率"
                value={0.02}
                tipLabel={['故障数量', '故障时长']}
                tipValue={[203, 230]}
                tipUnit={['次', 'h']}
              />
            </div>
            <div className={styles.salesCenterContent}>
              <GaugeChart
                keyD="jg"
                title="接管率"
                value={0.01}
                tipLabel={['接管次数', '接管时长']}
                tipValue={[20, 32]}
                tipUnit={['次', 'h']}
              />
            </div>
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
                  avatar={<img src={icon_vinfo} />}
                  title="车辆详情"
                />
              </div>

              <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

              <div className={styles.salesRightCard}>
                <PieChart />
              </div>
            </Card>
          </Col>
          <Col {...topColResponsiveProps03}>
            <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <div className={styles.tabHeader}>
                <Meta
                  className={styles.cardMeta}
                  avatar={<img src={icon_common} />}
                  title="告警统计"
                />
              </div>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />
              <div className={styles.salesRightCard1}>
                <Pie2Chart />
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SalesCard;
