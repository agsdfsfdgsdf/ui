import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { getOssOption } from '../service';
import type { UploadFile } from 'antd/es/upload/interface';
import OssUpload from './lib';
import { ContentMD5 } from './lib/MD5Util';

interface OSSDataType {
  host: string;
  accessId: string;
  accessKey: string;
  dir: string;
}

interface AliyunOSSUploadProps {
  directory: string;
  openFileDialogOnClick: boolean;
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  onUploadProgress?: (percent: number) => void;
  onFileResult?: (md5: string, fileName: string, fileSize: number) => void;
}

const AliyunOSSUpload = ({
  directory,
  openFileDialogOnClick,
  value,
  onChange,
  onUploadProgress,
  onFileResult,
}: AliyunOSSUploadProps) => {
  const [OSSData, setOSSData] = useState<OSSDataType>();

  const init = async () => {
    try {
      const result = await getOssOption();
      if (result && result.code === 200) {
        const { endpoint, accessKeyId, secretAccessKey, bucketName } = result.data;
        console.log(endpoint, accessKeyId, secretAccessKey, bucketName);
        if (endpoint) {
          setOSSData({
            host: endpoint,
            accessId: accessKeyId,
            accessKey: secretAccessKey,
            dir: bucketName,
          });
          return;
        }
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    onChange?.(fileList);
  };

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url);

    if (onChange) {
      onChange(files);
    }
  };

  const getExtraData: UploadProps['data'] = () => ({
    host: OSSData?.host,
    accessId: OSSData?.accessId,
    accessKey: OSSData?.accessKey,
    dir: directory,
  });

  const customRequest = (options) => {
    const ossUpload = new OssUpload({
      accessId: options.data.accessId,
      accessKey: options.data.accessKey,
    });
    if (options.file) {
      try {
        ossUpload
          .upload({
            file: options.file,
            host: options.data.host,
            dirName: options.data.dir,
            selfName: true,
            limitSize: 1024 * 1024 * 1024 * 20,
            onProgress: (event) => {
              options.status = 'uploading';
              options.percent = parseInt((event.loaded / event.total) * 100 + '');
              options.onProgress({ percent: options.percent });
              onUploadProgress?.(options.percent);
            },
          })
          .then(() => {
            options.status = 'done';
            options.percent = 100;
            options.onSuccess(options.percent);
            onUploadProgress?.(options.percent);
          });
      } catch (e: any) {
        options.onError(e);
      }
    }
    console.log(options.file);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    fileList: value,
    maxCount: 1,
    onChange: handleChange,
    onRemove,
    openFileDialogOnClick: openFileDialogOnClick,
    data: getExtraData,
    beforeUpload(file) {
      console.log('beforeUpload');
      ContentMD5(file, (progress) => {
        console.log('md5 progress:', progress + '%');
      }).then((res) => {
        console.log(res);
        if (onFileResult) {
          onFileResult(res.conMd5, file.name, file.size);
        }
      });
    },
    customRequest,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>上传文件</Button>
    </Upload>
  );
};

export { AliyunOSSUpload };
