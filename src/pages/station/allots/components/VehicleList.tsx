import { DataBus, EventBus } from 'data-dispatch';
import { DataTypeConfig, EventTypeConfig } from '@/global/DataEventConfig';
import TaskBiz from '@/global/TaskBiz';
import { getVehicleList } from '@/pages/cars/manager/service';
import { ReloadOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/DateUtils';
import type { FormInstance } from 'antd';
import { Col, Row, message, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import { useEffect, useRef, useState } from 'react';

import styles from '../index.less';
import { addTask } from '../service';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { VehicleListParams } from '@/pages/cars/manager/data';

const VehicleList = (props: any) => {
  const [vehicles, setVehicles] = useState(props.vehicles);
  const [selectVehicle, setSelectVehicle] = useState<any>(undefined);

  const formTableRef = useRef<FormInstance>();
  const searchRef = useRef<any>();

  useEffect(() => {
    const subEvent = EventBus.subscribe({
      type: EventTypeConfig.ACTION_MAP,
      callback: ({ action, value }: any) => {
        if (action === 'station_click') {
          if (value) {
            if (!selectVehicle) {
              message.warn('请先在车辆列表中选择下发车辆！');
            } else {
              const status = TaskBiz.getTaskStatus(selectVehicle.vin);
              if (status === TaskBiz.STATUS.STATUS_OFFLINE) {
                message.error('"' + selectVehicle.plateNumber + '"' + '车辆离线，无法下发任务！');
                return;
              }
              if (status === TaskBiz.STATUS.STATUS_WAITING) {
                message.error(
                  '"' +
                    selectVehicle.plateNumber +
                    '"' +
                    '车辆已有任务等待接受，请等待接受任务或中断任务后再下发新任务！',
                );
                return;
              }
              if (status === TaskBiz.STATUS.STATUS_RUNNING) {
                message.error(
                  '"' +
                    selectVehicle.plateNumber +
                    '"' +
                    '车辆任务进行中，请等待任务完成或中断任务后再下发新任务！',
                );
                return;
              }
              const r = confirm('确认给“' + selectVehicle.plateNumber + '”下发任务吗？');
              if (r == true) {
                console.log('Gunson', '站点下发', selectVehicle.vin, value);
                addTask({
                  vin: selectVehicle.vin,
                  id: value.id,
                }).then((res) => {
                  console.log('Gunson', '下发任务结果', res);
                  if (res && res.code === 200) {
                    message.info('任务下发成功，正在等待车端接受任务！');
                    if (res.data) {
                      TaskBiz.updateTaskStatus(res.data);
                      setVehicles(TaskBiz.getTasks());
                    }
                  } else {
                    message.info('任务下发失败！');
                  }
                });
              }
            }
          }
        }
      },
    });

    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_VEHICLE,
      callback: (data: any) => {
        if (data) {
          setVehicles(data);
        }
      },
    });

    return () => {
      subEvent.unsubscribe();
      subData.unsubscribe();
    };
  }, [props, selectVehicle]);

  const onChange = (e: any, record: any) => {
    setSelectVehicle(record);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '选择',
      dataIndex: 'vin',
      key: 'vin',
      width: 30,
      render: (record: any) => {
        return (
          <input
            type="radio"
            id={record.vin}
            name="vehicleRadio"
            value={record.vin}
            onChange={(e) => onChange(e, record)}
          />
        );
      },
      search: false,
    },
    {
      title: '车辆名称',
      key: 'plateNumber',
      render: (record: any) => {
        return (
          <div>
            <Row>
              <Col className={styles.carImage}>
                <div className={record.vehicleStatus === 1 ? styles.carIconBg : styles.carIconNoBg}>
                  <img className={styles.carIcon} src="/images/icon_car.png" />
                </div>
              </Col>
              <Col>
                <span>{record.plateNumber}</span>
                <br />
                <span className={styles.timeSpan}>
                  {record.time ? formatDate(record.time) : ''}
                </span>
              </Col>
            </Row>
          </div>
        );
      },
      search: false,
    },
    {
      title: '车辆名称',
      key: 'plateNumber',
      renderFormItem: () => {
        return (
          <Row
            gutter={24}
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >
            <Search
              key="search"
              style={{ width: 180 }}
              ref={searchRef}
              onSearch={() => {
                console.log('onSearch');
                formTableRef.current?.submit();
              }}
            />
            <ReloadOutlined
              key="reset"
              style={{ marginLeft: 20, marginRight: 20, color: '#2D8CF0' }}
              onClick={() => {
                formTableRef.current?.resetFields();
                formTableRef.current?.submit();
              }}
            />
          </Row>
        );
      },
      hideInTable: true,
    },
    {
      title: '状态',
      render: (record: any) => {
        const rStatus = TaskBiz.getTaskStatus(record.vin);
        let styleStatus = styles.labelStatusOffline;
        let title;
        if (rStatus === '离线') {
          styleStatus = styles.labelStatusOffline;
          title = '车辆离线！';
        } else if (rStatus === '空闲') {
          styleStatus = styles.labelStatusFree;
          title = '车辆没有可执行任务！';
        } else if (rStatus === '停车中') {
          styleStatus = styles.labelStatusParking;
          title = '停车';
        } else if (rStatus === '进行中') {
          styleStatus = styles.labelStatusRunning;
          title = '车辆正在任务中！';
        } else if (rStatus === '等待接受') {
          styleStatus = styles.labelStatusWaiting;
          title = '等待车辆接受任务！';
        }
        return (
          <div>
            <Tooltip title={title}>
              <span className={styleStatus}>{rStatus}</span>
            </Tooltip>
          </div>
        );
      },
      search: false,
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ProTable
        formRef={formTableRef}
        key="vehicleList"
        rowKey={(r) => `row${r.vin}`}
        onRow={(record, index: number | undefined): any => {
          if (index === undefined) return {};
          return {
            onClick: () => {
              if (selectVehicle && selectVehicle.vin === record.vin) {
                EventBus.dispatch({
                  type: EventTypeConfig.ACTION_MAP,
                  action: 'vehicle_click',
                  value: record,
                });
              }
              const vehicleRadio: any = document.getElementsByName('vehicleRadio')[index];
              vehicleRadio.checked = true;
              setSelectVehicle(record);
              return true;
            },
          };
        }}
        request={async (params) => {
          const msg = await getVehicleList({ ...params } as VehicleListParams).then((res) => {
            if (res && res.total > 0) {
              TaskBiz.load(res.rows, (vehicles1: any) => {
                return {
                  data: vehicles1,
                  total: vehicles1.length,
                  success: true,
                };
              });
            }
            return {
              data: res.rows,
              total: res.total,
              success: true,
            };
          });
          return {
            data: msg?.data,
            total: msg?.total,
            success: true,
          };
        }}
        dataSource={vehicles}
        columns={columns}
        toolBarRender={false}
        search={{
          optionRender: false,
          collapsed: false,
        }}
        pagination={{
          style: { marginBottom: 0 },
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default VehicleList;
