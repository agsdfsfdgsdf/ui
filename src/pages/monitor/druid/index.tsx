import { getDruidUrl } from '@/utils/RequestUrl';
import React, { useEffect } from 'react';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

const DruidInfo: React.FC = () => {
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
    <iframe
      style={{ width: '100%', border: '0px', height: '100%', paddingTop: 50 }}
      scrolling="yes"
      src={getDruidUrl()}
      id="bdIframe"
    />
  );
};

export default DruidInfo;
