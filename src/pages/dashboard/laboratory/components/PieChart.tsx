import { Pie } from '@ant-design/plots';
import { MonitoringHomeBiz } from '@/global/MonitoringBiz';
import { useEffect, useState } from 'react';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { DataBus } from 'data-dispatch';

const PieChart = () => {
  const homeData = MonitoringHomeBiz.getHomeData();

  const vehicleInfo = [
    {
      type: '在线车辆',
      value: homeData?.vehicleInfo?.vehicleOnline ? homeData?.vehicleInfo?.vehicleOnline : 0,
    },
    {
      type: '离线车辆',
      value: homeData?.vehicleInfo?.vehicleOffline ? homeData?.vehicleInfo?.vehicleOffline : 0,
    },
  ];

  const [data, setData] = useState<any[]>(vehicleInfo);

  let count = 0;
  data.forEach((dataObj) => {
    count += dataObj.value;
  });

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_HOME,
      callback: (value) => {
        if (value) {
          if (value.vehicleInfo) {
            const vehicleInfo1 = [
              {
                type: '在线车辆',
                value: value?.vehicleInfo?.vehicleOnline ? value?.vehicleInfo?.vehicleOnline : 0,
              },
              {
                type: '离线车辆',
                value: value?.vehicleInfo?.vehicleOffline ? value?.vehicleInfo?.vehicleOffline : 0,
              },
            ];
            count = 0;
            data.forEach((dataObj) => {
              count += dataObj.value;
            });

            setData(vehicleInfo1);
          }
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  }, [setData]);

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    innerRadius: 0.8,
    label: {
      type: 'spider',
      content: '{name}:{value}',
      style: {
        textAlign: 'center',
        fontSize: 10,
      },
    },
    statistic: {
      title: {
        style: {
          overflow: 'hidden',
        },
        content: '总计',
      },
      content: {
        style: {
          overflow: 'hidden',
        },
        content: count + '',
      },
    },
  };
  return <Pie {...config} />;
};

export default PieChart;
