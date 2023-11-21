import React, { useState, useEffect } from 'react';
import Reflv from './reflv';

export default function Demo() {
  return(
     <Reflv url='ws://192.168.150.1:88' type='flv'></Reflv>
  )
}