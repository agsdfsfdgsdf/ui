import { Card, Col, Row } from 'antd';

import styles from '../style.less';
import icon_common from '../assets/images/icon_common.png';

import Meta from 'antd/lib/card/Meta';
import getIcon from '../utils/GetIconUtil';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { getLargeScreenUrl } from '@/utils/RequestUrl';

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

const CommonEntrances = ({ common, loading }) => {
  const [commonData, setCommonData] = useState(common);

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_HOME,
      callback: (data) => {
        if (data && data.Common) {
          console.log(data.Common);

          setCommonData(data.Common);
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  }, []);

  if (!commonData) return null;

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps1}>
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tabHeader}>
            <Meta
              className={styles.cardMeta}
              avatar={<img src={icon_common} />}
              title="我的常用入口"
            />
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#00000020' }} />

          <div className={styles.commonCard}>
            <Row>
              {commonData &&
                commonData.map((item, index) => {
                  const iconAndRoute = getIcon(item);
                  return (
                    <Col
                      key={'col_' + index}
                      className={styles.commonPanel}
                      {...topColResponsiveProps}
                    >
                      <img
                        src={iconAndRoute.icon}
                        onClick={() => {
                          if (iconAndRoute.name === '云控指挥中心') {
                            window.open(getLargeScreenUrl());
                            return;
                          }
                          history.push(iconAndRoute.route);
                        }}
                      />
                      <span>{item.name}</span>
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default CommonEntrances;
