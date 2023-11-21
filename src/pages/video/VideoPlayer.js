/*
 * @Author: cuixb
 * @Date: 2023-08-23 14:27:30
 * @LastEditors: cuixb
 * @LastEditTime: 2023-08-23 15:02:46
 * @Description: 请填写简介
 */
import React,{useState} from 'react';

// 从控件的路径引用它，这里默认它和页面在同一目录下
import VideoJS from './VideoJS';
import flvjs from 'flv.js';

const carCodeToVideoArrMap={
	T906:[
		{
			playRtmp:"ws://192.168.150.1:88",
			type: 'video/mp4',
			name:"上"
		},
		{
			playRtmp:"https://devcdn.ybaobx.com/tianji/resources/upload/material/config/05a2e03e-be1b-47ba-8b91-a8aa2d2ecf28_1667272384198.mp4",
			name:"下",
			type: 'video/mp4'
		},
		{
			playRtmp:"rtmp://192.168.150.132:1935/hik01/flv",
			name:"左"
		},
		{
			playRtmp:"rtmp://10.5.68.60",
			name:"右"
		},
		{
			playRtmp:"rtmp://10.5.68.61",
			name:"室内"
		},
		{
			playRtmp:"rtmp://10.5.68.61",
			name:"室外"
		}
	],
	T908:[
		{
			playRtmp:"http://mobliestream.c3tv.com:554/live/goodtv.sdp/index.m3u8",
			name:"上"
		},
		{
			playRtmp:"rtmp://10.5.68.90",
			name:"下"
		},
		{
			playRtmp:"rtmp://10.5.68.91",
			name:"左"
		},
		{
			playRtmp:"rtmp://10.5.68.92",
			name:"右"
		},
		{
			playRtmp:"rtmp://10.5.68.93",
			name:"室内"
		},
		{
			playRtmp:"rtmp://10.5.68.94",
			name:"室外"
		}
	]
  }

const CarVideoPlayer = (props) =>{
  const {carCode} = props
	

	// 播放器实例化完成后的事件动作，注意！不是视频加载成功
	const handlePlayerReady = (player) => {
		playerRef.current = player;
		// 播放器的子事件在这里定义
		player.on("canplaythrough", () => {
	        console.log("视频加载完成！")
        });
        player.on("error", () => {
          console.log(`视频文件加载失败，请稍后重试！`);
      });
      
      player.on("stalled", () => {
          console.log(`网络异常，请稍后重试！`);
      });
  };
  
  // 需要渲染的视频
  const videoInfoArr = carCodeToVideoArrMap[carCode]
  return (
    <React.Fragment>
      <div>Rest of app here</div>
	  {
      videoInfoArr?.map((item, index) =>
          <li key={index}>
              <p>{item.name}</p>
              <VideoJS index={index} url={item.playRtmp} type={item.type} />
          </li>
      )
	  }
    <div>Rest of app here</div>
    </React.Fragment>
  );
}

// 页面展示
const App = () => {
    const [curCarCode,setCurCarCode] =useState(0)
    const playerRef = React.useRef(null);
    const handleChange = (event) => {
      setCurCarCode(event.target.value); // 当选项改变时更新所选选项的状态
      };
	
	  return (
		<React.Fragment>
      <select value={curCarCode} onChange={handleChange}>
        <option value="">请选择车辆</option> {/* 设置一个默认选项 */}
        <option value="T906">T906</option>
        <option value="T908">T908</option>
      </select>
      <CarVideoPlayer carCode={curCarCode}/>
    </React.Fragment>
    );
  }

export default App;