import { DualAxes } from '@ant-design/plots';
import { MonitoringHomeBiz } from '@/global/MonitoringBiz';
import { useEffect, useState } from 'react';
import { WeekWork } from '@/global/base/HomeDxData';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { DataBus } from 'data-dispatch';

const JobChart = () => {
  const homeData = MonitoringHomeBiz.getHomeData();
  const weekWorks = homeData && homeData.weekWorks ? homeData.weekWorks : [];
  const [data, setData] = useState<WeekWork[]>(weekWorks);

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_HOME,
      callback: (value) => {
        if (value) {
          if (value.weekWorks) {
            setData(value.weekWorks);
          }
        }
      },
    });

    return () => {
      subData.unsubscribe();
    };
  });

  return (
    <DualAxes
      padding={[24, 34, 10, 20]}
      data={[data, data]}
      xField={'date'}
      yField={['containerCount', 'efficiency']}
      meta={{
        containerCount: {
          alias: '箱量',
          formatter: (v) => {
            return v;
          },
        },
        efficiency: {
          alias: '效率',
          formatter: (v) => {
            return v;
          },
        },
      }}
      geometryOptions={[
        {
          geometry: 'column',
          color: 'l(90) 0:#6396F9 0.5:#75BDF6 1:#9CDBF7',
          columnWidthRatio: 0.1,
          isRange: true,
        },
        {
          geometry: 'line',
          color: '#F6BE19',
        },
      ]}
      xAxis={{
        label: {
          autoRotate: true,
          autoHide: false,
          autoEllipsis: false,
        },
        tickCount: data.length,
      }}
      yAxis={{
        containerCount: {
          label: {
            formatter: (v) => {
              return `${v}箱`;
            },
          },
        },
        efficiency: {
          label: {
            formatter: (v) => {
              return `${v}箱/小时`;
            },
          },
        },
      }}
      legend={{
        itemName: {
          formatter: (text, item) => {
            return item.value === 'containerCount' ? '箱量' : '效率';
          },
        },
      }}
    />
  );
};

export default JobChart;
