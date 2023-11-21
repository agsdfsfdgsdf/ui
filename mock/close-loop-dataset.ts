import { Request, Response } from 'express';

interface DataSet {
  id?: number;
  collect?: string;
  parent?: string;
  fileName?: string;
  url?: string;
  type?: string;
  marking?: number;
  creator?: string;
  updateTime?: string;
}

const dataSets: DataSet[] = [];

function loadData() {
  const dataSet: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: '大榭',
    url: '大榭',
    parent: '0',
    type: 'dir',
    marking: 0,
    creator: 'admin',
    updateTime: '2022-12-20 19:32:09',
  };
  dataSets.push(dataSet);
  const dataSet10: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2002',
    url: '大榭/BBI_1000928377366_2002',
    parent: '大榭',
    type: 'dir',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet10);
  const dataSet11: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2003',
    url: '大榭/BBI_1000928377366_2003',
    parent: '大榭',
    type: 'dir',
    marking: 0,
    updateTime: '2022-12-20 19:32:00',
  };
  dataSets.push(dataSet11);
  const dataSet12: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2004',
    url: '大榭/BBI_1000928377366_2004',
    parent: '大榭',
    type: 'dir',
    marking: 0,
    updateTime: '2022-12-20 19:32:00',
  };
  dataSets.push(dataSet12);
  const dataSet100: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2002_aa.jpg',
    url: '大榭/BBI_1000928377366_2002/BBI_1000928377366_2002_aa.jpg',
    parent: '大榭/BBI_1000928377366_2002',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet100);
  const dataSet101: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2002_ab.jpg',
    url: '大榭/BBI_1000928377366_2002/BBI_1000928377366_2002_ab.jpg',
    parent: '大榭/BBI_1000928377366_2002',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet101);
  const dataSet102: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2002_ac.jpg',
    url: '大榭/BBI_1000928377366_2002/BBI_1000928377366_2002_ac.jpg',
    parent: '大榭/BBI_1000928377366_2002',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet102);
  const dataSet110: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2003_aa.jpg',
    url: '大榭/BBI_1000928377366_2003/BBI_1000928377366_2003_aa.jpg',
    parent: '大榭/BBI_1000928377366_2003',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet110);
  const dataSet111: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2003_ab.jpg',
    url: '大榭/BBI_1000928377366_2003/BBI_1000928377366_2003_ab.jpg',
    parent: '大榭/BBI_1000928377366_2003',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet111);
  const dataSet112: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2003_ac.jpg',
    url: '大榭/BBI_1000928377366_2003/BBI_1000928377366_2003_ac.jpg',
    parent: '大榭/BBI_1000928377366_2003',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet112);
  const dataSet120: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2004_aa.jpg',
    url: '大榭/BBI_1000928377366_2004/BBI_1000928377366_2004_aa.jpg',
    parent: '大榭/BBI_1000928377366_2004',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet120);
  const dataSet121: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2004_ab.jpg',
    url: '大榭/BBI_1000928377366_2004/BBI_1000928377366_2004_ab.jpg',
    parent: '大榭/BBI_1000928377366_2004',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet121);
  const dataSet122: DataSet = {
    id: 0,
    collect: '大榭',
    fileName: 'BBI_1000928377366_2004_ac.jpg',
    url: '大榭/BBI_1000928377366_2004/BBI_1000928377366_2004_ac.jpg',
    parent: '大榭/BBI_1000928377366_2004',
    type: 'jpg',
    marking: 0,
    updateTime: '2022-12-20 19:35:09',
  };
  dataSets.push(dataSet122);
}

function getDataSetList(req: Request, res: Response) {
  if (dataSets.length === 0) {
    loadData();
  }

  const parent = req.query?.parent + '';

  let rawDataList;
  if (parent) {
    rawDataList = dataSets.filter((rawData) => rawData.parent === parent);
  } else {
    rawDataList = dataSets.filter((rawData) => rawData.parent === '0');
  }

  res.send({
    code: 200,
    msg: 'success',
    rows: rawDataList,
    totle: 300,
  });
}

export default {
  // 'GET /closure/data-set': getDataSetList,
};
