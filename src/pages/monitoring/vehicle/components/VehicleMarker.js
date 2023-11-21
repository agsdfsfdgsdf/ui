import { useEffect } from 'react';
import { message } from 'antd';
import { DataBus, EventBus } from 'data-dispatch';
import './vehicle-marker.css';
import { useMap, useSDK } from '@/pages/station/map2d_amap/util';
import { DataTypeConfig, EventTypeConfig } from '@/global/DataEventConfig';
import { formatDate } from '@/utils/DateUtils';
import icon_sj from '@/pages/station/map2d_amap/assets/images/icon_sj.png';
import icon_dch from '@/pages/station/map2d_amap/assets/images/icon_dch.png';
import icon_close from '@/pages/station/map2d_amap/assets/images/icon_close.png';

class VehicleProperty {
  constructor(data) {
    this.data = data;
    this.tracked = false;
  }

  getPosition() {
    let { state, lastState, startTime } = this.data;
    if (!state) {
      return null;
    }
    let position = null;
    if (!lastState) {
      position = state.position;
    } else {
      let t = Date.now() - startTime;
      let dt = state.time - lastState.time;
      if (t >= dt || Number.isNaN(t) || Number.isNaN(dt)) {
        position = state.position;
      } else {
        if (lastState.position && state.position) {
          let [x1, y1] = lastState.position;
          let [x2, y2] = state.position;
          position = [x1 + ((x2 - x1) * t) / dt, y1 + ((y2 - y1) * t) / dt];
        }
      }
    }
    return position;
  }

  getVehicleInfo() {
    let { state } = this.data;
    if (!state) {
      return null;
    }
    return state;
  }

  getHeading() {
    let { state, lastState, startTime } = this.data;
    if (!state) {
      return null;
    }
    let heading = null;
    if (!lastState) {
      heading = state.heading;
    } else {
      let t = Date.now() - startTime;
      let dt = state.time - lastState.time;
      if (t >= dt) {
        heading = state.heading;
      } else {
        let dh = state.heading - lastState.heading;
        if (dh > 180) dh -= 360;
        if (dh < -180) dh += 360;
        heading = lastState.heading + (dh * t) / dt;
      }
    }
    return heading;
  }

  setTracked(tracked) {
    this.tracked = tracked;
  }

  getTracked() {
    return this.tracked;
  }
}

function VehicleMarker(props) {
  const { data } = props;

  let showStatusLable = false;

  const vehicleData = {};
  function updateData(state) {
    if (state) {
      vehicleData.state && (vehicleData.lastState = { ...vehicleData.state });
      state && (vehicleData.state = { ...state });
      vehicleData.startTime = Date.now();
    }
  }
  const vehicleProperty = new VehicleProperty(vehicleData);

  const map = useMap();
  const AMap = useSDK();

  const { deviceNum } = data;
  const markerProps = props.marker;

  const startAnimation = (map, marker, markerLable, markerLableTop) => {
    let timeRefresh = 0;
    return setInterval(() => {
      if (marker) {
        const position = vehicleProperty.getPosition();

        if (position && position.length === 2 && !Number.isNaN(position[0]) && !Number.isNaN(position[1])) {
          marker.setPosition(position);
          marker.setAngle(vehicleProperty.getHeading() - 90);
          marker.show();

          if (markerLable) {
            markerLable.setPosition(position);
          }
          if (markerLableTop) {
            markerLableTop.setPosition(position);
            const timeSpan = document.getElementById('time_' + deviceNum);
            if (timeSpan) {
              const { time } = vehicleProperty.getVehicleInfo();
              if (time) {
                timeSpan.innerText = formatDate(time);
              }
            }
          }
        } else {
          marker.hide();
        }
      }
      timeRefresh++;
      if (markerLableTop && timeRefresh % 20 === 0) {
        //界面数据1s刷新一次
        timeRefresh = 0;
        showMarkerLable(markerLable, markerLableTop);
      }
    }, 50);
  };
  const stopAnimation = (tid) => {
    clearInterval(tid);
  };

  const showMarkerLable = (markerLable, markerLableTop) => {
    const vehicleInfo = vehicleProperty.getVehicleInfo();

    if (!vehicleInfo) return;

    if (showStatusLable) {
      markerLable.hide();
      markerLableTop.show();
      var infoWindowContent = `
        <div class="vehicle-status-card">
          <div class="vehicle-status-card-info" >
            <div class="vehicle-status-card-head">
              <div class="vehicle-status-card-head-left" >
                  ${vehicleInfo.deviceNum}
              </div>
              <div class="vehicle-status-card-head-right">
                  <img id="img-close-${vehicleInfo.deviceNum}" class="img-close" src="${icon_close}" />
              </div>
            </div>
            <div class="vehicle-status-card-body">
              <div class="vehicle-status-card-body-row">
                  <span class="vehicle-status-card-body-row-left">登录状态</span>
                  <span class="vehicle-status-card-body-row-right">
                      ${vehicleInfo.tos || '加载中'}
                  </span>
              </div>
              <div class="vehicle-status-card-body-row">
                  <span class="vehicle-status-card-body-row-left">作业模式</span>
                  <span class="vehicle-status-card-body-row-right">
                      ${vehicleInfo.operationMode || '未知模式'}
                  </span>
              </div>
              <div class="vehicle-status-card-body-row">
                  <span class="vehicle-status-card-body-row-left">当前车速</span>
                  <span class="vehicle-status-card-body-row-right">
                      ${vehicleInfo.speed || 0} km/h
                  </span>
              </div>
              <div class="vehicle-status-card-body-row">
                  <span class="vehicle-status-card-body-row-left">作业箱号</span>
                  <span class="vehicle-status-card-body-row-right">
                      ${vehicleInfo.containerNo || '未知'}
                  </span>
              </div>
              <div class="vehicle-status-card-body-row">
                  <span class="vehicle-status-card-body-row-left">当前位置</span>
                  <span class="vehicle-status-card-body-row-right">
                      ${vehicleInfo.longitude || 0}, ${vehicleInfo.latitude || 0}
                  </span>
              </div>
              <div class="vehicle-status-card-body-row">
                  <span class="vehicle-status-card-body-row-left">定位时间</span>
                  <span class="vehicle-status-card-body-row-right">
                       ${vehicleInfo.timestamp || '未定位'}
                  </span>
              </div>
            </div>
          </div>
          <img class="footer-xsj" src="${icon_sj}"/>
        </div>
        `;

      markerLableTop.setLabel({
        content: infoWindowContent,
        direction: 'center-bottom', //设置文本标注方位
      });


      document.getElementById('img-close-' + deviceNum).onclick = function () {
        showStatusLable = !showStatusLable;
        showMarkerLable(markerLable, markerLableTop);
      };

      document.getElementById('img-close-' + deviceNum).ontouchstart = function () {
        showStatusLable = !showStatusLable;
        showMarkerLable(markerLable, markerLableTop);
      };
    } else {
      markerLableTop.hide();
      markerLable.show();
      const content = `
        <div class="vehicle-marker-label-panel">
          <span>${vehicleInfo.deviceNum}</span>
          <img src="${icon_sj}" />
        </div>
        `;
      markerLable.setLabel({
        content: content,
        direction: 'center-bottom', //设置文本标注方位
        zIndex: 23,
      });
      markerLable.zIndex = 23;
    }
  };

  useEffect(() => {
    const marker = new AMap.Marker({
      ...markerProps,
      offset: new AMap.Pixel(0, 0),
      icon: new AMap.Icon(markerProps?.icon),
      autoRotation: true,
      angle: 0,
      zIndex: 20,
    });

    const markerLable = new AMap.Marker({
      icon: new AMap.Icon(icon_sj),
      size: AMap.Size(1, 1),
      offset: new AMap.Pixel(0, -23),
      zIndex: 21,
      anchor: 'center',
    });

    const markerLableTop = new AMap.Marker({
      icon: new AMap.Icon(icon_sj),
      size: AMap.Size(1, 1),
      offset: new AMap.Pixel(0, -23),
      zIndex: 100,
      anchor: 'center',
    });

    showStatusLable = false;
    showMarkerLable(markerLable, markerLableTop);

    marker.on('click', (e) => {
      showStatusLable = !showStatusLable;
      showMarkerLable(markerLable, markerLableTop);
    });

    map.add(marker);
    map.add(markerLable);
    map.add(markerLableTop);

    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_VEHICLES_ALL,
      callback: (data) => {
        const vehicle = data?.find((v) => v.deviceNum === deviceNum);
        if (vehicle) {
          updateData(vehicle);
        }
      },
    });

    const subEvent = EventBus.subscribe({
      type: EventTypeConfig.ACTION_MAP_Dax,
      callback: ({ action, value }) => {
        if (action === 'vehicle_click') {
          if (value && value.deviceNum === deviceNum) {
            if (!value.position) {
              return;
            }

            value.position && map.setZoomAndCenter(16, value.position, 2000);

            showStatusLable = !showStatusLable;
            showMarkerLable(markerLable, markerLableTop);
          }
        }
      },
    });

    const animationId = startAnimation(map, marker, markerLable, markerLableTop);

    return () => {
      marker.off('click');
      map.remove(marker);
      map.remove(markerLable);
      map.remove(markerLableTop);
      map.clearInfoWindow();
      subData.unsubscribe();
      subEvent.unsubscribe();
      stopAnimation(animationId);
    };
  }, [props]);

  return null;
}

export default VehicleMarker;
