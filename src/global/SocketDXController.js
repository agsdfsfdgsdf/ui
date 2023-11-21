import WebSocketTask from './socket/WebSocketTask';
import {getAccessToken} from "@/access";

let webSocketTask;
let webSocketTaskURLCache;
const SocketDXController = {
  init: (webSocketTaskURL, callback) => {
    if(!webSocketTask) {
      webSocketTask = WebSocketTask.init(webSocketTaskURL, [getAccessToken()], (connect) => {
        if(connect) {
          webSocketTaskURLCache = webSocketTaskURL;
          if(callback) {
            callback(1, connect);
          }
        } else {
          if(webSocketTask) {
            console.log('close  1');
            webSocketTask.close();
          }
          webSocketTask = undefined;
        }
      });
    }
  },

  sendTaskMessage: (msg) => {
    if(!webSocketTask && webSocketTaskURLCache) {
      SocketDXController.init(webSocketTaskURLCache, undefined);
    }
    try{
      if(webSocketTask) {
        webSocketTask.send(JSON.stringify(msg));
      } else {
        console.error('未初始化，消息发送失败!');
      }
    }catch (e){
      console.error('消息发送错误!',e);
    }
  },

  uninit: () => {
    if(webSocketTask){
      console.log('close  2');
      webSocketTask.close();
    }
    webSocketTask = undefined;
  },
};
export default SocketDXController;
