import { Pie } from '@ant-design/plots';
import { MonitoringHomeBiz } from '@/global/MonitoringBiz';
import { useEffect, useState } from 'react';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { DataBus } from 'data-dispatch';
const Pie2Chart = () => {
  const homeData = MonitoringHomeBiz.getHomeData();

  const positionInfo = [
    {
      type: '自动对位',
      value: homeData?.positionInfo?.automatic ? homeData?.positionInfo?.automatic : 0,
    },
    {
      type: '人工对位',
      value: homeData?.positionInfo?.manualCount ? homeData?.positionInfo?.manualCount : 0,
    },
  ];

  const [data, setData] = useState<any[]>(positionInfo);

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_HOME,
      callback: (value) => {
        if (value) {
          if (value.positionInfo) {
            const positionInfo1 = [
              {
                type: '自动对位',
                value: value?.positionInfo?.automatic ? value?.positionInfo?.automatic : 0,
              },
              {
                type: '人工对位',
                value: value?.positionInfo?.manualCount ? value?.positionInfo?.manualCount : 0,
              },
            ];
            setData(positionInfo1);
          }
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  }, [setData]);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{value}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default Pie2Chart;
