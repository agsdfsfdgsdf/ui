import React, { useState, useEffect } from 'react';
import Reflv from './reflv';

export default function Demo() {
  return(
     //<Reflv url='ws://192.168.150.1:88' type='flv'></Reflv>
     <Reflv url='http://192.168.150.143:8081/hik01/flv?port=1935&app=hik01&stream=flv' type='flv'></Reflv>
  )
}