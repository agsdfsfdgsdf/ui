import { useEffect } from 'react';
import { useMap, useSDK } from './util';

function StationMarker(props) {
  const map = useMap();
  const AMap = useSDK();

  const { icon, onMoveMarker } = props;

  useEffect(() => {
    let marker = new AMap.Marker({
      ...props,
      icon: new AMap.Icon(icon),
      // 设置是否可以拖拽
      draggable: true,
      cursor: 'move',
    });

    marker.on('dragend', function (e) {
      if (onMoveMarker) {
        onMoveMarker([e.target.getPosition().lng, e.target.getPosition().lat]);
      }
    });

    map.add(marker);

    return () => {
      map.remove(marker);
    };
  }, [props]);

  return null;
}

export default StationMarker;
