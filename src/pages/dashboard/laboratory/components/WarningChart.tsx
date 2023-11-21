import React, { useEffect, useState } from 'react';
import { Bar } from '@ant-design/plots';
import { MonitoringHomeBiz } from '@/global/MonitoringBiz';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { DataBus } from 'data-dispatch';

const getData = (debug: any) => {
  const data: any[] = [];
  for (const key in debug) {
    data.push({
      type: key,
      sales: debug[key],
    });
  }
  return data;
};

const WarningChart: React.FC = () => {
  const homeData = MonitoringHomeBiz.getHomeData();
  const warnCount = homeData && homeData.warnCount ? homeData.warnCount : {};

  const [data, setData] = useState(warnCount);

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_HOME,
      callback: (value) => {
        if (value) {
          if (value.warnCount) {
            setData(value.warnCount);
          }
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  }, [setData]);

  const dataChart = getData(data);

  console.log('Gunson', '------', dataChart);

  const config = {
    padding: [20, 50, 20, 50],
    data: dataChart,
    xField: 'sales',
    yField: 'type',
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '告警次数',
      },
    },
    maxBarWidth: 10,
  };
  return <Bar {...config} />;
};
export default WarningChart;
