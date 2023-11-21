import { useEffect } from 'react';
import { useMap, useSDK } from './util';
import './vehicle-marker.css';

function Polyline(props) {
  const map = useMap();
  const AMap = useSDK();

  let { planRouteArray, passRouteArray } = props;
  planRouteArray = JSON.parse(planRouteArray);
  passRouteArray = JSON.parse(passRouteArray);

  useEffect(() => {
    // 绘制轨迹
    var polyline = new AMap.Polyline({
      map: map,
      path: planRouteArray,
      showDir: true,
      strokeColor: '#28F', //线颜色
      // strokeOpacity: 1,     //线透明度
      strokeWeight: 6, //线宽
      // strokeStyle: "solid"  //线样式
    });

    // 绘制轨迹
    // var polyline2 = new AMap.Polyline({
    //   map: map,
    //   path: passRouteArray,
    //   showDir: true,
    //   strokeColor: '#F00', //线颜色
    //   // strokeOpacity: 1,     //线透明度
    //   strokeWeight: 16, //线宽
    //   // strokeStyle: "solid"  //线样式
    // });

    return () => {
      map.remove(polyline);
      // map.remove(polyline2);
    };
  }, [AMap.Polyline, map, passRouteArray, planRouteArray]);

  return null;
}

export default Polyline;
