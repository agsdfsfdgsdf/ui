import {getZipProgress, postZipDownload} from '@/pages/closedloop/upload/server';
import {DownZipFile, OSSInfoFull} from "./data";
import {BizFromUploadFile} from "@/pages/closedloop/upload/BizFromUploadFile";
import {message} from "antd";
import {getOSSDownloadZipUrl} from "@/utils/RequestUrl";
import request from "umi-request";
import {DataBus} from "data-dispatch";
import {DataTypeConfig} from "@/global/DataEventConfig";


const DownZipStatus = {
  WAITING: '准备中',
  COMPRESSING: '压缩中',
  COMPLETE: '压缩完成',
  FAILURE: '压缩失败',
  CANCEL: '取消压缩',
  DESTROY: '终止压缩',
} as const;

/**
 * 缓存列表
 */
let fileList: DownZipFile[] = [];
let endDownUnzipFile;

const endListMessage = () => {
  DataBus.push({
    type: DataTypeConfig.ACTION_DOWNZIP,
    data: fileList,
  });
}

/**
 * 更新进度
 * @param uids
 */
const updateProgress = async (uids: string[]) => {
  const result = await getZipProgress(uids);
  console.log('Result', result);
  if (result && result.code === 200) {
    if (result.data) {
      fileList = fileList.map((file) => {
        if(file.uid && file.zipStatus !== DownZipStatus.COMPLETE){
          const data = result.data[file.uid];
          if(data){
            file.rate = data.rate;
            file.fileCount = data.fileCount;
            file.zipCount = data.zipCount;
            if (file.rate === 100 && file.fileCount === file.zipCount) {
              file.zipStatus = DownZipStatus.COMPLETE;
            }
          }
        }
        return file;
      });
      console.log("Gunson", '进度刷新', fileList);
      endListMessage();
    }
  }
}

/**
 * 计时器
 */
let timer: NodeJS.Timer | undefined;
/**
 * 1.管理timer创建（timer不存在或已销毁重建）
 * 2.获取所有压缩进度
 * 3.通知界面更新状态
 */
const listeningProgress = () => {
  if(!timer){
    timer = setInterval(async () => {
      /**
       * 获取压缩中的数据
       */
      const uids = fileList.filter(file => file.zipStatus === DownZipStatus.COMPRESSING).map((file: DownZipFile) => {
        return file.uid;
      });

      if(!uids || uids.length === 0) {
        const uids1 = fileList.filter(file => file.zipStatus === DownZipStatus.WAITING).map((file: DownZipFile) => {
          return file.uid;
        });

        if(!uids1 || uids1.length === 0) {
          console.log('Gunson', "没有uids进度可更新，也未发现新数据,更新计时器取消")
          clearInterval(timer);
          timer = undefined;
          return;
        } else {
          while(uids.length < 1){
            const uid = uids1.pop();
            if(uid){
              uids.push(uid);
            }else{
              break;
            }
          }
        }
      }

      if(uids.length > 0) {
        await updateProgress(uids);
      } else {
        console.log('Gunson', "没有uids进度可更新,更新计时器取消")
        clearInterval(timer);
        timer = undefined;
        return;
      }
    }, 500);

  }
}

const postDownZip = async (file: DownZipFile, uid: string) => {
  return await postZipDownload({
    filepath: file.filepath,
    type: file.type,
    uid: uid,
  });
}

const downloadFile = async (file: DownZipFile) =>  {
  let hasCancel = false;
  fileList = fileList.map((fileDownZip) => {
    if (fileDownZip.uid === file.uid) {
      if (fileDownZip.zipStatus !== DownZipStatus.CANCEL) {
        fileDownZip.rate = 100;
        fileDownZip.rateDesc = '打包成功，下载结果请在浏览器下载页面查看';
        fileDownZip.zipStatus = DownZipStatus.COMPLETE;
        fileDownZip.requestControl = undefined;
      } else {
        hasCancel = true;
      }
    }
    return fileDownZip;
  });

  if (!hasCancel) {
    await BizFromUploadFile.download(`oss-zip/${file.fileName}`, file.fileName);
  }

  endListMessage();
}

const startDownZip = async (file: DownZipFile) => {
  const controller = new AbortController()
  const {signal} = controller;

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', '*/*');
  myHeaders.append('Connection', 'keep-alive');

  const oss = (await BizFromUploadFile.getOssOptions()) as OSSInfoFull;
  const bucket = oss?.data?.bucketName;
  if (!bucket) {
    message.error('获取文件信息失败！');
    fileList = fileList.map((fileDownZip) => {
      if(fileDownZip.uid === file.uid){
        fileDownZip.rate = 0;
        fileDownZip.rateDesc = '获取文件信息失败！';
        fileDownZip.zipStatus = DownZipStatus.FAILURE;
      }
      return fileDownZip;
    });
    endListMessage();
    return;
  }
  const url = getOSSDownloadZipUrl();
  let base_dir = '';
  if (file.filepath[0].indexOf('/') !== -1) {
    const splitArr = file.filepath[0].split('/');
    base_dir = file.filepath[0].replace(splitArr[splitArr.length - 2] + '/', '');
  }

  const body = JSON.stringify({
    bucket: bucket,
    uid: file.uid,
    'base-dir': base_dir,
    'source-dir': file.filepath.join(','),
    'dest-file': `oss-zip/${file.fileName}`,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: body,
    signal
  };

  request(url, requestOptions)
    .then(async (result) => {
      await downloadFile(file);
    })
    .catch(async (error) => {
      await downloadFile(file);
    });

  fileList = fileList.map((fileDownZip) => {
    if(fileDownZip.uid === file.uid){
      fileDownZip.zipStatus = DownZipStatus.COMPRESSING;
      fileDownZip.requestControl = controller;
      fileDownZip.rate = 0;
      fileDownZip.rateDesc = '打包中...';
    }
    return fileDownZip;
  });

  listeningProgress();
}

const cancelDownZip = (file?: DownZipFile) => {
  let file1 = file;
  if(!file1) {
    file1 = endDownUnzipFile;
  }
  if(!file1 || !file1.uid) {
    message.error('取消失败！');
    return;
  }
  if(file1.requestControl) {
    file1.requestControl.abort('取消打包！');
    fileList = fileList.map((fileDownZip) => {
      if(file1 && fileDownZip.uid === file1.uid){
        fileDownZip.rate = 0;
        fileDownZip.zipCount = 0;
        fileDownZip.rateDesc = '已取消';
        fileDownZip.zipStatus = DownZipStatus.CANCEL;
        fileDownZip.requestControl = undefined;
      }
      return fileDownZip;
    });
  }

}

const removeDownZip = (file: DownZipFile) => {
  fileList = fileList.filter((file1) => file1.uid !== file.uid);
}


const BizFromDownZipFile = {
  /**
   * 添加压在压缩文件，并缓存
   * @param file
   */
  putFileList: async (file: DownZipFile) => {
    file.zipStatus = DownZipStatus.WAITING;
    const uid = file.fileName + '_' + Date.now();
    const result = await postDownZip(file, uid);
    if (result && result.code === 200) {
      file.uid = uid;
      file.rate = 0;
      file.rateDesc = '等待压缩...';
      fileList.push(file);
      endDownUnzipFile = file;

      endListMessage();
      if(fileList.filter((downZipFile) => downZipFile.zipStatus === DownZipStatus.COMPRESSING).length < 1){
        await startDownZip(file);
      }
      return true;
    } else {
      endListMessage();
      if(fileList.filter((downZipFile) => downZipFile.zipStatus === DownZipStatus.COMPRESSING).length < 1){
        await startDownZip(file);
      }
      return false;
    }
  },
  getFileList: (type: number = 1) => {
    return fileList.filter((file) => file.type === type);
  },
  getCurrentFile: () => {
    const endFile = fileList.filter((file) => file.uid === endDownUnzipFile.uid);
    if(endFile && endFile[0]){
      return endFile[0];
    }
    return undefined;
  },
  cancelDownZip: cancelDownZip,
  removeDownZip: removeDownZip,
};

export {BizFromDownZipFile, DownZipStatus};
