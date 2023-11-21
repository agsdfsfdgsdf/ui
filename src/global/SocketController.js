import WebSocketTask from './socket/WebSocketTask';

let webSocketTask;
let webSocketTaskURLCache;
const SocketController = {
  init: (webSocketTaskURL, callback) => {
    if(!webSocketTask) {
      webSocketTask = WebSocketTask.init(webSocketTaskURL, [], (connect) => {
        if(connect) {
          webSocketTaskURLCache = webSocketTaskURL;
          if(callback){
            callback(1, connect);
          }
        } else {
          if(webSocketTask) {
            webSocketTask.close();
          }
          webSocketTask = null;
        }
      });
    }
  },
  sendTaskMessage: (msg) => {
    if(!webSocketTask && webSocketTaskURLCache) {
      SocketController.init(webSocketTaskURLCache, undefined)
    }
    try{
      if(webSocketTask) {
        webSocketTask.send(JSON.stringify(msg));
      }else{
        console.error('未初始化，消息发送失败!');
      }
    }catch (e){
      console.error('消息发送错误!',e);
    }
  },
  uninit: () => {
    if(webSocketTask) {
      webSocketTask.close();
    }
    webSocketTask = null;
  },
};
export default SocketController;
