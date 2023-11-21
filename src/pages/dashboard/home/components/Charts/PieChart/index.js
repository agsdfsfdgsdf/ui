import React from 'react';
import * as echarts from 'echarts';
import styles from './index.less';

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionData: props.optionData,
    };

    this.refChartDom = React.createRef();
  }

  update(optionData) {
    this.setState({
      optionData: optionData,
    });
  }

  componentDidMount() {
    this.myChart = echarts.init(this.refChartDom.current);

    let myChart = this.myChart;

    window.addEventListener('resize', function () {
      myChart && myChart.resize();
    });

    this.setChartOption();
  }

  componentDidUpdate() {
    this.setChartOption();
  }

  setChartOption() {
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{d}%\n{b}',
      },
      //图例组件
      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: [20, 20, 10, 20],
        selectedMode: true,
        icon: 'circle',
        align: 'right',
      },
      title: {
        text: '燃油车\n100',
        textStyle: {
          fontSize: 13,
          fontWeight: 'normal',
        },
        x: 'center',
        y: 'center',
      },
      //全局颜色样式
      color: ['#25C173', '#3892F1', '#EE4A20', '#166AC1', '#68A4E2', '#68A4E2'],
      series: [
        {
          name: '告警统计',
          type: 'pie',
          radius: ['40%', '52%'], //圆环大小
          center: ['50%', '50%'], //图表的位置
          avoidLabelOverlap: false, //是否启用防止标签重叠策略
          hoverAnimation: false, //动画效果
          label: {
            formatter: '{d}%', // 显示百分比，
          },
          // 指示折现
          labelLine: {
            normal: {
              show: true,
              legend: 8, //第一条折现
              legend2: 15, //第二条折现
              lineStyle: {
                color: '#166AC1', //折现颜色
              },
            },
          },
          data: [
            { value: this.state.optionData.normal, name: '正常' },
            { value: this.state.optionData.commonly, name: '一般' },
            { value: this.state.optionData.serious, name: '告警' },
          ],
        },
      ],
    };
    this.myChart.setOption(option);
  }

  render() {
    return <div ref={this.refChartDom} className={styles.pieContainer}></div>;
  }
}

export default PieChart;
