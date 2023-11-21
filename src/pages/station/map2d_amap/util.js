import { createContext, useContext } from 'react';

const mapContext = createContext({});
const MapProvider = mapContext.Provider;

function useSDK() {
  return useContext(mapContext).sdk;
}

function useMap() {
  return useContext(mapContext).map;
}

export { MapProvider, useMap, useSDK };
