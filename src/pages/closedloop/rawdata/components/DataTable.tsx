import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import type { DataType, DataTypeParam, MarkingType } from '../data';
import { getRawDataList } from '../server';
import { FormattedMessage, useAccess, useIntl } from 'umi';
import styles from '../style.less';
import { Breadcrumb, Button, Checkbox, Table, message } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

export type DataTableProps = {
  weathers?: any;
  events?: any;
  times?: any;
  onRef?: any;
  onDownload: (data: DataType) => void;
  onDelete: (data: DataType) => void;
  onSelected: (datas: DataType[]) => void;
  onShowInfo: (data: DataType, allData: DataType[]) => void;
};

export type PageLoad = {
  current?: number;
  pageSize?: number;
  project?: string;
  startTime?: string;
  endTime?: string;
  vin?: string;
};

const DataTable = (props: DataTableProps) => {
  const [rawData, setRawData] = useState<DataType[]>([]);
  const [selectedRowsState, setSelectedRows] = useState<React.Key[]>([]);
  const [parentUrl, setParentUrl] = useState<string | null>(null);
  const [total, setTotal] = useState<number>();
  const [pageInfo, setPageInfo] = useState<PageLoad>({ current: 1, pageSize: 10 });
  const [labelParams, setLabelParams] = useState<MarkingType>({});

  const [parentProLoadData, setParentProLoadData] = useState<string | null | undefined>();

  const { weathers, events, times, onDownload, onDelete, onSelected, onShowInfo } = props;

  /** 国际化配置 */
  const intl = useIntl();
  const access = useAccess();

  const loadList = useCallback(
    (parent?: string | null) => {
      let parent1 = parent;
      if (parent1 && parent1.endsWith(':')) {
        parent1 += '/';
      }

      const pageInfo1 = { ...pageInfo };
      if (pageInfo1.current != 1 && parent !== parentProLoadData) {
        pageInfo1.current = 1;
        setPageInfo(pageInfo1);
      }

      setParentProLoadData(parent);

      const params =
        parent1 && parent1 !== '' && parent1 !== 'sourceRoot'
          ? ({ parent: parent1, ...pageInfo1 } as DataTypeParam)
          : ({ ...pageInfo1 } as DataTypeParam);

      const label = { ...labelParams };

      getRawDataList(params, label).then((res) => {
        onSelected([]);
        setSelectedRows([]);

        if (res && res.code === 200 && res.data && res.data.rows) {
          setTotal(res.data.total);
          setRawData(
            res.data.rows.map((data: any, index: number) => {
              data.id = index;
              return data;
            }),
          );
          setParentUrl(res.data.parentUrl);
        } else {
          message.error('获取失败！');
          setTotal(0);
          setRawData([]);
          setParentUrl(null);
        }
      });
    },
    [labelParams, onSelected, pageInfo],
  );

  const refresh = useCallback(() => {
    if (parentProLoadData) {
      loadList(parentProLoadData);
    } else {
      loadList(null);
    }
  }, [loadList, parentProLoadData]);

  const getParent = useCallback(() => {
      return parentProLoadData;
  }, [parentProLoadData])

  useImperativeHandle(props.onRef, () => {
    return {
      refresh: refresh,
      getParent: getParent
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedRowsState || selectedRowsState.length === 0) {
        refresh();
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh, selectedRowsState]);

  const sharedOnCell = (record: DataType) => {
    if (record.parent !== null) {
      return { colSpan: 0 };
    }
    return {};
  };

  const getIconByFileType = (type: string) => {
    return type.indexOf('dir') !== -1
      ? '/images/icon_dir.png'
      : type.indexOf('img') !== -1 || type.indexOf('jpg') !== -1 || type.indexOf('jpeg') !== -1
      ? '/images/icon_img.png'
      : type.indexOf('txt') !== -1 || type.indexOf('text') !== -1
      ? '/images/icon_txt.png'
      : '/images/icon_more.png';
  };

  const columns: ProColumns<DataType>[] = [
    {
      key: 'project',
      title: <FormattedMessage id="closeloop.rawdata.project" defaultMessage="项目名称" />,
      dataIndex: 'project',
      valueType: 'text',
      render: (_, record) => {
        if (record.parent !== null) {
          return (
            <div key={`div_${record.id}`}>
              <img
                key={`icon_${record.id}`}
                className={styles.iconProject}
                src={getIconByFileType(record.type)}
              />
              <span key={`name_${record.id}`}>{record.fileName}</span>
            </div>
          );
        }
        return (
          <div key={`div_${record.id}`}>
            <img
              key={`icon_${record.id}`}
              className={styles.iconProject}
              src={getIconByFileType(record.type)}
            />
            <span key={`name_${record.id}`}>{record.project}</span>
          </div>
        );
      },
      onCell: (record: DataType) => {
        if (record.parent === null) {
          return {};
        } else {
          return { colSpan: 6 };
        }
      },
      width: '13%',
      align: 'left',
    },
    {
      key: 'vin',
      title: <FormattedMessage id="closeloop.rawdata.vin" defaultMessage="车辆VIN" />,
      dataIndex: 'vin',
      valueType: 'text',
      width: '13%',
      onCell: sharedOnCell,
      align: 'center',
    },
    {
      key: 'weather',
      title: <FormattedMessage id="closeloop.rawdata.weather" defaultMessage="天气状况" />,
      dataIndex: 'weather',
      valueType: 'select',
      valueEnum: weathers,
      width: '11%',
      onCell: sharedOnCell,
      align: 'center',
      render: (_, record) => {
        return record?.label?.weather ? record?.label?.weather : '-';
      },
    },
    {
      key: 'event',
      title: <FormattedMessage id="closeloop.rawdata.event" defaultMessage="事件" />,
      dataIndex: 'event',
      valueType: 'select',
      valueEnum: events,
      width: '11%',
      onCell: sharedOnCell,
      align: 'center',
      render: (_, record) => {
        return record?.label?.event ? record?.label?.event : '-';
      },
    },
    {
      key: 'timeInterval',
      title: <FormattedMessage id="closeloop.rawdata.time" defaultMessage="时段" />,
      dataIndex: 'timeInterval',
      valueType: 'select',
      valueEnum: times,
      width: '11%',
      onCell: sharedOnCell,
      align: 'center',
      render: (_, record) => {
        return record?.label?.timeInterval ? record?.label?.timeInterval : '-';
      },
    },
    {
      key: 'timeArea',
      title: <FormattedMessage id="closeloop.rawdata.timeArea" defaultMessage="时间区间" />,
      dataIndex: 'timeArea',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
      hideInTable: true,
      render: undefined,
      align: 'center',
    },
    {
      key: 'creator',
      title: <FormattedMessage id="closeloop.rawdata.creator" defaultMessage="上传人" />,
      dataIndex: 'creator',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
      onCell: sharedOnCell,
      align: 'center',
    },
    {
      key: 'size',
      title: <FormattedMessage id="closeloop.rawdata.size" defaultMessage="文件大小(KB)" />,
      dataIndex: 'size',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      align: 'center',
    },
    {
      key: 'updateTime',
      title: <FormattedMessage id="closeloop.rawdata.updateTime" defaultMessage="更新时间" />,
      dataIndex: 'updateTime',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
      align: 'center',
      sorter: (a, b) => {
        const aTime = new Date(a.updateTime).getTime(); // 需要先转换成时间戳
        const bTime = new Date(b.updateTime).getTime();
        return aTime - bTime;
      },
    },
    {
      key: 'options',
      title: <FormattedMessage id="closeloop.rawdata.options" defaultMessage="操作" />,
      dataIndex: 'options',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key={`${record.id}_download`}
          hidden={!access.hasPerms('closeloop:rawdata:download')}
          onClick={(e) => {
            onDownload(record);
            e.stopPropagation();
          }}
        >
          <FormattedMessage id="pages.searchTable.download" defaultMessage="下载" />
        </Button>,
        <Button
          type="link"
          size="small"
          key={`${record.id}_delete`}
          hidden={!access.hasPerms('closeloop:rawdata:delete')}
          onClick={(e) => {
            onDelete(record);
            e.stopPropagation();
          }}
        >
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
        </Button>,
      ],
      align: 'center',
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ProTable<DataType>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '信息',
        })}
        rowKey={(_record, index) => {
          return `${_record.fileName}_${index}`;
        }}
        key="fileName"
        search={{
          style: {
            margin: 0,
          },
          labelWidth: 'auto',
          span: 6,
          searchGutter: 24,
        }}
        dataSource={rawData}
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: total,
          current: pageInfo?.current,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) => {
            const pageInfo1: PageLoad = { ...pageInfo, current: page, pageSize: pageSize };
            setPageInfo(pageInfo1);

            getRawDataList(
              parentProLoadData && parentProLoadData !== '' && parentProLoadData !== 'sourceRoot'
                ? ({ parent: parentProLoadData, ...pageInfo1 } as DataTypeParam)
                : ({ ...pageInfo1 } as DataTypeParam),
              labelParams,
            ).then((res) => {
              onSelected([]);
              setSelectedRows([]);
              if (res && res.code === 200 && res.data && res.data.rows) {
                setTotal(res.data.total);
                setRawData(
                  res.data.rows.map((data: any, index: number) => {
                    data.id = index;
                    return data;
                  }),
                );
                setParentUrl(res.data.parentUrl);
              } else {
                message.error('获取失败！');
                setTotal(0);
                setRawData([]);
                setParentUrl(null);
              }
            });
          },
        }}
        beforeSearchSubmit={(params) => {
          const { project, vin, weather, event, timeInterval, startTime, endTime } = params;

          const pageInfo1: PageLoad = { ...pageInfo };
          const labelParams1: MarkingType = { ...labelParams };

          if (project) {
            pageInfo1.project = project;
          } else {
            delete pageInfo1.project;
          }

          if (vin) {
            pageInfo1.vin = vin;
          } else {
            delete pageInfo1.vin;
          }

          if (startTime) {
            pageInfo1.startTime = startTime;
          } else {
            delete pageInfo1.startTime;
          }

          if (endTime) {
            pageInfo1.endTime = endTime;
          } else {
            delete pageInfo1.endTime;
          }

          if (weather) {
            labelParams1.weather = weather;
          } else {
            delete labelParams1.weather;
          }
          if (event) {
            labelParams1.event = event;
          } else {
            delete labelParams1.event;
          }
          if (timeInterval) {
            labelParams1.timeInterval = timeInterval;
          } else {
            delete labelParams1.timeInterval;
          }

          pageInfo1.current = pageInfo.current;
          pageInfo1.pageSize = pageInfo.pageSize;
          setPageInfo({ ...pageInfo1 });
          setLabelParams({ ...labelParams1 });
          getRawDataList(
            parentProLoadData && parentProLoadData !== '' && parentProLoadData !== 'sourceRoot'
              ? ({ parent: parentProLoadData, ...pageInfo1 } as DataTypeParam)
              : ({ ...pageInfo1 } as DataTypeParam),
            labelParams1,
          ).then((res) => {
            onSelected([]);
            setSelectedRows([]);
            if (res && res.code === 200 && res.data && res.data.rows) {
              setTotal(res.data.total);
              setRawData(
                res.data.rows.map((data: any, index: number) => {
                  data.id = index;
                  return data;
                }),
              );
              setParentUrl(res.data.parentUrl);
            } else {
              message.error('获取失败！');
              setTotal(0);
              setRawData([]);
              setParentUrl(null);
            }
          });
        }}
        onRow={(record, index: number | undefined): any => {
          if (index === undefined) return {};
          return {
            onClick: () => {
              if (record.fileName.indexOf('.') && record.type !== 'dir') {
                onShowInfo(record, rawData);
                return true;
              }
              loadList(record.url);
              return true;
            },
          };
        }}
        rowClassName={() => {
          return styles.dataTableRow;
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowsState,
          onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            onSelected(selectedRows);
            setSelectedRows(selectedRowKeys);
          },
          getCheckboxProps: () => ({
            disabled: false,
          }),
        }}
        toolBarRender={false}
        sticky
        summary={() => {
          const parent = parentUrl;
          if (parent === null) return;

          const paths = parent.split('/');

          return (
            <Table.Summary fixed={'top'}>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={1}>
                  <Checkbox disabled />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={0} colSpan={11}>
                  <Breadcrumb style={{ color: 'blue' }} separator="/">
                    <Breadcrumb.Item
                      className={styles.dataTableRow}
                      onClick={() => {
                        let path = '';
                        paths.forEach((path0, index) => {
                          if (index < paths.length - 1) {
                            path += path0 + '/';
                          }
                        });
                        path = path.substring(0, path.length - 1);
                        console.log(paths, path);
                        if (paths[0] && paths[0] === path && paths[1] === '') {
                          loadList(null);
                        } else {
                          loadList(path);
                        }
                      }}
                    >
                      <RollbackOutlined />
                      <span className={styles.appendPathStart}>_</span>
                    </Breadcrumb.Item>
                    {paths &&
                      paths
                        .filter((path) => path.indexOf('sourceRoot') === -1)
                        .map((path, index0) => {
                          return (
                            <Breadcrumb.Item
                              className={styles.appendPath}
                              key={`apped-${index0}`}
                              separator="/"
                              onClick={() => {
                                const apath = parent.split(path);
                                const ppath = (apath.length > 0 ? apath[0] : '') + path;
                                loadList(ppath);
                              }}
                            >
                              {path}
                            </Breadcrumb.Item>
                          );
                        })}
                  </Breadcrumb>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default DataTable;
