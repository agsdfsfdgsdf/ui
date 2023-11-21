import { Card, Col, Row } from 'antd';

import styles from '../style.less';
import icon_warn from '../assets/images/icon_warn.png';

import Meta from 'antd/lib/card/Meta';
import getIcon from '../utils/GetIconUtil';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { getLargeScreenUrl } from '@/utils/RequestUrl';
import WarningChart from '@/pages/dashboard/laboratory/components/WarningChart';

const topColResponsiveProps1 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  style: { marginBottom: 24 },
};

const topColResponsiveProps = {
  xs: 12,
  sm: 8,
  md: 8,
  lg: 6,
  xl: 4,
  style: { marginBottom: 24 },
};

const CommonEntrances = ({ loading }) => {
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps1}>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tabHeader}>
            <Meta
              className={styles.cardMeta}
              avatar={<img src={icon_warn} />}
              title="报警数据统计"
            />
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

          <div className={styles.commonCard}>
            <WarningChart />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default CommonEntrances;
