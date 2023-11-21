import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  const urls = [
    'rtmp://localhost:1935/live/room'
    //'rtmp://mobliestream.c3tv.com:554/live/goodtv.sdp'
    //'rtsp://example.com/stream3'
  ];

  return (
    <div>
      {urls.map((url, index) => (
        <ReactPlayer
          key={index}
          url={url}
          controls
          width='640px'
          height='360px'
        />
      ))}
    </div>
  );
};

export default VideoPlayer;