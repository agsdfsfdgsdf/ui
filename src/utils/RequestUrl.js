import DataConfig from '@/global/DataConfig';

let baseURL;
let vehicleBaseUrl;
let largeScreenUrl;
let dispatchBaseUrl;
let closureBaseUrl;
let otaBaseUrl;
let ossDownloadZipUrl;
let operationBaseUrl;

function loadBaseUrl() {
  const config = DataConfig.getConfig();
  if (config !== undefined && config.api !== undefined) {
    baseURL = config.api.platformBaseUrl;
    vehicleBaseUrl = config.api.vehicleTaskBaseUrl;
    largeScreenUrl = config.api.largeScreenUrl;
    dispatchBaseUrl = config.api.dispatchBaseUrl;
    otaBaseUrl = config.api.otaBaseUrl;
    closureBaseUrl = config.api.closureBaseUrl;
    ossDownloadZipUrl = config.api.fcDownloadZipUrl;
    operationBaseUrl = config.api.operationBaseUrl;
  }
}

function getLargeScreenUrl() {
  return largeScreenUrl;
}

function getDruidUrl() {
  loadBaseUrl();
  return baseURL + '/druid/login.html';
}

function getSwaggerUrl() {
  loadBaseUrl();
  return baseURL + '/swagger-ui/index.html';
}

function getOSSDownloadZipUrl() {
  loadBaseUrl();
  return ossDownloadZipUrl;
}

function getUrl(api) {
  loadBaseUrl();
  let url;
  let env = process.env.NODE_ENV;
  // if (env === 'production') {
  //   if (api.indexOf('/vehicle/') !== -1) {//
  //     url = vehicleBaseUrl + api.replace('/vehicle', '');
  //   } else if (api.indexOf('/dispatch/') !== -1) {
  //     url = dispatchBaseUrl + api.replace('/dispatch', '');
  //   } else if (api.indexOf('/ota/') !== -1) {
  //     url = otaBaseUrl + api.replace('/ota', '');
  //   } else if (api.indexOf('/api/') !== -1) {//
  //     url = baseURL + api.replace('/api', '');
  //   } else if (api.indexOf('/profile/avatar/') !== -1) {//
  //     url = baseURL + api;
  //   } else if (api.indexOf('/closure') !== -1) {
  //     url = closureBaseUrl + api.replace('/closure', '');
  //   } else if (api.indexOf('/operationApi') !== -1) {//
  //     url = operationBaseUrl + api.replace('/operationApi', '');
  //   } else {
  //     url = api;
  //   }
  // } else {
  //   url = api;
  // }
  url = api;
  return url;
}

export { getUrl, getDruidUrl, getSwaggerUrl, getLargeScreenUrl, getOSSDownloadZipUrl };
