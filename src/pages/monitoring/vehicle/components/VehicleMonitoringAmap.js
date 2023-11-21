import {useEffect, useState} from 'react';

import icon_truck from '@/pages/station/map2d_amap/assets/images/icon_vehicle_dx.png';

import Map2D from '@/pages/station/map2d_amap/Map2D';
import DataConfig from '@/global/DataConfig';
import SocketDXController from "@/global/SocketDXController";
import VehicleMarker from "./VehicleMarker";
import {DataBus} from "data-dispatch";
import {DataTypeConfig} from "@/global/DataEventConfig";
import {MonitoringVehicleBiz} from "@/global/MonitoringBiz";

let preVehicleMarker = [];
const VehicleMonitoringAmap = () => {

  const [vehicles, setVehicles] = useState([]);

  const config = DataConfig.getConfig();

  useEffect(() => {
    SocketDXController.init(config.webSocketTaskURL, (index, connect) => {
      console.log('websocket', index, connect);
    });

    const subDataAll = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_VEHICLES_ALL,
      callback: (data) => {
        let needRefresh = false;
        const vehicleData = MonitoringVehicleBiz.getVehicleListAll();
        vehicleData.forEach((vData) => {
          const filter = preVehicleMarker.filter((v) => v.deviceNum === vData.deviceNum);
          if(!filter || filter.length === 0){
            needRefresh = true;
          }
        });
        if(needRefresh){
          preVehicleMarker = vehicleData;
          setVehicles(vehicleData);
        }
      }
    });

    return () => {
      subDataAll.unsubscribe();
    }

  }, [config]);


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map2D
        id="map2DMonitoring"
        amapKey={config.map.amapKey}
        mapStyle={config.map.mapStyle}
        initialView={config.map.initialView}
      >
        {vehicles &&
          vehicles.map((data, index) => {
            let { deviceNum } = data;
            return (
              <VehicleMarker
                key={deviceNum}
                marker={{
                  icon: {
                    image: icon_truck,
                    imageSize: [46.75, 19.5],
                  },
                  anchor: 'center',
                }}
                data={{ deviceNum: deviceNum, id: 'v' + (index + 1), name: deviceNum }}
              />
            );
          })}

      </Map2D>
    </div>
  );
};

export default VehicleMonitoringAmap;
