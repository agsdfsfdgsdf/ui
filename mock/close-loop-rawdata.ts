import { Request, Response } from 'express';

interface RawData {
  id?: number;
  project?: string;
  vin?: string;
  fileName?: string;
  parent?: string;
  url?: string;
  type?: string;
  size?: number;
  marking?: number;
  label?: Object;
  creator?: string;
  createTime?: string;
  updateTime?: string;
}

const rawDatas: RawData[] = [];

function loadData() {
  const rawdata: RawData = {
    id: 0,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: '大榭',
    url: '大榭',
    parent: '0',
    type: 'dir',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:02',
    updateTime: '2022-12-20 19:32:09',
  };
  rawDatas.push(rawdata);
  const rawdata10: RawData = {
    id: 1,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2002',
    url: '大榭/BBI_1000928377366_2002',
    parent: '大榭',
    type: 'dir',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata10);
  const rawdata11: RawData = {
    id: 2,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2003',
    url: '大榭/BBI_1000928377366_2003',
    parent: '大榭',
    type: 'dir',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:58:02',
    updateTime: '2022-12-20 19:32:00',
  };
  rawDatas.push(rawdata11);
  const rawdata12: RawData = {
    id: 3,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2004',
    url: '大榭/BBI_1000928377366_2004',
    parent: '大榭',
    type: 'dir',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:58:02',
    updateTime: '2022-12-20 19:32:00',
  };
  rawDatas.push(rawdata12);
  const rawdata100: RawData = {
    id: 4,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2002_aa.jpg',
    url: '大榭/BBI_1000928377366_2002/BBI_1000928377366_2002_aa.jpg',
    parent: '大榭/BBI_1000928377366_2002',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata100);
  const rawdata101: RawData = {
    id: 5,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2002_ab.jpg',
    url: '大榭/BBI_1000928377366_2002/BBI_1000928377366_2002_ab.jpg',
    parent: '大榭/BBI_1000928377366_2002',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata101);
  const rawdata102: RawData = {
    id: 6,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2002_ac.jpg',
    url: '大榭/BBI_1000928377366_2002/BBI_1000928377366_2002_ac.jpg',
    parent: '大榭/BBI_1000928377366_2002',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata102);
  const rawdata110: RawData = {
    id: 7,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2003_aa.jpg',
    url: '大榭/BBI_1000928377366_2003/BBI_1000928377366_2003_aa.jpg',
    parent: '大榭/BBI_1000928377366_2003',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata110);
  const rawdata111: RawData = {
    id: 8,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2003_ab.jpg',
    url: '大榭/BBI_1000928377366_2003/BBI_1000928377366_2003_ab.jpg',
    parent: '大榭/BBI_1000928377366_2003',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata111);
  const rawdata112: RawData = {
    id: 9,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2003_ac.jpg',
    url: '大榭/BBI_1000928377366_2003/BBI_1000928377366_2003_ac.jpg',
    parent: '大榭/BBI_1000928377366_2003',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata112);
  const rawdata120: RawData = {
    id: 10,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2004_aa.jpg',
    url: '大榭/BBI_1000928377366_2004/BBI_1000928377366_2004_aa.jpg',
    parent: '大榭/BBI_1000928377366_2004',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata120);
  const rawdata121: RawData = {
    id: 11,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2004_ab.jpg',
    url: '大榭/BBI_1000928377366_2004/BBI_1000928377366_2004_ab.jpg',
    parent: '大榭/BBI_1000928377366_2004',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata121);
  const rawdata122: RawData = {
    id: 12,
    project: '大榭',
    vin: 'JQ8829636',
    fileName: 'BBI_1000928377366_2004_ac.jpg',
    url: '大榭/BBI_1000928377366_2004/BBI_1000928377366_2004_ac.jpg',
    parent: '大榭/BBI_1000928377366_2004',
    type: 'jpg',
    size: Math.floor(Math.random() * 1000000000),
    marking: 0,
    createTime: '2022-12-20 18:52:28',
    updateTime: '2022-12-20 19:35:09',
  };
  rawDatas.push(rawdata122);
}

function getRawDataList(req: Request, res: Response) {
  if (rawDatas.length === 0) {
    loadData();
  }

  const parent = req.query?.parent + '';

  let rawDataList;
  if (parent) {
    rawDataList = rawDatas.filter((rawData) => rawData.parent === parent);
  } else {
    rawDataList = rawDatas.filter(
      (rawData) =>
        rawData.parent === undefined ||
        rawData.parent === null ||
        rawData.parent === '0' ||
        rawData.parent === '',
    );
  }

  res.send({
    code: 200,
    msg: 'success',
    rows: rawDataList,
    totle: 300,
  });
}

export default {
  // 'GET /closure/source-file': getRawDataList,
};
