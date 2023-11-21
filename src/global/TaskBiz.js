import { getTaskDetail } from '@/pages/station/allots/service';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from './DataEventConfig';

let _VehicleTask = [];

let routePoints = [];

const Status = {
  STATUS_ONLINE: '在线',
  STATUS_OFFLINE: '离线',
  STATUS_FREE: '空闲',
  STATUS_RUNNING: '进行中',
  STATUS_PARKING: '停车中',
  STATUS_WAITING: '等待接受',
};

const TaskBiz = {
  STATUS: Status,
  load: (vehicles, onResult) => {
    getTaskDetail().then((res) => {
      let _tasks;
      if (res && res.code === 200) {
        _tasks = res.data;
        let ves = [];
        vehicles &&
          vehicles.forEach((vehicle) => {
            const taskVehicle = _tasks?.find((task) => {
              return task.vin === vehicle.vin;
            });
            ves.push({ ...vehicle, ...taskVehicle });
          });
        _VehicleTask = ves;
      }
      if (onResult) {
        onResult(_VehicleTask);
      }
    });
  },

  reload: (onResult) => {
    getTaskDetail().then((res) => {
      let _tasks;
      if (res && res.code === 200) {
        _tasks = res.data;
        let ves = [];
        _VehicleTask.forEach((vehicle) => {
          vehicle.points = undefined;
          vehicle.locus = undefined;
          vehicle.taskId = undefined;
          vehicle.status = undefined;
          const taskVehicle = _tasks?.find((task) => {
            return task.vin === vehicle.vin;
          });
          ves.push({ ...vehicle, ...taskVehicle });
        });
        _VehicleTask = ves;
      }
      console.log('Gunson', 'getTaskDetail result', _VehicleTask);
      if (onResult) {
        onResult(_VehicleTask);
        DataBus.push({
          type: DataTypeConfig.ACTION_ROUTE,
          data: _VehicleTask,
        });
      }
    });
  },

  updateLocation: (vehicles) => {
    if (vehicles && vehicles.length > 0) {
      let newVehicles = [];
      _VehicleTask.forEach((vehicle) => {
        let locationVehicle = undefined;
        vehicles.forEach((vehicle0) => {
          if (vehicle0.vin === vehicle.vin) {
            locationVehicle = vehicle0;
          }
        });
        let vehicle1 = { ...vehicle, ...locationVehicle };
        newVehicles.push(vehicle1);
      });
      _VehicleTask = newVehicles;
    }
  },

  updateTaskStatus: (task) => {
    if (task && task.vin) {
      let newVehicles = [];
      _VehicleTask.forEach((vehicle) => {
        let locationVehicle = undefined;
        if (vehicle.vin === task.vin) {
          locationVehicle = vehicle;
        }
        if (locationVehicle) {
          locationVehicle.taskId = task.taskId;
          locationVehicle.status = task.status;
          newVehicles.push(locationVehicle);
        } else {
          newVehicles.push(vehicle);
        }
      });
      _VehicleTask = newVehicles;
    }
  },

  getTasks: () => {
    return _VehicleTask;
  },

  getTaskStatus: (vin) => {
    let cTask = undefined;
    _VehicleTask.forEach((vehicle) => {
      if (vehicle.vin === vin) {
        cTask = vehicle;
      }
    });
    if (cTask && cTask.vehicleStatus === 1) {
      if (cTask.status === -1) {
        return Status.STATUS_WAITING;
      } else if (cTask.status === 1) {
        return Status.STATUS_RUNNING;
      } else if (cTask.status === 2) {
        return Status.STATUS_PARKING;
      } else if (cTask.status === 3 || cTask.status === 4) {
        return Status.STATUS_FREE;
      }
      return Status.STATUS_FREE;
    } else {
      return Status.STATUS_OFFLINE;
    }
  },

  getVehicleStatus: (vin) => {
    let cTask = undefined;
    _VehicleTask.forEach((vehicle) => {
      if (vehicle.vin === vin) {
        cTask = vehicle;
      }
    });
    if (cTask && cTask.vehicleStatus) {
      if (cTask.vehicleStatus === 0) {
        return Status.STATUS_OFFLINE;
      } else if (cTask.vehicleStatus === 1) {
        return Status.STATUS_ONLINE;
      }
      return;
    } else {
      return Status.STATUS_OFFLINE;
    }
  },
};

export default TaskBiz;
