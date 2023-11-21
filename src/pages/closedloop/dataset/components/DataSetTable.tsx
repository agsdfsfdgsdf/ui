import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useEffect, useState, useImperativeHandle, useCallback } from 'react';
import { FormattedMessage, useAccess, useIntl } from 'umi';
import styles from '../style.less';
import { Breadcrumb, Button, Checkbox, Table, message } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import type { DataSetParam, DataSetType } from '../data';
import { getDataSetList } from '../server';

export type DataSetTableProps = {
  onRef?: any;
  markStatus?: any;
  onDownload: (data: DataSetType) => void;
  onDelete: (data: DataSetType) => void;
  onSelected: (datas: DataSetType[]) => void;
  onShowInfo: (data: DataSetType, allData: DataSetType[]) => void;
};

export type PageLoad = {
  current?: number;
  pageSize?: number;
  fileName?: string;
  marking?: string;
};

const DataSetTable = (props: DataSetTableProps) => {
  const [dataSet, setDataSet] = useState<DataSetType[]>([]);
  const [selectedRowsState, setSelectedRows] = useState<React.Key[]>([]);

  const { markStatus, onDownload, onDelete, onSelected, onShowInfo } = props;
  const [parentUrl, setParentUrl] = useState<string | null>(null);
  const [parentProLoadDataSet, setParentProLoadDataSet] = useState<string | null | undefined>();
  const [total, setTotal] = useState<number>();
  const [pageInfo, setPageInfo] = useState<PageLoad>({ current: 1, pageSize: 10 });

  /** 国际化配置 */
  const intl = useIntl();
  const access = useAccess();

  const loadList = useCallback(
    function (parent?: string | null) {
      let parent1 = parent;
      if (parent1 && parent1.endsWith(':')) {
        parent1 += '/';
      }

      const pageInfo1 = { ...pageInfo };
      if (pageInfo1.current != 1 && parent !== parentProLoadDataSet) {
        pageInfo1.current = 1;
        setPageInfo(pageInfo1);
      }
      setParentProLoadDataSet(parent);

      getDataSetList(
        parent1 && parent1 !== '' && parent1 !== 'collectRoot'
          ? ({ parent: parent1, ...pageInfo1 } as DataSetParam)
          : ({ ...pageInfo1 } as DataSetParam),
      ).then((res) => {
        setSelectedRows([]);
        if (res && res.code === 200 && res.data && res.data.rows) {
          setTotal(res.data.total);
          setDataSet(
            res.data.rows.map((data, index) => {
              data.id = index;
              return data;
            }),
          );
          setParentUrl(res.data.parentUrl);
        } else {
          message.error('获取失败！');
          setTotal(0);
          setDataSet([]);
          setParentUrl(null);
        }
      });
    },
    [pageInfo],
  );

  const refresh = useCallback(() => {
    if (parentProLoadDataSet) {
      loadList(parentProLoadDataSet);
    } else {
      loadList(null);
    }
  }, [loadList, parentProLoadDataSet]);

  const getParent = useCallback(() => {
    return parentProLoadDataSet;
  }, [parentProLoadDataSet]);

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

  useImperativeHandle(props.onRef, () => {
    return {
      refresh: refresh,
      getParent: getParent
    };
  });

  const sharedOnCell = (record: DataSetType) => {
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

  const columns: ProColumns<DataSetType>[] = [
    {
      key: 'fileName',
      title: <FormattedMessage id="closeloop.dataset.collect" defaultMessage="文件名称" />,
      dataIndex: 'fileName',
      valueType: 'text',
      render: (_, record) => {
        return (
          <div>
            <img className={styles.iconProject} src={getIconByFileType(record.type)} />
            <span>{record.fileName}</span>
          </div>
        );
      },
      onCell: (record: DataSetType) => {
        if (record.parent === null) {
          return {};
        } else {
          return { colSpan: 4 };
        }
      },
      width: '35%',
      align: 'left',
    },
    {
      key: 'marking',
      title: <FormattedMessage id="closeloop.dataset.marking" defaultMessage="是否标注" />,
      dataIndex: 'marking',
      valueType: 'select',
      valueEnum: markStatus,
      width: '30%',
      onCell: sharedOnCell,
      align: 'center',
    },
    {
      key: 'creator',
      title: <FormattedMessage id="closeloop.rawdata.creator" defaultMessage="创建人" />,
      dataIndex: 'creator',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      onCell: sharedOnCell,
      align: 'center',
    },
    {
      key: 'updateTime',
      title: <FormattedMessage id="closeloop.rawdata.updateTime" defaultMessage="更新时间" />,
      dataIndex: 'updateTime',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
      onCell: sharedOnCell,
      align: 'center',
      sorter: (a, b) => {
        const aTime = new Date(a.updateTime).getTime();
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
      <ProTable<DataSetType>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '信息',
        })}
        rowKey="id"
        key="id"
        search={{
          labelWidth: 120,
        }}
        dataSource={dataSet}
        onRow={(record, index: number | undefined): any => {
          if (index === undefined) return {};
          return {
            onClick: () => {
              if (record.fileName.indexOf('.') && record.type !== 'dir') {
                onShowInfo(record, dataSet);
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
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: total,
          current: pageInfo?.current,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) => {
            const pageInfo1: PageLoad = { ...pageInfo, current: page, pageSize: pageSize };
            setPageInfo(pageInfo1);

            getDataSetList(
              parentProLoadDataSet &&
                parentProLoadDataSet !== '' &&
                parentProLoadDataSet !== 'collectRoot'
                ? ({ parent: parentProLoadDataSet, ...pageInfo1 } as DataSetParam)
                : ({ ...pageInfo1 } as DataSetParam),
            ).then((res) => {
              setSelectedRows([]);
              if (res && res.code === 200 && res.data && res.data.rows) {
                setTotal(res.data.total);
                setDataSet(
                  res.data.rows.map((data, index) => {
                    data.id = index;
                    return data;
                  }),
                );
                setParentUrl(res.data.parentUrl);
              } else {
                message.error('获取失败！');
                setTotal(0);
                setDataSet([]);
                setParentUrl(null);
              }
            });
          },
        }}
        beforeSearchSubmit={(params) => {
          const pageInfo1: PageLoad = { ...pageInfo };
          if (params.fileName) {
            pageInfo1.fileName = params.fileName;
          } else {
            delete pageInfo1.fileName;
          }

          if (params.marking) {
            pageInfo1.marking = params.marking;
          } else {
            delete pageInfo1.marking;
          }
          pageInfo1.current = pageInfo.current;
          pageInfo1.pageSize = pageInfo.pageSize;

          setPageInfo({ ...pageInfo1 });

          getDataSetList(
            parentProLoadDataSet &&
              parentProLoadDataSet !== '' &&
              parentProLoadDataSet !== 'collectRoot'
              ? ({ parent: parentProLoadDataSet, ...pageInfo1 } as DataSetParam)
              : ({ ...pageInfo1 } as DataSetParam),
          ).then((res) => {
            setSelectedRows([]);
            if (res && res.code === 200 && res.data && res.data.rows) {
              setTotal(res.data.total);
              setDataSet(
                res.data.rows.map((data, index) => {
                  data.id = index;
                  return data;
                }),
              );
              setParentUrl(res.data.parentUrl);
            } else {
              message.error('获取失败！');
              setTotal(0);
              setDataSet([]);
              setParentUrl(null);
            }
          });
        }}
        rowSelection={{
          selectedRowKeys: selectedRowsState,
          onChange: (selectedRowKeys: React.Key[], selectedRows: DataSetType[]) => {
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
                        .filter((path) => path.indexOf('collectRoot') === -1)
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

export default DataSetTable;
