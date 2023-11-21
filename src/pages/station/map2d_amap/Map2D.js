import React, { useEffect, useState, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { MapProvider } from './util';
import './Map2D.css';
import { EventBus } from 'data-dispatch';

function Map2D(props) {
  const { amapKey, initialView, mapStyle } = props;
  const context = useRef({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    AMapLoader.load({
      key: amapKey,
      version: '2.0',
      plugins: [],
    })
      .then((AMap) => {
        context.current.sdk = AMap;
        context.current.map = new AMap.Map(`container-${props.id}`, {
          viewMode: '2D',
          mapStyle: mapStyle,
          ...initialView,
          layers: [new AMap.TileLayer.Satellite()],
        });
        setLoad(true);
      })
      .catch((e) => {
        console.log(e);
      });
    const subscription = EventBus.subscribe({
      type: 'map',
      callback: ({ action, value }) => {
        if (action === 'flyTo') {
          const { zoom, center } = value;
          context.current?.map?.setZoomAndCenter(zoom, center, false, 2000);
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [context, amapKey, initialView, mapStyle, props.id]);

  return (
    <div
      id={`container-${props.id}`}
      style={{
        padding: 0,
        margin: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {load && <MapProvider value={context.current}>{props.children}</MapProvider>}
    </div>
  );
}

export default Map2D;
