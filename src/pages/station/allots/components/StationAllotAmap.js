import { useState, useEffect, useRef } from 'react';
import SocketController from '@/global/SocketController';

import icon_camera from '../../map2d_amap/assets/images/icon_camera.png';
import icon_truck from '../../map2d_amap/assets/images/icon_truck.png';

import { getVehicleList } from '@/pages/cars/manager/service';
import { getStationList } from '@/pages/station/manager/service';
import Map2D from '../../map2d_amap/Map2D';
import Marker from '../../map2d_amap/Marker';
import VehicleMarker from '../../map2d_amap/VehicleMarker';
import { useRequest } from 'umi';
import { getConfig } from '../service';
import Polyline from '../../map2d_amap/Polyline';
import DataConfig from '@/global/DataConfig';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import TaskBiz from '@/global/TaskBiz';

const StationAllotAmap = (props) => {
  const config = DataConfig.getConfig();

  useEffect(() => {
    SocketController.init(config.webSocketTaskURL, (index, connect) => {
      console.log('websocket', index, connect);
    });
    return () => {
      SocketController.uninit();
    };
  }, [config]);

  const { stations, vehicles, onMarkClick } = props;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map2D
        id="map2DAllots"
        amapKey={config.map.amapKey}
        mapStyle={config.map.mapStyle}
        initialView={config.map.initialView}
      >
        {stations &&
          stations.map((data) => {
            let { id, name, longitude, latitude, heading } = data;
            return (
              <Marker
                key={id}
                id={id}
                name={name}
                position={[longitude, latitude]}
                icon={{
                  image: icon_camera,
                  imageSize: [48, 48],
                }}
                anchor="bottom-center"
                onMarkClick={(e, id) => {
                  return onMarkClick(
                    e,
                    stations?.find((station) => station.id === id),
                  );
                }}
              />
            );
          })}

        {vehicles &&
          vehicles.map((data, index) => {
            let { vin, plateNumber } = data;
            return (
              <VehicleMarker
                key={vin}
                marker={{
                  icon: {
                    image: icon_truck,
                    imageSize: [60, 38],
                  },
                  anchor: 'center',
                }}
                data={{ vin: vin, id: 'v' + (index + 1), name: plateNumber }}
              />
            );
          })}

        {vehicles &&
          vehicles.map((data, index) => {
            if (data.points && data.locus) {
              return (
                <Polyline
                  key={'route_' + index}
                  planRouteArray={data.points}
                  passRouteArray={data.locus}
                />
              );
            }
          })}
      </Map2D>
    </div>
  );
};

export default StationAllotAmap;
