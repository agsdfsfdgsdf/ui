import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';

import numeral from 'numeral';
import { ChartCard } from './Charts';
import Trend from './Trend';
import styles from '../style.less';

import icon_mileage from '../assets/images/icon_mileage.png';
import icon_count_totle from '../assets/images/icon_count_totle.png';
import icon_times from '../assets/images/icon_times.png';
import icon_time from '../assets/images/icon_time.png';
import { useEffect, useState } from 'react';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, mileage, vehicleCount, runCount, time }) => {
  const [mileageData, setMileageData] = useState(mileage);
  const [vehicleCountData, setVehicleCountData] = useState(vehicleCount);
  const [runCountData, setRunCountData] = useState(runCount);
  const [timeData, setTimeData] = useState(time);

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_HOME,
      callback: (data) => {
        if (data) {
          if (data.mileage) {
            setMileageData(data.mileage);
          }
          if (data.VehicleCount) {
            setVehicleCountData(data.VehicleCount);
          }
          if (data.RunCount) {
            setRunCountData(data.RunCount);
          }
          if (data.time) {
            setTimeData(data.time);
          }
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  }, []);

  if (!mileageData[0] || !vehicleCountData[0] || !runCountData[0] || !timeData[0]) return null;

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          avatar={icon_mileage}
          title="总运营里程"
          loading={loading}
          total={numeral(mileageData[0].total).format('0,0')}
          contentHeight={26}
        >
          <Trend title="较昨日" flag="up">
            <span className={styles.trendText}>
              {Number.parseFloat(mileageData[0].discrepancy).toFixed(0) + 'km'}
            </span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          avatar={icon_count_totle}
          loading={loading}
          title="总运营车辆"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(vehicleCountData[0].total).format('0,0')}
          contentHeight={26}
        >
          <span className={styles.trendText}>{vehicleCountData[0].time}</span>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          avatar={icon_times}
          loading={loading}
          title="今日总趟数"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(runCountData[0].total).format('0,0')}
          contentHeight={26}
        >
          <Trend
            title="较昨日"
            flag={Number.parseFloat(runCountData[0].discrepancy).toFixed(0) > 0 ? 'up' : 'down'}
          >
            <span className={styles.trendText}>
              {Math.abs(Number.parseFloat(runCountData[0].discrepancy)).toFixed(0)}次
            </span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          avatar={icon_time}
          title="运行总时长"
          total={Number.parseFloat(timeData[0].total).toFixed(0) + 'h'}
          contentHeight={26}
        >
          <Trend title="较昨日" flag="up">
            <span className={styles.trendText}>
              {Number.parseFloat(timeData[0].discrepancy).toFixed(0)}h
            </span>
          </Trend>
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
