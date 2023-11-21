import { HomeDxData } from '@/global/base/HomeDxData';
import { VehicleData } from '@/global/base/VehicleData';
import SocketDXController from '@/global/SocketDXController';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';

let homeData: HomeDxData = {};
let refreshTimer: any = undefined;

const MonitoringHomeBiz = {
  startRefresh: () => {
    if (!refreshTimer) {
      refreshTimer = setInterval(() => {
        SocketDXController.sendTaskMessage({
          method: 'home',
        });
      }, 10000);
      SocketDXController.sendTaskMessage({
        method: 'home',
      });
    }
  },
  stopRefresh: () => {
    clearInterval(refreshTimer);
    refreshTimer = undefined;
  },
  updateHomeData: (data: any) => {
    homeData = {
      mileage: {
        count: data?.info?.allMileage,
        newAdd: data?.info?.compareMileage,
      },
      box: {
        count: data?.info?.containerCount,
        time: data?.info?.time,
      },
      runTime: {
        count: data?.info?.runTime,
        newAdd: data?.info?.compareTime,
      },
      avgSpeed: data?.info?.avgSpeed,
      weekWorks: data?.weekWorks,
      vehicleInfo: data?.vehicle,
      positionInfo: data?.position,
      warnCount: data?.warnCount,
    };
    DataBus.push({
      type: DataTypeConfig.ACTION_DaX_HOME,
      data: homeData,
    });
  },
  getHomeData: () => {
    return homeData;
  },
};

let vehicleAllData: VehicleData[] = [];
let preVehicleList: VehicleData[] = [];
// let checkVehicle: VehicleData;
const MonitoringVehicleBiz = {
  loadVehicleList: (vehicles) => {
    const vdata: VehicleData[] = [...vehicleAllData];
    vehicles.forEach((vehicle) => {
      const filterList = vdata.filter((data) => data.deviceNum === vehicle.deviceNum);
      if(!filterList || filterList.length === 0) {
        vdata.push({ ...vehicle, position: [vehicle.longitude ? vehicle.longitude : 116, vehicle.latitude ? vehicle.latitude : 39], heading: 0});
      }
    });
    vehicleAllData = [...vdata];

    preVehicleList = vehicles.map((vehicle) => {
      const filterList = vehicleAllData.filter((data) => data.deviceNum === vehicle.deviceNum);
      if (filterList && filterList.length > 0) {
        return filterList[0];
      }
      return vehicle;
    });

    DataBus.push({
      type: DataTypeConfig.ACTION_DaX_VEHICLES_ALL,
      data: vehicleAllData
    });
    return preVehicleList;
  },
  getVehicleList: () => {
    preVehicleList = preVehicleList.map((vehicle) => {
      const filterList = vehicleAllData.filter((data) => data.deviceNum === vehicle.deviceNum);
      if (filterList && filterList.length > 0) {
        return filterList[0];
      }
      return vehicle;
    });
    return preVehicleList;
  },
  getVehicleListAll: () => {
    return vehicleAllData;
  },
  setCheckVehicle: (vehicle) => {
    //checkVehicle = vehicle;
  },
  updateVehicleData: (data: any) => {
    if (data && data.length > 0) {
      //如果维护列表中没有数据，将数据加入维护列表
      const vdata: VehicleData[] = [...vehicleAllData];
      data.forEach((vehicle) => {
        const filterList = vehicleAllData.filter((data1) => data1.deviceNum === vehicle.deviceNum);
        if(!filterList || filterList.length === 0) {
          vdata.push({ ...vehicle, position: [vehicle.longitude ? vehicle.longitude : 116, vehicle.latitude ? vehicle.latitude : 39], heading: 0});
        }
      });
      //维护列表数据更新
      vehicleAllData = vdata.map((vehicle) => {
        const vsData = data.filter((vData) => vData.deviceNum === vehicle.deviceNum);
        if(vsData && vsData.length > 0) {
          return {...vehicle, ...vsData[0], position: [vehicle.longitude ? vehicle.longitude : 116, vehicle.latitude ? vehicle.latitude : 39], heading: 0};
        }
        return vehicle;
      });

      DataBus.push({
        type: DataTypeConfig.ACTION_DaX_VEHICLES_ALL,
        data: vehicleAllData
      });

      DataBus.push({
        type: DataTypeConfig.ACTION_DaX_VEHICLES,
        data: MonitoringVehicleBiz.getVehicleList()
      });
    }
    // if(checkVehicle) {
    //   //选中车辆数据的更新
    //   const filterVehicles = vehicleAllData.filter((vehicle) => vehicle.deviceNum === checkVehicle.deviceNum);
    //   if(filterVehicles && filterVehicles.length > 0) {
    //     checkVehicle = filterVehicles[0];
    //   }
    //   DataBus.push({
    //     type: DataTypeConfig.ACTION_DaX_VEHICLE_CHECKED,
    //     data: checkVehicle
    //   });
    // }
  },

};

export { MonitoringHomeBiz, MonitoringVehicleBiz };
