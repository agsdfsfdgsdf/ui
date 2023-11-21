import { useEffect } from 'react';
import Map2D from '../../map2d_amap/Map2D';
import StationMarker from '../../map2d_amap/StationMarker';
import icon_camera from '../../map2d_amap/assets/images/icon_camera.png';
import DataConfig from '@/global/DataConfig';

const StationManagerAmap = (props) => {
  const config = DataConfig.getConfig();

  let { id, position, onMoveMarker } = props;

  return (
    <Map2D
      id="map2DStation"
      amapKey={config.map.amapKey}
      mapStyle={config.map.mapStyle}
      initialView={{
        center: props.position,
        zoom: config.map.initialView.zoom,
      }}
    >
      <StationMarker
        key={'station' + props.id}
        position={props.position}
        icon={{
          image: icon_camera,
          imageSize: [48, 48],
        }}
        anchor="bottom-center"
        onMoveMarker={onMoveMarker}
      />
    </Map2D>
  );
};

export default StationManagerAmap;
