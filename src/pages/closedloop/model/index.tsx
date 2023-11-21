import { Row, Col, Button, Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import WrapContent from '@/components/WrapContent';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './style.less';
import ModelTable from './components/ModelTable';
import DataUpload from './components/DataUpload';
import type { ModelType } from './data';
import DrawerFromUploadStatus from '../upload/components/DrawerFromUploadStatus';
import { BizFromUploadFile } from '../upload/BizFromUploadFile';
import { createDir, deleteModelData } from './server';
import DrawerFromFileInfo from '../fileinfo/DrawerFromFileInfo';
import type { FileInfo, ShowInfoData } from '../fileinfo/data';
import ModalFromZipDownload from '@/pages/closedloop/upload/components/ModalFromZipDownload';
import DrawerFromDirectory from '@/pages/closedloop/components/DrawerFromDirectory';
import DrawerFromCopy from '@/pages/closedloop/components/DrawerFromCopy';
import DrawerFromMove from '@/pages/closedloop/components/DrawerFromMove';
import {BizFromDownZipFile} from "@/pages/closedloop/upload/BizFromDownZipFile";
import type {DownZipFile} from "@/pages/closedloop/upload/data";
import { copyFilesToDir } from '../components/DrawerFromCopy/server';
import { moveFilesToDir } from '../components/DrawerFromMove/server';

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: ModelType[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await deleteModelData(selectedRows.map((row) => row.id).join(','));
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

const handleRemoveOne = async (selectedRow: ModelType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await deleteModelData(params.join(','));
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

const ModelDataPage: React.FC = () => {
  const actionRef = useRef<any>();
  const zipModalRef = useRef<any>();

  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [showUploadStatus, setShowUploadStatus] = useState<boolean>(false);
  const [showInfoData, setShowInfoData] = useState<ShowInfoData | undefined>();
  const [selectData, setSelectData] = useState<ModelType[]>([]);
  const [showZipDownload, setShowZipDownload] = useState<boolean>(false);
  const [showCopyTo, setShowCopyTo] = useState<boolean>(false);
  const [showMoveTo, setShowMoveTo] = useState<boolean>(false);
  const [showCreateDirectory, setShowCreateDirectory] = useState<boolean>(false);

  useEffect(() => {
    setShowUpload(false);
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
                    type: 3,
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
                <ModelTable
                  onRef={actionRef}
                  onDownload={async (data: ModelType) => {
                    if (data.type === 'dir') {
                      setShowZipDownload(true);

                      await BizFromDownZipFile.putFileList({
                        filepath: [data.url + '/'],
                        fileName: data.fileName + '.zip',
                        type: 3,
                      } as DownZipFile);
                    } else {
                      await BizFromUploadFile.download(data.url, data.fileName);
                    }
                  }}
                  onDelete={(data: ModelType) => {
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
                  onSelected={(data: ModelType[]) => {
                    setSelectData(data);
                  }}
                  onShowInfo={(data: ModelType, allData: ModelType[]) => {
                    const data1: FileInfo = {
                      id: data.id,
                      fileName: data.fileName,
                      url: data.url,
                      type: data.type,
                      size: data.size,
                    };
                    const allData1: FileInfo[] = allData.map((data0) => {
                      return {
                        id: data0.id,
                        fileName: data0.fileName,
                        url: data0.url,
                        type: data0.type,
                        size: data0.size,
                      } as FileInfo;
                    });
                    setShowInfoData({
                      data: data1,
                      allData: allData1,
                      isShow: true,
                      upkey: 'modeldata',
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
                upkey="modeldata_upload"
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
                type={3}
                show={showCopyTo}
                onSubmit={async (directory: any) => {
                  const result = await copyFilesToDir(selectData.map((data: ModelType) => {
                    return data.id;
                  }), directory, 3);
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
                type={3}
                show={showMoveTo}
                onSubmit={async (directory: any) => {
                  const result = await moveFilesToDir(selectData.map((data: ModelType) => {
                    return data.id;
                  }), directory, 3);
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
                  showLabel={false}
                  onCancel={() => {
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

export default ModelDataPage;
