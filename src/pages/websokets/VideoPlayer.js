import React, { useEffect, useRef} from 'react';
import flvjs from './flv.js';

const VideoPlayer = ({ urls }) => {
  const videoRefs = useRef([]);

  useEffect(() => {
    const flvPlayers = urls?.map((url, index) => {
      const videoRef = videoRefs.current[index];
      if (flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: url,
        });
        flvPlayer.attachMediaElement(videoRef);
        flvPlayer.load();
        return flvPlayer;
      }
      return null;
    });

    return () => {
      flvPlayers?.forEach((flvPlayer) => {
        if (flvPlayer) {
          flvPlayer.destroy();
        }
      });
    };
  }, [urls]);

  return (
    <div>
      {urls?.map((url, index) => (
        <video key={index} ref={(el) => (videoRefs.current[index] = el)} controls />
      ))}
    </div>
  );
};

export default VideoPlayer;