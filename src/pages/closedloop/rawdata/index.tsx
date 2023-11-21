import { Row, Col, Button, Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import WrapContent from '@/components/WrapContent';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './style.less';
import DataTable from './components/DataTable';
import DataUpload from './components/DataUpload';
import { getDict } from '@/pages/system/dict/service';
import type { DataType, MarkingType } from './data';
import DrawerFromUploadStatus from '../upload/components/DrawerFromUploadStatus';
import DrawerFromMarking from './components/DrawerFromMarking';
import { BizFromUploadFile } from '../upload/BizFromUploadFile';
import { createDir, deleteRawData, updateRawData } from './server';
import DrawerFromFileInfo from '../fileinfo/DrawerFromFileInfo';
import type { FileInfo, ShowInfoData } from '../fileinfo/data';
import ModalFromZipDownload from '@/pages/closedloop/upload/components/ModalFromZipDownload';
import DrawerFromDirectory from '@/pages/closedloop/components/DrawerFromDirectory';
import DrawerFromCopy from '@/pages/closedloop/components/DrawerFromCopy';
import DrawerFromMove from '@/pages/closedloop/components/DrawerFromMove';
import {BizFromDownZipFile} from "@/pages/closedloop/upload/BizFromDownZipFile";
import {DownZipFile} from "@/pages/closedloop/upload/data";
import { copyFilesToDir } from '../components/DrawerFromCopy/server';
import { moveFilesToDir } from '../components/DrawerFromMove/server';

/**
 * 更新节点
 *
 * @param selectedRows
 */
const handleUpdate = async (selectedRows: DataType[]) => {
  const hide = message.loading('正在更新标注');
  if (!selectedRows) return true;
  try {
    const resp = await updateRawData(selectedRows);
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
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: DataType[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await deleteRawData(selectedRows.map((row) => row.id).join(','));
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

const RowDataPage: React.FC = () => {
  const actionRef = useRef<any>();
  const zipModalRef = useRef<any>();

  const [weathers, setWeathers] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);
  const [times, setTimes] = useState<any>([]);

  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [marking, setMarking] = useState<boolean>(false);
  const [showUploadStatus, setShowUploadStatus] = useState<boolean>(false);
  const [showInfoData, setShowInfoData] = useState<ShowInfoData | undefined>();
  const [selectData, setSelectData] = useState<DataType[]>([]);
  const [showZipDownload, setShowZipDownload] = useState<boolean>(false);
  const [showCopyTo, setShowCopyTo] = useState<boolean>(false);
  const [showMoveTo, setShowMoveTo] = useState<boolean>(false);
  const [showCreateDirectory, setShowCreateDirectory] = useState<boolean>(false);

  useEffect(() => {
    setShowUpload(false);
    setMarking(false);

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
            <Col span={24} hidden={showUpload} style={{display: 'flex', flexDirection: 'row'}}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setShowUpload(!showUpload);
                }}
              >
                上传文件
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
                disabled={!selectData || selectData.length === 0}
                onClick={() => {
                  setShowMoveTo(true);
                }}
              >
                移动到
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!selectData || selectData.length === 0}
                onClick={() => {
                  setShowCopyTo(true);
                }}
              >
                复制到
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!selectData || selectData.length === 0}
                onClick={() => {
                  setMarking(!marking);
                }}
              >
                添加标签
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!selectData || selectData.length === 0}
                onClick={async () => {
                  const urls = selectData.map((data) => {
                    if (data.type.indexOf('dir') !== -1) {
                      return data.url + '/';
                    } else {
                      return data.url;
                    }
                  });
                  await BizFromDownZipFile.putFileList({
                    filepath: urls,
                    fileName: '原始数据_' + Date.now() + '.zip',
                    type: 1,
                  } as DownZipFile);
                  setShowZipDownload(true);
                }}
              >
                下载
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                disabled={!selectData || selectData.length === 0}
                onClick={() => {
                  Modal.confirm({
                    title: '删除',
                    content: '确定删除该项吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      const success = await handleRemove(selectData);
                      if (success) {
                        if (actionRef.current) {
                          actionRef.current.refresh();
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
            <Col span={24} hidden={!showUpload}>
              <Button
                icon={<LeftOutlined />}
                style={{ color: '#333', fontSize: '16px' }}
                type="link"
                onClick={() => {
                  setShowUpload(false);
                }}
              >
                上传数据
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 24]} className={styles.panelRow}>
            <Col span={24}>
              {!showUpload && (
                <DataTable
                  onRef={actionRef}
                  weathers={weathers}
                  events={events}
                  times={times}
                  onDownload={async (data: DataType) => {
                    if (data.type === 'dir') {
                      setShowZipDownload(true);

                      await BizFromDownZipFile.putFileList({
                        filepath: [data.url + '/'],
                        fileName: data.fileName + '.zip',
                        type: 1,
                      } as DownZipFile);
                    } else {
                      await BizFromUploadFile.download(data.url, data.fileName);
                    }
                  }}
                  onDelete={(data: DataType) => {
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
              )}

              <DataUpload
                show={showUpload}
                current={actionRef?.current?.getParent()}
                clickUploadStatus={() => {
                  setShowUploadStatus(true);
                }}
                cancel={() => {
                  setShowUpload(false);
                }}
              />

              <DrawerFromMarking
                label={selectData && selectData.length > 0 && selectData[0] && selectData[0].label}
                weathers={weathers}
                events={events}
                times={times}
                show={marking}
                onSubmit={async (values) => {
                  const selectDataUpdate = selectData.map((rawData) => {
                    rawData.label = values as MarkingType;
                    return rawData;
                  });
                  const success = await handleUpdate(selectDataUpdate);
                  if (success) {
                    if (actionRef.current) {
                      actionRef.current.refresh();
                    }
                    setMarking(false);
                  }
                }}
                onCancel={() => {
                  setMarking(false);
                }}
              />

              <DrawerFromDirectory
                show={showCreateDirectory}
                onCancel={() => {
                  setShowCreateDirectory(false);
                }}
                onSubmit={async (directory: string) => {
                  const data = await actionRef.current.getParent();
                  const result = await createDir(directory, data);
                  if(result && result.code === 200){
                    setShowCreateDirectory(false);
                    message.success('创建目录成功！');
                  } else {
                    message.error('创建目录出错！');
                  }
                }}
              />

              <DrawerFromUploadStatus
                upkey="rawdata_upload"
                show={showUploadStatus}
                onCancel={() => {
                  setShowUploadStatus(false);
                }}
                onSubmit={async () => {
                  setShowUploadStatus(false);
                }}
              />

              <ModalFromZipDownload
                onRef={zipModalRef}
                show={showZipDownload}
                cancel={() => {
                  setShowZipDownload(false);
                }}
              />

              <DrawerFromCopy
                selectData={selectData}
                type={1}
                show={showCopyTo}
                onSubmit={async (directory: any) => {
                  const result = await copyFilesToDir(selectData.map((data: DataType) => {
                    return data.id;
                  }), directory, 1);
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
                selectData={selectData}
                type={1}
                show={showMoveTo}
                onSubmit={async (directory: any) => {
                  const result = await moveFilesToDir(selectData.map((data: DataType) => {
                    return data.id;
                  }), directory, 1);
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

              {showInfoData && showInfoData.isShow && (
                <DrawerFromFileInfo
                  showInfoData={showInfoData}
                  showLabel={true}
                  weathers={weathers}
                  events={events}
                  times={times}
                  onCancel={() => {
                    setShowInfoData({ isShow: false } as ShowInfoData);
                  }}
                  onSubmit={async (data: any, values: MarkingType) => {
                    const dataObj = data;
                    dataObj.label = values;
                    const success = await handleUpdate([dataObj]);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.refresh();
                      }
                      setMarking(false);
                    }
                    setShowInfoData({ isShow: false } as ShowInfoData);
                  }}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </WrapContent>
  );
};

export default RowDataPage;
