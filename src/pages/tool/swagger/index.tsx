import React, { useEffect } from 'react';
import { getSwaggerUrl } from '@/utils/RequestUrl';

/**
 *
 * @author whiteshader@163.com
 *
 * */

const CacheInfo: React.FC = () => {
  useEffect(() => {
    const frame = document.getElementById('bdIframe');
    if (frame) {
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      frame.style.width = `${Number(deviceWidth) - 220}px`;
      frame.style.height = `${Number(deviceHeight) - 120}px`;
    }
  });

  return (
    <div style={{ marginTop: '38px' }}>
      <iframe
        style={{ width: '100%', border: '0px', height: '100%' }}
        // frameborder={'0'}
        scrolling="yes"
        src={getSwaggerUrl()}
        id="bdIframe"
      />
    </div>
  );
};

export default CacheInfo;
