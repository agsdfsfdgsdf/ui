import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '../DataEventConfig';
import TaskBiz from '../TaskBiz';
import {MonitoringHomeBiz, MonitoringVehicleBiz} from '@/global/MonitoringBiz';

function openWebSocket(webSocketURL, token, callback) {
  const websocket = new WebSocket(webSocketURL, token);
  websocket.onopen = () => {
    callback(true);
  };

  websocket.onmessage = (data) => {
    try {
      if (data && data.data && data.data.indexOf('websocket连接建立') !== -1) {
        console.info('链接建立成功！');
        return;
      }
      console.info(data.data);
      const data0 = JSON.parse(data.data);
      if (data0) {
        if (data0.type) {
          if (data0.type === 'location') {
            const loc = parsePositionBySocket(data0.data);
            TaskBiz.updateLocation(loc);
            DataBus.push({
              type: DataTypeConfig.ACTION_VEHICLE,
              data: TaskBiz.getTasks(),
            });
          } else if (data0.type === 'task_status') {
            DataBus.push({
              type: DataTypeConfig.ACTION_TASK,
              data: data0.data,
            });
          }
        } else if (data0.method) {
          if (data0.method === 'home') {
            MonitoringHomeBiz.updateHomeData(data0.data);
          } else if (data0.method === 'location') {
            MonitoringVehicleBiz.updateVehicleData(data0.data);
          }
        }
      }
    } catch (e) {
      console.error(e, data.data);
    }
  };

  websocket.onclose = () => {
    callback(false);
  };

  websocket.onerror = () => {
    callback(false);
  };

  return websocket;
}

function parsePositionBySocket(vehicles) {
  return Array.from({ length: vehicles.length }, (v, index) => {
    return {
      vin: vehicles[index].vin,
      name: vehicles[index].plateNumber,
      position:
        vehicles[index].longitude && vehicles[index].latitude
          ? [vehicles[index].longitude, vehicles[index].latitude]
          : undefined,
      heading: vehicles[index].heading,
      speed: Number.parseFloat(vehicles[index].speed).toFixed(1),
      time: vehicles[index].time,
      vehicleStatus: vehicles[index].status,
    };
  });
}

const WebSocketTask = {
  init: (webSocketURL, token, callback) => openWebSocket(webSocketURL, token, callback),
};

export default WebSocketTask;
