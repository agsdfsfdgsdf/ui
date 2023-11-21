import { Row, Col, Button, Form, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import WrapContent from '@/components/WrapContent';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';

import styles from './style.less';
import { getDict } from '@/pages/system/dict/service';
import DataSetTable from './components/DataSetTable';
import type { DataType } from '../rawdata/data';
import DataTable from '../rawdata/components/DataTable';
import { BizFromUploadFile } from '../upload/BizFromUploadFile';
import type { DataSetType } from './data';
import DrawerFromFileInfo from '../fileinfo/DrawerFromFileInfo';
import { ProFormText } from '@ant-design/pro-form';
import DataUpload from './components/DataUpload';
import DrawerFromUploadStatus from '../upload/components/DrawerFromUploadStatus';
import { deleteRawData, updateRawData } from '../rawdata/server';
import { createDataSet, createDir, deleteDataSet, updateDataSet } from './server';
import { useForm } from 'antd/es/form/Form';
import type { FileInfo, ShowInfoData } from '../fileinfo/data';
import type { MarkingType } from '../rawdata/data';
import { queryCurrentUserInfo } from '@/pages/account/center/service';
import ModalFromZipDownload from '@/pages/closedloop/upload/components/ModalFromZipDownload';
import DrawerFromCopy from '@/pages/closedloop/components/DrawerFromCopy';
import DrawerFromMove from '@/pages/closedloop/components/DrawerFromMove';
import DrawerFromDirectory from '@/pages/closedloop/components/DrawerFromDirectory';
import {BizFromDownZipFile} from "@/pages/closedloop/upload/BizFromDownZipFile";
import {DownZipFile} from "@/pages/closedloop/upload/data";
import { copyFilesToDir } from '../components/DrawerFromCopy/server';
import { moveFilesToDir } from '../components/DrawerFromMove/server';

/**
 * 更新节点
 *
 * @param selectedRows
 */
const handleUpdate = async (selectedRows: DataType) => {
  const hide = message.loading('正在更新标注');
  if (!selectedRows) return true;
  try {
    const resp = await updateRawData([selectedRows]);
    hide();
    if (resp.code === 200) {
      message.success('标注更新成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('标注更新失败，请重试');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param selectedRows
 */
const handleUpdateDataSet = async (selectedRows: DataSetType) => {
  const hide = message.loading('正在更新标注');
  if (!selectedRows) return true;
  try {
    const resp = await updateDataSet([selectedRows]);
    hide();
    if (resp.code === 200) {
      message.success('标注更新成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('标注更新失败，请重试');
    return false;
  }
};

const handleRemoveOne = async (selectedRow: DataType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await deleteRawData(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemoveDataSet = async (selectedRows: DataSetType[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await deleteDataSet(selectedRows.map((row) => row.id).join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleRemoveOneDataSet = async (selectedRow: DataSetType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await deleteDataSet(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const RowDataPage: React.FC = () => {
  const actionRef = useRef<any>();
  const actionDataSetRef = useRef<any>();
  const zipModalRef = useRef<any>();

  const [form] = useForm();

  const [weathers, setWeathers] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);
  const [times, setTimes] = useState<any>([]);
  const [markStatus, setMarkStatus] = useState<any>([]);

  const [showCreateDataSet, setShowCreateDataSet] = useState<boolean>(false);
  const [showUploadDataSet, setShowUploadDataSet] = useState<boolean>(false);

  const [showInfoData, setShowInfoData] = useState<ShowInfoData | undefined>();
  const [selectData, setSelectData] = useState<DataType[]>([]);
  const [selectDataSet, setSelectDataSet] = useState<DataSetType[]>([]);
  const [showUploadStatus, setShowUploadStatus] = useState<boolean>(false);
  const [showZipDownload, setShowZipDownload] = useState<boolean>(false);
  const [showCopyTo, setShowCopyTo] = useState<boolean>(false);
  const [showMoveTo, setShowMoveTo] = useState<boolean>(false);
  const [showCreateDirectory, setShowCreateDirectory] = useState<boolean>(false);

  useEffect(() => {
    form.resetFields();

    getDict('closedloop_mark_status').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setMarkStatus(opts);
      }
    });
    getDict('closedloop_mark_weather').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setWeathers(opts);
      }
    });
    getDict('closedloop_mark_event').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setEvents(opts);
      }
    });
    getDict('closedloop_mark_time').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictLabel] = item.dictLabel;
        });
        setTimes(opts);
      }
    });
  }, []);

  return (
    <WrapContent>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Row gutter={[16, 24]} className={styles.panelRow}>
            <Col span={24} hidden={showCreateDataSet || showUploadDataSet} style={{display: 'flex', flexDirection: 'row'}}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setShowCreateDataSet(true);
                }}
              >
                新建数据集
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  setShowCreateDirectory(true);
                }}
              >
                新建目录
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!selectDataSet || selectDataSet.length === 0}
                onClick={() => {
                  setShowMoveTo(true);
                }}
              >
                移动到
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!selectDataSet || selectDataSet.length === 0}
                onClick={() => {
                  setShowCopyTo(true);
                }}
              >
                复制到
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={
                  !(
                    selectDataSet &&
                    selectDataSet.length > 0 &&
                    selectDataSet.filter(
                      (dataSet) => dataSet.parent === null || dataSet.parent === '',
                    ).length === 1
                  )
                }
                onClick={() => {
                  setShowUploadDataSet(true);
                }}
              >
                上传标注结果
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!(selectDataSet && selectDataSet.length > 0)}
                onClick={async () => {
                  const urls = selectDataSet.map((data) => {
                    if (data.type.indexOf('dir') !== -1) {
                      return data.url + '/';
                    } else {
                      return data.url;
                    }
                  });
                  await BizFromDownZipFile.putFileList({
                    filepath: urls,
                    fileName: '数据集_' + Date.now() + '.zip',
                    type: 2,
                  } as DownZipFile);
                  setShowZipDownload(true);
                }}
              >
                下载
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!(selectDataSet && selectDataSet.length > 0)}
                onClick={() => {
                  Modal.confirm({
                    title: '删除',
                    content: '确定删除该项吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      const success = await handleRemoveDataSet(selectDataSet);
                      if (success) {
                        if (actionDataSetRef.current) {
                          actionDataSetRef.current.refresh();
                        }
                      }
                    },
                  });
                }}
              >
                彻底删除
              </Button>
              <div style={{flex: 1}} />
              <Button
                type="link"
                style={{ margin: '0px 16px', float: 'right', cursor: 'pointer' }}
                onClick={() => {
                  setShowUploadStatus(true);
                }}
              >
                任务列表
              </Button>
            </Col>
            <Col span={24} hidden={!showCreateDataSet}>
              <Button
                icon={<LeftOutlined />}
                style={{ color: '#333', fontSize: '16px' }}
                type="link"
                onClick={() => {
                  setShowCreateDataSet(false);
                  setSelectDataSet([]);
                  setSelectData([]);
                }}
              >
                新建数据集
              </Button>
            </Col>
            <Col span={24} hidden={!showUploadDataSet}>
              <Button
                icon={<LeftOutlined />}
                style={{ color: '#333', fontSize: '16px' }}
                type="link"
                onClick={() => {
                  setShowUploadDataSet(false);
                  setSelectDataSet([]);
                  setSelectData([]);
                }}
              >
                上传标注结果
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 24]} className={styles.panelRow}>
            <Col span={24}>
              {!showCreateDataSet && !showUploadDataSet && (
                <DataSetTable
                  onRef={actionDataSetRef}
                  markStatus={markStatus}
                  onDownload={async (data: DataSetType) => {
                    console.log('Gunson', 'onDownload set', data);
                    if (data.type === 'dir') {
                      await BizFromDownZipFile.putFileList({
                        filepath: [data.url + '/'],
                        fileName: data.fileName + '.zip',
                        type: 2
                      } as DownZipFile);
                      setShowZipDownload(true);
                    } else {
                      await BizFromUploadFile.download(data.url, data.fileName);
                    }
                  }}
                  onDelete={(data: DataSetType) => {
                    Modal.confirm({
                      title: '删除',
                      content: '确定删除该项吗？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        const success = await handleRemoveOneDataSet(data);
                        if (success) {
                          if (actionDataSetRef.current) {
                            actionDataSetRef.current.refresh();
                          }
                        }
                      },
                    });
                  }}
                  onSelected={(datas: DataSetType[]) => {
                    console.log('Gunson', 'onSelected set', datas);
                    setSelectDataSet(datas);
                  }}
                  onShowInfo={(data: DataSetType, allData: DataSetType[]) => {
                    const data1: FileInfo = {
                      id: data.id,
                      fileName: data.fileName,
                      url: data.url,
                      type: data.type,
                      size: data.size,
                      label: data.label,
                    };
                    const allData1: FileInfo[] = allData.map((data0) => {
                      return {
                        id: data0.id,
                        fileName: data0.fileName,
                        url: data0.url,
                        type: data0.type,
                        size: data0.size,
                        label: data0.label,
                      } as FileInfo;
                    });
                    setShowInfoData({
                      data: data1,
                      allData: allData1,
                      isShow: true,
                      upkey: 'dataset',
                    } as ShowInfoData);
                  }}
                />
              )}
              {showCreateDataSet && !showUploadDataSet && (
                <Form
                  form={form}
                  onFinish={async () => {
                    const resultInfo = await queryCurrentUserInfo();
                    const creator = resultInfo?.data?.user?.userName;
                    const value = form.getFieldsValue();
                    if (!value || !value.collect || value.collect === '') {
                      message.error('请填写数据集名称！');
                      return;
                    }
                    if (!selectData || selectData.length === 0) {
                      message.error('请选择数据！');
                      return;
                    }

                    const result = await createDataSet({
                      collect: {
                        collect: value.collect,
                        creator: creator,
                        marking: value.marking,
                      },
                      ids: selectData.map((data) => data.id),
                    });

                    if (result && result.code === 200) {
                      form.resetFields();
                      setShowCreateDataSet(false);

                      message.info('数据集创建中，请稍等一会刷新查看！');

                      setTimeout(function () {
                        if (actionDataSetRef?.current) {
                          actionDataSetRef.current.refresh();
                        }
                      }, 15000);
                    } else {
                      message.error(result.message);
                    }
                  }}
                >
                  <Form.Item>
                    <ProFormText
                      name="collect"
                      label="数据集名称："
                      labelCol={{ span: 'auto' }}
                      width="md"
                      placeholder="请输入数据集名称"
                      rules={[
                        {
                          required: true,
                          message: '请输入数据集名称',
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    <DataTable
                      onRef={actionRef}
                      weathers={weathers}
                      events={events}
                      times={times}
                      onDownload={async (data: DataType) => {
                        console.log('Gunson', 'onDownload', data);
                        if (data.type === 'dir') {
                          await BizFromDownZipFile.putFileList({
                            filepath: [data.url + '/'],
                            fileName: data.fileName + '.zip',
                            type: 1,
                          } as DownZipFile);
                          // BizFromUploadFile.downLoadZip(
                          //   data.fileName + '.zip',
                          //   [data.url + '/'],
                          //   1,
                          //   (progress: number, desc: string) => {
                          //     zipModalRef?.current?.setPercent(progress);
                          //     zipModalRef?.current?.setPercentLabel(desc);
                          //   },
                          // );
                          setShowZipDownload(true);
                        } else {
                          BizFromUploadFile.download(data.url, data.fileName);
                        }
                      }}
                      onDelete={(data: DataType) => {
                        console.log('Gunson', 'onDelete', data);
                        Modal.confirm({
                          title: '删除',
                          content: '确定删除该项吗？',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: async () => {
                            const success = await handleRemoveOne(data);
                            if (success) {
                              if (actionRef.current) {
                                actionRef.current.refresh();
                              }
                            }
                          },
                        });
                      }}
                      onSelected={(data: DataType[]) => {
                        console.log('Gunson', 'onSelected', data);
                        setSelectData(data);
                      }}
                      onShowInfo={(data: DataType, allData: DataType[]) => {
                        const data1: FileInfo = {
                          id: data.id,
                          fileName: data.fileName,
                          url: data.url,
                          type: data.type,
                          size: data.size,
                          label: data.label,
                        };
                        const allData1: FileInfo[] = allData.map((data0) => {
                          return {
                            id: data0.id,
                            fileName: data0.fileName,
                            url: data0.url,
                            type: data0.type,
                            size: data0.size,
                            label: data0.label,
                          } as FileInfo;
                        });
                        setShowInfoData({
                          data: data1,
                          allData: allData1,
                          isShow: true,
                          upkey: 'rawdata',
                        } as ShowInfoData);
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
                      完成
                    </Button>
                    <Button
                      type="default"
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        setShowCreateDataSet(false);
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Form>
              )}
              <DrawerFromFileInfo
                showInfoData={showInfoData}
                showLabel={true}
                weathers={weathers}
                events={events}
                times={times}
                onCancel={() => {
                  setShowInfoData({ isShow: false } as ShowInfoData);
                }}
                onSubmit={async (data: any, values: MarkingType, upkey) => {
                  const dataObj = data;
                  dataObj.label = values;
                  if (upkey === 'dataset') {
                    const success = await handleUpdateDataSet(dataObj);
                    if (success) {
                      if (actionDataSetRef.current) {
                        actionDataSetRef.current.refresh();
                      }
                    }
                  } else {
                    const success = await handleUpdate(dataObj);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.refresh();
                      }
                    }
                  }

                  setShowInfoData({ isShow: false } as ShowInfoData);
                }}
              />
              {showUploadDataSet && selectDataSet && selectDataSet[0] && (
                <DataUpload
                  dataSet={selectDataSet[0]}
                  markStatus={markStatus}
                  show={showUploadDataSet}
                  clickUploadStatus={() => {
                    setShowUploadStatus(true);
                  }}
                  cancel={function (): void {
                    setShowUploadDataSet(false);
                    setSelectDataSet([]);
                    setSelectData([]);
                  }}
                />
              )}
              <DrawerFromUploadStatus
                upkey="dataset_upload"
                show={showUploadStatus}
                onCancel={() => {
                  setShowUploadStatus(false);
                }}
                onSubmit={async () => {
                  setShowUploadStatus(false);
                }}
              />

              <DrawerFromCopy
                selectData={selectDataSet}
                type={2}
                show={showCopyTo}
                onSubmit={async (directory: any) => {
                  const result = await copyFilesToDir(selectDataSet.map((data: DataSetType) => {
                    return data.id;
                  }), directory, 2);
                  if(result && result.code === 200){
                    message.success("数据拷贝成功！");
                    setShowCopyTo(false);
                  }else{
                    message.error("数据拷贝失败！");
                    setShowCopyTo(false);
                  }
                }}
                onCancel={() => {
                  setShowCopyTo(false);
                }}
              />

              <DrawerFromMove
                selectData={selectDataSet}
                type={2}
                show={showMoveTo}
                onSubmit={async (directory: any) => {
                  const result = await moveFilesToDir(selectDataSet.map((data: DataSetType) => {
                    return data.id;
                  }), directory, 2);
                  if(result && result.code === 200){
                    message.success("数据移动成功！");
                    setShowMoveTo(false);
                  }else{
                    message.error("数据移动失败！");
                    setShowMoveTo(false);
                  }
                }}
                onCancel={() => {
                  setShowMoveTo(false);
                }}
              />

              <DrawerFromDirectory
                show={showCreateDirectory}
                onCancel={() => {
                  setShowCreateDirectory(false);
                }}
                onSubmit={async(directory: string) => {
                  const data = await actionDataSetRef.current.getParent();
                  const result = await createDir(directory, data);
                  if(result && result.code === 200){
                    setShowCreateDirectory(false);
                    message.success('创建目录成功！');
                  } else {
                    message.error('创建目录出错！');
                  }
                }}
              />

              <ModalFromZipDownload
                onRef={zipModalRef}
                show={showZipDownload}
                cancel={() => {

                  setShowZipDownload(false);
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </WrapContent>
  );
};

export default RowDataPage;
