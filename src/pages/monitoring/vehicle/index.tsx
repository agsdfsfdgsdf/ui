import WrapContent from '@/components/WrapContent';
import VehicleMonitoringAmap from './components/VehicleMonitoringAmap';
import { Card } from 'antd';
import { Col, Row } from 'antd/lib/grid';
import styles from './index.less';
import VehicleList from './components/VehicleList';
import {useEffect} from "react";
import {DataBus} from "data-dispatch";
import {DataTypeConfig} from "@/global/DataEventConfig";

const VehicleMonitoring: React.FC = () => {

  useEffect(() => {
    return () => {
      DataBus.destroy(DataTypeConfig.ACTION_DaX_VEHICLES);
      DataBus.destroy(DataTypeConfig.ACTION_DaX_VEHICLES_ALL);
    }
  }, []);

  return (
    <WrapContent>
      <Row gutter={24}>
        <Col style={{width: 360}}>
          <Card className={styles.allotsVehicleListContainer} title="车辆信息">
            <VehicleList />
          </Card>
        </Col>
        <Col style={{flex: 1}}>
          <div className={styles.allotsMapContainer}>
            <VehicleMonitoringAmap />
          </div>
        </Col>
      </Row>
    </WrapContent>
  );
};

export default VehicleMonitoring;
