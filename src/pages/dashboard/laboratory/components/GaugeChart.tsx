import { Gauge } from '@ant-design/plots';

export type GaugeParams = {
  keyD: string;
  value: number;
  title: string;
  tipLabel: string[];
  tipValue: number[];
  tipUnit: string[];
};

const GaugeChart = (props: GaugeParams) => {
  const { keyD, title, value, tipLabel, tipValue, tipUnit } = props;

  const config = {
    percent: value ? value : 0,
    type: 'meter',
    innerRadius: 0.9,
    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#F4664A', '#FAAD14', '#30BF78'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      title: {
        style: {
          color: '#657180',
        },
        formatter: () => {
          return title;
        },
      },
      content: {
        style: {
          fontSize: '18px',
          color: '#657180',
        },
        content: value * 100 + '%',
      },
    },
  };
  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 20px 0 30px',
      }}
    >
      <div style={{ flex: 3.6, height: '76%' }}>
        <Gauge {...config} />
      </div>
      <div
        style={{
          flex: 2,
          minWidth: 90,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '10px 0',
        }}
      >
        {tipLabel &&
          tipValue &&
          tipLabel.length === tipValue.length &&
          tipLabel.map((value1: string, index) => {
            return (
              <div key={keyD + '_' + index} style={{ display: 'inline-block', minWidth: 90 }}>
                <span
                  key={keyD + '1_' + index}
                  style={{ fontSize: 10, color: '#657180', display: 'inline-block' }}
                >
                  {value1}：
                </span>
                <span
                  key={keyD + '2_' + index}
                  style={{ fontSize: 16, color: '#657180', display: 'inline-block' }}
                >
                  {tipValue[index]}
                </span>
                <span
                  key={keyD + '3_' + index}
                  style={{ fontSize: 10,marginLeft: 6, color: '#657180', display: 'inline-block' }}
                >
                  {tipUnit[index]}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GaugeChart;
