import { useEffect } from 'react';
import { useMap, useSDK } from './util';
import './vehicle-marker.css';

function Marker(props) {
  const map = useMap();
  const AMap = useSDK();

  const { id, icon, name, onMarkClick } = props;

  useEffect(() => {
    const marker = new AMap.Marker({
      ...props,
      icon: new AMap.Icon(icon),
    });

    marker.setLabel({
      offset: new AMap.Pixel(0, 40), //设置文本标注偏移量
      content: "<div class='marker-label'>" + name + '</div>', //设置文本标注内容
      direction: 'center', //设置文本标注方位
    });

    marker.on('click', (e) => {
      if (onMarkClick) {
        onMarkClick(e, id);
      }
    });
    map.add(marker);
    return () => {
      map.remove(marker);
    };
  }, [AMap.Icon, AMap.Marker, AMap.Pixel, icon, id, map, name, onMarkClick, props]);
  return null;
}

export default Marker;
