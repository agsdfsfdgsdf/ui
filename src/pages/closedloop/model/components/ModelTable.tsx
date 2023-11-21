import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import type { ModelType, ModelTypeParam } from '../data';
import { getModelDataList } from '../server';
import { useAccess } from 'umi';
import styles from '../style.less';
import { Breadcrumb, Button, Checkbox, Table, message } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

export type DataTableProps = {
  onRef?: any;
  onDownload: (data: ModelType) => void;
  onDelete: (data: ModelType) => void;
  onSelected: (datas: ModelType[]) => void;
  onShowInfo: (data: ModelType, allData: ModelType[]) => void;
};

export type PageLoad = {
  current?: number;
  pageSize?: number;
  name?: string;
  startTime?: string;
  endTime?: string;
  version?: string;
};

const ModelTable = (props: DataTableProps) => {
  const [modelData, setModelData] = useState<ModelType[]>([]);
  const [selectedRowsState, setSelectedRows] = useState<React.Key[]>([]);
  const [parentUrl, setParentUrl] = useState<string | null>(null);
  const [total, setTotal] = useState<number>();
  const [pageInfo, setPageInfo] = useState<PageLoad>({ current: 1, pageSize: 10 });
  const [parentProLoadData, setParentProLoadData] = useState<string | null | undefined>();

  const { onDownload, onDelete, onSelected, onShowInfo } = props;

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
        parent1 && parent1 !== '' && parent1 !== 'modelRoot'
          ? ({ parent: parent1, ...pageInfo1 } as ModelTypeParam)
          : ({ ...pageInfo1 } as ModelTypeParam);

      getModelDataList(params).then((res) => {
        onSelected([]);
        setSelectedRows([]);

        if (res && res.code === 200 && res.data && res.data.rows) {
          setTotal(res.data.total);
          setModelData(
            res.data.rows.map((data, index) => {
              data.id = index;
              return data;
            }),
          );
          setParentUrl(res.data.parentUrl);
        } else {
          message.error('获取失败！');
          setTotal(0);
          setModelData([]);
          setParentUrl(null);
        }
      });
    },
    [onSelected, pageInfo],
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
  }, [parentProLoadData]);

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

  const sharedOnCell = (record: ModelType) => {
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

  const columns: ProColumns<ModelType>[] = [
    {
      title: '文件名',
      dataIndex: 'name',
      valueType: 'text',
      render: (_, record) => {
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
      },
      onCell: (record: ModelType) => {
        if (record.parent === null) {
          return {};
        } else {
          return { colSpan: 3 };
        }
      },
      width: '40%',
      align: 'left',
    },
    {
      title: '版本号',
      dataIndex: 'version',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
      onCell: sharedOnCell,
      align: 'center',
    },
    {
      title: '上传人',
      dataIndex: 'creator',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      onCell: sharedOnCell,
      align: 'center',
    },
    {
      title: '文件大小(KB)',
      dataIndex: 'size',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      align: 'center',
    },
    {
      title: '更新时间',
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
      title: '操作',
      dataIndex: 'options',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="download"
          hidden={!access.hasPerms('closeloop:modeldata:download')}
          onClick={(e) => {
            onDownload(record);
            e.stopPropagation();
          }}
        >
          下载
        </Button>,
        <Button
          type="link"
          size="small"
          key="delete"
          hidden={!access.hasPerms('closeloop:modeldata:delete')}
          onClick={(e) => {
            onDelete(record);
            e.stopPropagation();
          }}
        >
          删除
        </Button>,
      ],
      align: 'center',
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ProTable<ModelType>
        headerTitle='信息'
	      rowKey="id"
        key="modelTable"
        search={{
          style: {
            margin: 0,
          },
          labelWidth: 'auto',
          span: 6,
          searchGutter: 24,
        }}
        dataSource={modelData}
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: total,
          current: pageInfo?.current,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) => {
            const pageInfo1: PageLoad = { ...pageInfo, current: page, pageSize: pageSize };
            setPageInfo(pageInfo1);

            getModelDataList(
              parentProLoadData && parentProLoadData !== '' && parentProLoadData !== 'modelRoot'
                ? ({ parent: parentProLoadData, ...pageInfo1 } as ModelTypeParam)
                : ({ ...pageInfo1 } as ModelTypeParam),
            ).then((res) => {
              onSelected([]);
              setSelectedRows([]);
              if (res && res.code === 200 && res.data && res.data.rows) {
                setTotal(res.data.total);
                setModelData(
                  res.data.rows.map((data, index) => {
                    data.id = index;
                    return data;
                  }),
                );
                setParentUrl(res.data.parentUrl);
              } else {
                message.error('获取失败！');
                setTotal(0);
                setModelData([]);
                setParentUrl(null);
              }
            });
          },
        }}
        beforeSearchSubmit={(params) => {
          const { name, version, startTime, endTime } = params;

          const pageInfo1: PageLoad = { ...pageInfo };

          if (name) {
            pageInfo1.name = name;
          } else {
            delete pageInfo1.name;
          }

          if (version) {
            pageInfo1.version = version;
          } else {
            delete pageInfo1.version;
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

          pageInfo1.current = pageInfo.current;
          pageInfo1.pageSize = pageInfo.pageSize;

          setPageInfo({ ...pageInfo1 });
          getModelDataList(
            parentProLoadData && parentProLoadData !== '' && parentProLoadData !== 'modelRoot'
              ? ({ parent: parentProLoadData, ...pageInfo1 } as ModelTypeParam)
              : ({ ...pageInfo1 } as ModelTypeParam),
          ).then((res) => {
            onSelected([]);
            setSelectedRows([]);
            if (res && res.code === 200 && res.data && res.data.rows) {
              setTotal(res.data.total);
              setModelData(
                res.data.rows.map((data, index) => {
                  data.id = index;
                  return data;
                }),
              );
              setParentUrl(res.data.parentUrl);
            } else {
              message.error('获取失败！');
              setTotal(0);
              setModelData([]);
              setParentUrl(null);
            }
          });
        }}
        onRow={(record, index: number | undefined): any => {
          if (index === undefined) return {};
          return {
            onClick: () => {
              if (record.fileName.indexOf('.') && record.type !== 'dir') {
                onShowInfo(record, modelData);
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
          onChange: (selectedRowKeys: React.Key[], selectedRows: ModelType[]) => {
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
          let parent = parentUrl;
          if (parent === null) return;

          if(parent.endsWith('/')){
            parent = parent.substring(0, parent.length - 1);
          }

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
                        .filter((path) => path.indexOf('modelRoot') === -1)
                        .map((path, index0) => {
                          return (
                            <Breadcrumb.Item
                              className={styles.appendPath}
                              key={`apped-${index0}`}
                              separator="/"
                              onClick={() => {
                                if(parent !== null) {
                                  const apath = parent.split(path);
                                  const ppath = (apath.length > 0 ? apath[0] : '') + path;
                                  loadList(ppath);
                                }
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

export default ModelTable;
