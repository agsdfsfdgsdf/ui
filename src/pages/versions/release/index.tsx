import type { FormInstance } from 'antd';
import { Modal } from 'antd';
import { Button, Select, Space, message } from 'antd';
import { Row, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, useRequest } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WrapContent from '@/components/WrapContent';
import Card from 'antd/es/card';
import { getTreeList as getDeptTreeList } from '../../system/dept/service';
import DeptTree from './components/DeptTree';
import type { DataNode } from 'antd/lib/tree';
import type { VehicleListParams, VehicleType } from '@/pages/cars/manager/data';
import { getVehicleList } from '@/pages/cars/manager/service';
import { getDict } from '@/pages/system/dict/service';
import type { SelectProps } from 'antd/es/select';
import { addVersionsRelease, getMaxVersion } from './service';
import type { MaxVersionType } from './data';
import { queryCurrentUserInfo } from '../upload/service';

const handleAddVersionRelease = async (fields: any) => {
  const hide = message.loading('正在发送升级');
  try {
    const resp = await addVersionsRelease(fields);
    hide();
    if (resp.code === 200) {
      message.success('升级发送成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('升级发送失败请重试！');
    return false;
  }
};

const ReleaseTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<VehicleType[]>([]);

  const [selectDept, setSelectDept] = useState<any>({ id: 0 });
  const [vehicleList, setVehicleList] = useState<VehicleType[]>([]);
  const [vehicleTypeOptions, setVehicleTypeOption] = useState<any>([]);
  const [vehicleStatusOptions, setVehicleStatusOptions] = useState<any>([]);
  const [vehicleProtocolOptions, setVehicleProtocolOptions] = useState<any>([]);
  const [deptTree, setDeptTree] = useState<DataNode[]>();
  const [maxVersions, setMaxVersions] = useState<MaxVersionType[]>([]);
  const [selectVersion, setSelectVersion] = useState<any>();

  const { data: userInfo } = useRequest(() => {
    return queryCurrentUserInfo();
  });

  useEffect(() => {
    setSelectDept({ id: 0 });

    getDict('vehicle_type').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setVehicleTypeOption(opts);
      }
    });
    getDict('vehicle_status').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setVehicleStatusOptions(opts);
      }
    });
    getDict('vehicle_protocol').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setVehicleProtocolOptions(opts);
      }
    });
    getDeptTreeList({ status: 0 }).then((treeData) => {
      setDeptTree(treeData);
    });

    getMaxVersion().then((res) => {
      if (res && res.code === 200) {
        setMaxVersions(res.data);
      }
    });
  }, []);

  let deptStr = '';
  function getDeptTitle(data: any, company: string) {
    data?.map((dept: any) => {
      if (dept.value === Number.parseInt(company)) {
        deptStr = dept.title;
      } else {
        getDeptTitle(dept.children, company);
      }
    });
  }

  const columns: ProColumns<VehicleType>[] = [
    {
      title: <FormattedMessage id="vehicle.list.vin" defaultMessage="车辆VIN" />,
      dataIndex: 'vin',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="vehicle.list.plateNumber" defaultMessage="车牌号" />,
      dataIndex: 'plateNumber',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="vehicle.list.company" defaultMessage="所属组织" />,
      dataIndex: 'company',
      valueType: 'text',
      render: (_, record) => {
        deptStr = '';
        getDeptTitle(deptTree, record.company);
        return <span>{deptStr}</span>;
      },
      hideInSearch: true,
    },
    // { //和左侧设计重复
    //   title: '所属组织',
    //   dataIndex: 'company',
    //   hideInTable: true,
    //   renderFormItem: (_, fieldConfig, form) => {
    //     if (fieldConfig.type === 'form') {
    //       return null;
    //     }
    //     const status = form.getFieldValue('state');
    //     if (status !== 'open') {
    //       return (
    //         // value 和 onchange 会通过 form 自动注入。
    //         <TreeSelect
    //           showSearch
    //           treeData={deptTree}
    //           treeDefaultExpandAll
    //           allowClear
    //           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    //           placeholder="请选择所属组织"
    //           treeNodeFilterProp="title"
    //         />
    //       );
    //     }
    //     return fieldConfig.defaultRender(_);
    //   },
    // },
    {
      title: <FormattedMessage id="vehicle.list.protocol" defaultMessage="协议类型" />,
      dataIndex: 'protocol',
      valueType: 'select',
      valueEnum: vehicleProtocolOptions,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="vehicle.list.vehicleType" defaultMessage="车辆类型" />,
      dataIndex: 'vehicleType',
      valueType: 'select',
      valueEnum: vehicleTypeOptions,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="vehicle.list.vehicleStatus" defaultMessage="车辆状态" />,
      dataIndex: 'vehicleStatus',
      valueType: 'select',
      valueEnum: vehicleStatusOptions,
      render: (_, record) => {
        return <span>{record.vehicleStatus}</span>;
      },
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="vehicle.list.createTime" defaultMessage="创建时间" />,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => <span>{record.createTime}</span>,
      search: {
        transform: (value) => {
          return {
            'params[beginTime]': value[0],
            'params[endTime]': value[1],
          };
        },
      },
      hideInSearch: true,
    },
  ];

  const maxVersionsOption: SelectProps['options'] =
    maxVersions &&
    maxVersions.map((element) => {
      return {
        label: (
          <>
            <div style={{ float: 'left' }}>{element.apply}</div>
            <div style={{ float: 'right' }}>{element.maxVersionCode}</div>
          </>
        ),
        value: element.dataType,
      };
    });

  const options: SelectProps['options'] =
    vehicleList &&
    vehicleList.map((element) => {
      return {
        label: element.vin,
        value: element.vin,
      };
    });

  const optionsSelect =
    selectedRowsState &&
    selectedRowsState.map((row) => {
      return row.vin;
    });
  console.log(optionsSelect);

  return (
    <WrapContent>
      <Row gutter={[16, 24]}>
        <Col lg={6} md={24}>
          <Card style={{ height: '100%', backgroundColor: '#FFF' }}>
            <DeptTree
              onSelect={async (value: any) => {
                setSelectDept(value);
                if (actionRef.current) {
                  formTableRef?.current?.submit();
                }
              }}
            />
          </Card>
        </Col>
        <Col lg={18} md={24}>
          <Card
            style={{ backgroundColor: '#FFF', marginBottom: 18, paddingTop: 14, paddingBottom: 14 }}
          >
            <Row>
              <Col span={6} style={{ paddingLeft: 20, paddingRight: 20 }}>
                <p>选择升级应用：</p>
                <Select
                  style={{ width: '100%' }}
                  options={maxVersionsOption}
                  onChange={(value) => {
                    setSelectVersion(
                      maxVersions.filter((maxItem) => maxItem.dataType === value)[0],
                    );
                  }}
                />
              </Col>
              <Col span={15} style={{ paddingLeft: 20, paddingRight: 20 }}>
                <p>选择升级车辆：</p>
                <Select
                  style={{ width: '90%' }}
                  mode="multiple"
                  options={options}
                  value={optionsSelect}
                  onChange={(value) => {
                    const vehicles: VehicleType[] = [];
                    vehicleList.forEach((v: VehicleType) => {
                      if (value.filter((vin) => vin === v.vin).length > 0) {
                        vehicles.push(v);
                      }
                    });
                    setSelectedRows(vehicles);
                  }}
                />
              </Col>
              <Col span={3}>
                <Space align="end" style={{ height: '100%' }}>
                  <p>&nbsp;</p>
                  <Button
                    onClick={() => {
                      if (!selectedRowsState || selectedRowsState.length === 0 || !selectVersion) {
                        message.error('请选择正确版本和车辆后重试！');
                        return;
                      }
                      Modal.confirm({
                        title: '升级确认',
                        content: '请确认是否给车辆完成升级？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: async () => {
                          const arrayData = selectedRowsState.map((row) => {
                            return {
                              vin: row.vin,
                              versionCode: selectVersion.maxVersionCode,
                              dataType: selectVersion.dataType,
                              publisher: userInfo?.user?.userName,
                              status: 1,
                            };
                          });
                          const success = await handleAddVersionRelease(arrayData);
                          if (success) {
                            actionRef.current?.reloadAndRest?.();
                          }
                        },
                      });
                    }}
                  >
                    升级
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
          <ProTable<VehicleType>
            headerTitle=""
            actionRef={actionRef}
            formRef={formTableRef}
            rowKey="vin"
            key="vehicleList"
            search={{
              labelWidth: 80,
            }}
            toolBarRender={false}
            request={(params) => {
              return getVehicleList({
                ...params,
                company: params.deptId ? params.deptId : selectDept.id,
              } as VehicleListParams).then((res) => {
                setVehicleList(res.rows);
                return {
                  data: res.rows,
                  total: res.total,
                  success: true,
                };
              });
            }}
            columns={columns}
            rowSelection={{
              selectedRowKeys: optionsSelect,
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </Col>
      </Row>
    </WrapContent>
  );
};

export default ReleaseTableList;
