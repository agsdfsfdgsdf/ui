import { useEffect } from 'react';
import { message } from 'antd';
import { DataBus, EventBus } from 'data-dispatch';
import './vehicle-marker.css';
import { useMap, useSDK } from './util';
import { DataTypeConfig, EventTypeConfig } from '@/global/DataEventConfig';
import { formatDate } from '@/utils/DateUtils';
import TaskBiz from '@/global/TaskBiz';
import icon_sj from './assets/images/icon_sj.png';
import icon_dch from './assets/images/icon_dch.png';
import icon_close from './assets/images/icon_close.png';
import SocketController from '@/global/SocketController';

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
      if (t >= dt) {
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

  const { id, vin, name } = data;
  const markerProps = props.marker;

  const startAnimation = (map, marker, markerLable, markerLableTop) => {
    let timeRefresh = 0;
    return setInterval(() => {
      if (marker) {
        const position = vehicleProperty.getPosition();

        if (position && position.length === 2) {
          marker.show();
          marker.setPosition(position);
          if (markerLable) {
            markerLable.setPosition(position);
          }
          if (markerLableTop) {
            markerLableTop.setPosition(position);
            const timeSpan = document.getElementById('time_' + vin);
            if (timeSpan) {
              const { time } = vehicleProperty.getVehicleInfo();
              if (time) {
                timeSpan.innerText = formatDate(time);
              }
            }

            const statusSpan = document.getElementById('status_' + vin);
            if (statusSpan) {
              const { taskStatus, statusClass } = getTaskStatus(vin);
              if (taskStatus && statusClass) {
                statusSpan.className = statusClass;
                statusSpan.innerText = taskStatus;
              }
            }
          }

          marker.setAngle(vehicleProperty.getHeading() - 90);
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

  const sendMessage = (record, command) => {
    SocketController.sendTaskMessage({
      type: 3010,
      data: {
        vin: record.vin,
        taskId: record.taskId,
        command: command,
        time: Date.now(),
      },
    });
    message.info((command === 0 ? '“停车”' : '“启动”') + '指令下发成功！');
  };

  const getTaskStatus = (vin) => {
    const taskStatus = TaskBiz.getTaskStatus(vin);

    let statusClass;
    if (taskStatus === TaskBiz.STATUS.STATUS_RUNNING) {
      statusClass = 'status-running';
    } else if (taskStatus === TaskBiz.STATUS.STATUS_PARKING) {
      statusClass = 'status-parking';
    } else if (taskStatus === TaskBiz.STATUS.STATUS_WAITING) {
      statusClass = 'status-waiting';
    } else {
      statusClass = 'status-free';
    }

    return { taskStatus, statusClass };
  };

  const showMarkerLable = (markerLable, markerLableTop) => {
    const vehicleInfo = vehicleProperty.getVehicleInfo();

    if (!vehicleInfo) return;

    const { vehicleStatus, status, taskId, speed, stationName, time } = vehicleInfo;

    if (!vehicleStatus || vehicleStatus === 0) {
      markerLable.hide();
      markerLableTop.hide();
      return;
    }

    const position = vehicleProperty.getPosition();
    if (showStatusLable) {
      markerLable.hide();
      const { taskStatus, statusClass } = getTaskStatus(vin);

      var infoWindowContent =
        '<div class="vehicle-status-card">' +
        '<div class="vehicle-status-card-info" >' +
        '<div class="vehicle-status-card-head">' +
        '<div class="vehicle-status-card-head-left">' +
        vehicleInfo.name +
        '</div>' +
        '<div class="vehicle-status-card-head-right">' +
        '<img id="img-close-' +
        vin +
        '" class="img-close" src="' +
        icon_close +
        '" />' +
        '<span>100%</span>' +
        '<img class="img-dch" src="' +
        icon_dch +
        '"/>' +
        '</div>' +
        '</div>' +
        '<div class="vehicle-status-card-body">' +
        '<div class="vehicle-status-card-body-row">' +
        '<span class="vehicle-status-card-body-row-left">车辆状态</span>' +
        '<span class="vehicle-status-card-body-row-right">' +
        (vehicleStatus ? TaskBiz.getVehicleStatus(vin) : '-') +
        '</span>' +
        '</div>' +
        '<div class="vehicle-status-card-body-row">' +
        '<span class="vehicle-status-card-body-row-left">工作状态</span>' +
        '<div class="vehicle-status-card-body-row-right">' +
        '<span class="' +
        statusClass +
        '">' +
        taskStatus +
        '</span>' +
        '</div>' +
        '</div>' +
        '<div class="vehicle-status-card-body-row">' +
        '<span class="vehicle-status-card-body-row-left">当前车速</span>' +
        '<span class="vehicle-status-card-body-row-right">' +
        (speed ? speed : '-') +
        'km/h </span>' +
        '</div>' +
        '<div class="vehicle-status-card-body-row">' +
        '<span class="vehicle-status-card-body-row-left">目的地</span>' +
        '<span class="vehicle-status-card-body-row-right">' +
        (stationName ? stationName : '-') +
        '</span>' +
        '</div>' +
        '<div class="vehicle-status-card-body-row">' +
        '<span class="vehicle-status-card-body-row-left">当前位置</span>' +
        '<span class="vehicle-status-card-body-row-right">[' +
        (position && position[0] ? Number.parseFloat(position[0]).toFixed(6) : '未知') +
        ',' +
        (position && position[1] ? Number.parseFloat(position[1]).toFixed(6) : '未知') +
        ']</span>' +
        '</div>' +
        '<div class="vehicle-status-card-body-row">' +
        '<span class="vehicle-status-card-body-row-left">定位时间</span>' +
        '<span class="vehicle-status-card-body-row-right"  id="time_' +
        vin +
        '">' +
        (time ? formatDate(time) : '-') +
        '</span>' +
        '</div>' +
        '</div>' +
        '<div class="vehicle-status-card-footer">' +
        '<button id="start_' +
        vin +
        '" class="footer-button" >启动</button>' +
        '<button id="stop_' +
        vin +
        '" class="footer-button" >停车</button>' +
        '</div>' +
        '</div>' +
        '<img class="footer-xsj" src="' +
        icon_sj +
        '"/>';
      ('</div>');

      markerLableTop.setLabel({
        content: infoWindowContent,
        direction: 'center-bottom', //设置文本标注方位
      });
      markerLableTop.show();

      document.getElementById('img-close-' + vin).onclick = function () {
        showStatusLable = !showStatusLable;
        showMarkerLable(markerLable, markerLableTop);
      };

      document.getElementById('img-close-' + vin).ontouchstart = function () {
        showStatusLable = !showStatusLable;
        showMarkerLable(markerLable, markerLableTop);
      };

      let buttonStart = document.getElementById('start_' + vin);
      let buttonPark = document.getElementById('stop_' + vin);
      if (status === 1) {
        buttonStart.disabled = true;
        buttonPark.disabled = false;
      } else if (status === 2) {
        buttonPark.disabled = true;
        buttonStart.disabled = false;
      } else {
        buttonStart.disabled = true;
        buttonPark.disabled = true;
      }
      buttonStart.onclick = function (event) {
        sendMessage({ vin: vin, taskId: taskId }, 1);
      };

      buttonStart.ontouchstart = function (event) {
        sendMessage({ vin: vin, taskId: taskId }, 1);
      };

      buttonPark.onclick = function (event) {
        sendMessage({ vin: vin, taskId: taskId }, 0);
      };

      buttonPark.ontouchstart = function (event) {
        sendMessage({ vin: vin, taskId: taskId }, 0);
      };
    } else {
      markerLableTop.hide();
      const content =
        '<div class="vehicle-marker-label-panel">' +
        '<span>' +
        vehicleInfo.name +
        '</span>' +
        '<img src="' +
        icon_sj +
        '"/>' +
        '</div>';
      markerLable.setLabel({
        content: content,
        direction: 'center-bottom', //设置文本标注方位
        zIndex: 23,
      });
      markerLable.zIndex = 23;
      markerLable.show();
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

    const vehicleInfo = vehicleProperty.getVehicleInfo();

    const markerLable = new AMap.Marker({
      icon: new AMap.Icon(icon_sj),
      size: AMap.Size(1, 1),
      offset: new AMap.Pixel(0, -15),
      zIndex: 21,
    });

    const markerLableTop = new AMap.Marker({
      icon: new AMap.Icon(icon_sj),
      size: AMap.Size(1, 1),
      offset: new AMap.Pixel(0, -15),
      zIndex: 100,
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
      type: DataTypeConfig.ACTION_VEHICLE,
      callback: (data) => {
        const vehicle = data?.find((v) => v.vin === vin);
        if (vehicle) {
          updateData(vehicle);
        }
      },
    });

    const subEvent = EventBus.subscribe({
      type: EventTypeConfig.ACTION_MAP,
      callback: ({ action, value }) => {
        if (action === 'vehicle_click') {
          if (value && value.vin === vin) {
            if (value.vehicleStatus === 0) {
              message.info('该车辆未上线！');
              return;
            }
            if (!value.position) {
              //message.info("未收到车辆信息上报！");
              return;
            }

            value.position && map.setZoomAndCenter(18, value.position, 2000);

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
