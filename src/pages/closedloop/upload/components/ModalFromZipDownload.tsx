import { Button, Modal, Progress } from 'antd';
import React, {useEffect, useImperativeHandle, useState} from 'react';
import {BizFromDownZipFile} from "@/pages/closedloop/upload/BizFromDownZipFile";
import {DataBus} from "data-dispatch";
import {DataTypeConfig} from "@/global/DataEventConfig";

type ZipDownloadProps = {
  onRef: any;
  show?: boolean;
  cancel: () => void;
};
const ModalFromZipDownload: React.FC<ZipDownloadProps> = (props: ZipDownloadProps) => {
  const [percent, setPercent] = useState<number>(0);
  const [percentLabel, setPercentLabel] = useState<string>('');

  useEffect(() => {
    const subData = DataBus.subscribe({
      type: DataTypeConfig.ACTION_DOWNZIP,
      callback: () => {
        const endFile = BizFromDownZipFile.getCurrentFile();
        if(endFile) {
          setPercent(endFile.rate || 0);
          setPercentLabel(endFile.rateDesc || '');
        }
      }
    });

    return () => {
      subData.unsubscribe();
    }
  }, []);

  useImperativeHandle(props.onRef, () => {
    return {
      setPercent: setPercent,
      setPercentLabel: setPercentLabel,
    };
  });

  return (
    <Modal
      key='unzip'
      width={460}
      title={'下载'}
      visible={props.show}
      destroyOnClose
      onCancel={() => {
        props.cancel();
      }}
      footer={[
        <Button
          onClick={() => {
            BizFromDownZipFile.cancelDownZip();
            props.cancel();
          }}
        >
          取消
        </Button>,
      ]}
      style={{ alignItems: 'center' }}
    >
      <Progress percent={percent} style={{ marginTop: 40 }} />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
          marginBottom: 40,
        }}
      >
        <span>{percentLabel}</span>
      </div>
    </Modal>
  );
};

export default ModalFromZipDownload;
