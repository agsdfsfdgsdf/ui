/*
 * @Author: cuixb
 * @Date: 2023-08-23 14:27:27
 * @LastEditors: cuixb
 * @LastEditTime: 2023-08-23 15:01:29
 * @Description: 请填写简介
 */
import React,{useState} from 'react';
import videojs from 'video.js';
// 记得引用css文件！
import 'video.js/dist/video-js.css';


export const VideoJS = (props) => {
  const {url,type, onReady} = props
   //定义全屏标识变量,初始为未开启全屏
  const [isFullScreen,setIsFullScreen] = useState(false)
  // video标签的引用Hook
  const videoRef = React.useRef(null);
  // 播放器实例的引用Hook
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    const videoJsOptions = {
      // 自动播放：为true时，加载完毕自动播放
      autoplay: true,
      // 播放器子控件是否显示：为true时显示暂停、播放速率等按钮
      controls: true,
      // 响应性：为true时，播放视频进度条会自动移动
      responsive: true,
      // 流式布局：为true时尽可能大得填满父标签的剩余空间
      fluid: true,
      // 视频源
      sources: [{
        // 视频文件的路径，可以是一个前端相对路径、后台视频文件URL、直播源等
        src: url,
        // 视频源类型
        type: type||'rtmp/flv'
      }] 
    };
    // 确保video.js的播放器实例player仅被初始化一次，否则会报错
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });
    // 当props发生变化时，可以对已经存在的player实例作一些操作，如：
    } else {
      const player = playerRef.current;

      player.autoplay(videoJsOptions.autoplay);
      player.src(videoJsOptions.sources);
    }
  }, [url, videoRef]);

  // 控件被unmount卸载的时候，记得要对player实例执行反初始化dispose
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  React.useEffect(()=>{
    const videoEle = videoRef.current;
    //监听fullscreen变化事件
    // videoEle.addEventListener("webkitfullscreenchange",function() {
    //   setIsFullScreen(videoEle.webkitIsFullScreen);
    //   },false
    // );
    const handleFullscreenChange =  function() {
      setIsFullScreen(videoEle.fullscreen)
      }
    videoEle.addEventListener("fullscreenchange",handleFullscreenChange);
    // videoEle.addEventListener("mozfullscreenchange",function() {
    //   setIsFullScreen(videoEle.mozFullScreen)
    //   },false
    // );
    return () => {
      videoEle.removeEventListener("fullscreenchange",handleFullscreenChange);
    }
  },[])

  //fullScreen点击事件函数
  const  requestFullScreen = () => {
    var videoEle = videoRef.current.requestFullscreen;
    const requestFullscreen = videoEle.requestFullscreen || videoEle.mozRequestFullScreen || videoEle.webkitRequestFullScreen
    requestFullscreen?.()
  };

  //exitFullscreen函数
  const exitFullscreen = () => {
      var videoEle = videoRef.current;
      const exitFullscreen = videoEle.exitFullscreen || videoEle.mozCancelFullScreen || videoEle.webkitCancelFullScreen
      exitFullscreen?.()
  };
  
  //全屏requestFullScreen函数
  const fullScreen = () => {
    if (!isFullScreen) {
      requestFullScreen();
    } else {
      exitFullscreen();
    }
  };

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
      <div className='title' > <button onClick={fullScreen}>{isFullScreen? '取消全屏':'全屏'}</button></div>
    </div>
  );
}

export default VideoJS;