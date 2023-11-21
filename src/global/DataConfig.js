import { getConfig } from './service';
import SocketDXController from "@/global/SocketDXController";

let _config;

const DataConfig = {
  init: () => {
    return getConfig().then((config) => {
      _config = config;

      SocketDXController.init(config.webSocketTaskURL, (index, connect) => {
        console.log('websocket', index, connect);
      });

      return config;
    });
  },

  getConfig: () => {
    return _config;
  },
};

export default DataConfig;
