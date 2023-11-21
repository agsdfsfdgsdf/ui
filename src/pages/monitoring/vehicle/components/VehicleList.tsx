import { getVehicleList } from '@/pages/cars/manager/service';
import { ReloadOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import {Button, Col, Row} from 'antd';
import Search from 'antd/lib/input/Search';
import {useEffect, useRef, useState} from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {MonitoringVehicleBiz} from "@/global/MonitoringBiz";
import {VehicleData} from "@/global/base/VehicleData";
import {DataBus, EventBus} from "data-dispatch";
import {DataTypeConfig, EventTypeConfig} from "@/global/DataEventConfig";
import SocketDXController from "@/global/SocketDXController";

const VehicleList = () => {

  const formTableRef = useRef<FormInstance>();
  const searchRef = useRef<any>();
  const [onLineCount, setOnLineCount] = useState<number>(0);
  const [offLineCount, setOffLineCount] = useState<number>(0);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subDataAll = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_VEHICLES_ALL,
      callback: (data) => {
        const online = data.filter((vehicle) => vehicle.tos === '登录');
        setOnLineCount(online.length);
        setOffLineCount(data.length - online.length);
      }
    });

    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DaX_VEHICLES,
      callback: (data) => {
        setVehicles(data);
      }
    });

    return () => {
      subData.unsubscribe();
      subDataAll.unsubscribe();
    }
  }, []);

  const columns: ProColumns<VehicleData>[] = [
    {
      title: '集卡号',
      key: 'deviceNum',
      align: 'center',
      render: (_, record: VehicleData) => {
        return record.deviceNum ? record.deviceNum : '-';
      },
      renderFormItem: () => {
        return (
          <Row
            gutter={24}
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >
            <Search
              key="search"
              style={{ width: 240 }}
              ref={searchRef}
              onSearch={() => {
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
    },
    {
      title: '作业模式',
      key: 'operationMode',
      search: false,
      align: 'center',
      render: (_, record: VehicleData) => {
        return record.operationMode ? record.operationMode : '-';
      }
    },
    {
      title: 'TOS',
      key: 'tos',
      search: false,
      align: 'center',
      render: (_, record: VehicleData) => {
        return record.tos ? record.tos : '-';
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record: VehicleData) => {
        if(record.tos){
          return (
            <Button type="link" disabled={record.tos !== '登录'} onClick={(e) => {
              SocketDXController.sendTaskMessage({"method": "offline","deviceNum": record.deviceNum});
              e.stopPropagation();
            }}>强制下线</Button>
          );
        }else{
          return '-';
        }
      },
      search: false,
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row align={'middle'} style={{marginBottom: 20}}>
        <Col span={8} style={{whiteSpace: 'nowrap'}}>
          <div style={{display: 'inline-block', width: 10, height: 10, marginRight: 4, backgroundColor: '#2D8CF0', borderRadius: 5}} />
          <span>车辆总数：{onLineCount + offLineCount}</span>
        </Col>
        <Col span={8}>
          <div style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
            <div style={{display: 'inline-block', width: 10, height: 10, marginRight: 4, backgroundColor: '#19BE6B', borderRadius: 5}} />
            <span>在线车辆：{onLineCount}</span>
          </div>
        </Col>
        <Col span={8}>
          <div style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
            <div style={{display: 'inline-block', width: 10, height: 10, marginRight: 4, backgroundColor: '#C5C8CE', borderRadius: 5}} />
            <span>离线车辆：{offLineCount}</span>
          </div>
        </Col>
      </Row>
      <ProTable
        formRef={formTableRef}
        key="vehicleList"
        loading={loading}
        rowKey={(r) => `row${r.deviceNum}`}
        onRow={(record, index: number | undefined): any => {
          if (index === undefined) return {};
          return {
            onClick: () => {
              EventBus.dispatch({
                type: EventTypeConfig.ACTION_MAP_Dax,
                action: 'vehicle_click',
                value: record,
              });
              MonitoringVehicleBiz.setCheckVehicle(record);
              return true;
            },
          };
        }}
        beforeSearchSubmit={(params) => {
          setLoading(true);
          getVehicleList(params).then((res) => {
            if (res && res.total > 0) {
              const vehicles1 = MonitoringVehicleBiz.loadVehicleList(res.rows);
              setVehicles(vehicles1);
              setTotal(res.total);
            } else {
              setVehicles([]);
              setTotal(0);
            }
            setLoading(false);
          });
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
          total: total,
          onChange: (page, pageSize) => {
            setLoading(true);
            getVehicleList({
              current: page + '',
              pageSize: pageSize + ''
            }).then((res) => {
              if (res && res.total > 0) {
                const vehicles1 = MonitoringVehicleBiz.loadVehicleList(res.rows);
                setVehicles(vehicles1);
                setTotal(res.total);
              } else {
                setVehicles([]);
                setTotal(0);
              }
              setLoading(false);
            });
          }
        }}
      />
    </div>
  );
};

export default VehicleList;
