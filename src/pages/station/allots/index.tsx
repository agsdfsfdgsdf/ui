import { useState, useEffect } from 'react';
import WrapContent from '@/components/WrapContent';
import StationAllotAmap from './components/StationAllotAmap';
import { DataBus, EventBus } from 'data-dispatch';
import { DataTypeConfig, EventTypeConfig } from '@/global/DataEventConfig';
import { getStationList } from '../manager/service';
import { getVehicleList } from '@/pages/cars/manager/service';
import { Card, message } from 'antd';
import { Col, Row } from 'antd/lib/grid';
import styles from './index.less';
import TaskBiz from '@/global/TaskBiz';
import VehicleList from './components/VehicleList';

const Allots: React.FC = () => {
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getStationList().then((res) => {
      if (res && res.total > 0) {
        setStations(res.rows);
      }
    });

    getVehicleList().then((res) => {
      if (res && res.total > 0) {
        TaskBiz.load(res.rows, (vehicles1: any) => {
          setVehicles(vehicles1);
        });
      }
    });

    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_TASK,
      callback: (data: any) => {
        if (data && data.vin) {
          TaskBiz.updateTaskStatus(data);
          if (data.status === 0) {
            message.warn('当前任务拒绝执行！');
          } else if (data.status === 1) {
            message.info('当前任务已接受，正在执行中！');
          } else if (data.status === 4) {
            message.success('任务执行完成！');
          }
          if (data.status === 0 || data.status === 1 || data.status === 4) {
            TaskBiz.reload((vehicles1: any) => {
              setVehicles(vehicles1);
            });
          }
        }
      },
    });

    const subRoute = DataBus.subscribe({
      type: DataTypeConfig.ACTION_ROUTE,
      callback: (data: any) => {
        setVehicles(data);
      },
    });

    return () => {
      subData.unsubscribe();
      subRoute.unsubscribe();
    };
  }, []);

  const leftProps = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 11,
    xl: 7,
    style: { marginBottom: 24 },
  };

  const rightProps = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 13,
    xl: 17,
    style: { marginBottom: 24 },
  };

  const onStationClick = (e: any, station: any) => {
    EventBus.dispatch({
      type: EventTypeConfig.ACTION_MAP,
      action: 'station_click',
      value: station,
    });
  };

  return (
    <WrapContent>
      <Row gutter={24}>
        <Col {...leftProps}>
          <Card className={styles.allotsVehicleListContainer} title="车辆信息">
            <VehicleList vehicles={vehicles} />
          </Card>
        </Col>
        <Col {...rightProps}>
          <div className={styles.allotsMapContainer}>
            <StationAllotAmap
              stations={stations}
              vehicles={vehicles}
              onMarkClick={onStationClick}
            />
          </div>
        </Col>
      </Row>
    </WrapContent>
  );
};

export default Allots;
