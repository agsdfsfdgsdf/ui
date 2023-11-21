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

const IntroduceRow = ({ loading, mileage, box, runTime, avgSpeed }) => {
  const [mileageData, setMileageData] = useState(mileage);
  const [boxData, setBoxData] = useState(box);
  const [runTimeData, setRunTimeData] = useState(runTime);
  const [avgSpeedData, setAvgSpeedData] = useState(avgSpeed);

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_HOME,
      callback: (value) => {
        if (value) {
          if (value.mileage) {
            setMileageData(value.mileage);
          }
          if (value.box) {
            setBoxData(value.box);
          }
          if (value.runTime) {
            setRunTimeData(value.runTime);
          }
          if (value.avgSpeed) {
            setAvgSpeedData(value.avgSpeed);
          }
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  }, []);

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          avatar={icon_mileage}
          title="累计里程"
          loading={loading}
          total={
            mileageData && mileageData.count
              ? numeral(mileageData.count).format('0,0') + 'km'
              : '- km'
          }
          contentHeight={26}
        >
          <Trend title="较昨日" flag={mileageData && mileageData.newAdd && Number.parseFloat(mileageData.newAdd).toFixed(0) < 0 ? "down" : "up"}>
            <span className={styles.trendText}>
              {mileageData && mileageData.newAdd
                ? Math.abs(Number.parseFloat(mileageData.newAdd)).toFixed(0) + 'km'
                : '- km'}
            </span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          avatar={icon_count_totle}
          loading={loading}
          title="累计箱量"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={boxData && boxData.count ? numeral(boxData.count).format('0,0') + '箱' : '- 箱'}
          contentHeight={26}
        >
          <span className={styles.trendText}>{boxData && boxData.time ? boxData.time : '-'}</span>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          avatar={icon_times}
          loading={loading}
          title="运行时间"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={
            runTimeData && runTimeData.count
              ? Number.parseFloat(runTimeData.count).toFixed(0) + 'h'
              : '- h'
          }
          contentHeight={26}
        >
          <Trend title="较昨日" flag={runTimeData && runTimeData.newAdd && Number.parseFloat(runTimeData.newAdd).toFixed(0) < 0 ? "down" : "up"}>
            <span className={styles.trendText}>
              {runTimeData && runTimeData.newAdd
                ? Math.abs(Number.parseFloat(runTimeData.newAdd)).toFixed(0)
                : '-'}
              h
            </span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          avatar={icon_time}
          title="平均时速"
          total={avgSpeedData ? numeral(avgSpeedData).format('0,0') + 'km/h' : '- km/h'}
          contentHeight={26}
        >
          <Trend title="" flag={''}>
            <span className={styles.trendText}></span>
          </Trend>
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
