﻿/* *
 *
 * @author whiteshader@163.com
 * @datetime  2022/02/22
 *
 * */

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  /*{
    name: '首页',
    icon: 'DashboardFilled',
    path: '/home',
    component: '@/layouts/TabsLayout',
    hideChildrenInMenu: false,
    title: 'menu.dashboard.home',
    routes: [
      {
        path: '/home',
        component: 'dashboard/home/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.dashboard.home',
      },
    ],
  },*/
  {
    name: '首页',
    icon: 'DashboardFilled',
    path: '/home',
    component: '@/layouts/TabsLayout',
    hideChildrenInMenu: false,
    title: 'menu.dashboard.home',
    routes: [
      {
        path: '/home',
        component: 'dashboard/laboratory/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.dashboard.home',
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: 'center',
        icon: 'smile',
        path: '/account/center',
        component: './account/center',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.account.center',
      },
      {
        name: 'settings',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.account.settings',
      },
    ],
  },
  {
    name: 'system',
    icon: 'BugOutlined',
    path: '/system',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/system',
        redirect: '/system/user',
      },
      {
        name: 'user',
        icon: 'PartitionOutlined',
        path: '/system/user',
        component: 'system/user/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.user',
      },
      {
        name: 'menu',
        icon: 'PartitionOutlined',
        path: '/system/menu',
        component: 'system/menu/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.menu',
      },
      {
        name: 'role',
        icon: 'PartitionOutlined',
        path: '/system/role',
        component: 'system/role/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.role',
      },
      {
        name: 'dept',
        icon: 'PartitionOutlined',
        path: '/system/dept',
        component: 'system/dept/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.dept',
      },
      {
        name: 'post',
        icon: 'PartitionOutlined',
        path: '/system/post',
        component: 'system/post/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.post',
      },
      {
        name: 'dict',
        icon: 'PartitionOutlined',
        path: '/system/dict',
        component: 'system/dict/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.dict',
      },
      {
        name: 'dictData',
        icon: 'PartitionOutlined',
        path: '/system/dictData/index/:id?',
        component: 'system/dictData/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.dictData',
      },
      {
        name: 'config',
        icon: 'PartitionOutlined',
        path: '/system/config',
        component: 'system/config/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.config',
      },
      {
        name: 'notice',
        icon: 'PartitionOutlined',
        path: '/system/notice',
        component: 'system/notice/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.notice',
      },
      {
        name: 'log',
        icon: 'BugOutlined',
        path: '/system/log',
        component: '@/layouts/TabsLayout',
        routes: [
          {
            path: '/system/log',
            redirect: '/system/log/operlog',
          },
          {
            name: 'operlog',
            icon: 'PartitionOutlined',
            path: '/system/log/operlog',
            component: 'monitor/operlog/index',
            access: 'authorize',
            wrappers: ['@/components/KeepAlive'],
            KeepAlive: true,
            title: 'menu.title.operlog',
          },
          {
            name: 'loginInfo',
            icon: 'PartitionOutlined',
            path: '/system/log/logininfor',
            component: 'monitor/logininfor/index',
            access: 'authorize',
            wrappers: ['@/components/KeepAlive'],
            KeepAlive: true,
            title: 'menu.title.loginInfo',
          },
        ],
      },
    ],
  },
  {
    name: 'monitor',
    icon: 'BugOutlined',
    path: '/monitor',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/monitor',
        redirect: '/monitor/online',
      },
      {
        name: 'onlineUser',
        icon: 'PartitionOutlined',
        path: '/monitor/online',
        component: 'monitor/online',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.onlineUser',
      },
      {
        name: 'job',
        icon: 'PartitionOutlined',
        path: '/monitor/job',
        component: 'monitor/job',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.job',
      },
      {
        name: 'joblog',
        icon: 'PartitionOutlined',
        path: '/monitor/job-log/index/:jobId?',
        component: 'monitor/joblog',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.joblog',
      },
      {
        name: 'druid',
        icon: 'PartitionOutlined',
        path: '/monitor/druid',
        component: 'monitor/druid',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.druid',
      },
      {
        name: 'serverInfo',
        icon: 'PartitionOutlined',
        path: '/monitor/server',
        component: 'monitor/server',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.serverInfo',
      },
      {
        name: 'cacheInfo',
        icon: 'PartitionOutlined',
        path: '/monitor/cache',
        component: 'monitor/cache',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.cacheInfo',
      },
      {
        name: 'cacheList',
        icon: 'PartitionOutlined',
        path: '/monitor/cacheList',
        component: 'monitor/cacheList',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.cacheList',
      },
    ],
  },
  {
    name: '实时监控',
    icon: 'BugOutlined',
    path: '/monitoring',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/monitoring',
        redirect: '/monitoring/vehicle',
      },
      {
        name: '车辆实时监控',
        icon: 'PartitionOutlined',
        path: '/monitoring/vehicle',
        component: 'monitoring/vehicle/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.monitoring.vehicle',
      },
    ],
  },
  {
    name: '海康视频监控',
    icon: 'BugOutlined',
    path: '/video',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/video',
        redirect: '/video/play',
      },
      {
        name: '海康视频监控',
        icon: 'PartitionOutlined',
        path: '/video/play',
        component: 'video/VideoPlayer',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.video.play',
      },
    ],
  },
  {
    name: 'cars',
    icon: 'BugOutlined',
    path: '/cars',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/cars',
        redirect: '/cars/manager',
      },
      {
        name: 'carsManager',
        icon: 'PartitionOutlined',
        path: '/cars/manager',
        component: 'cars/manager/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.carsManager',
      },
    ],
  },
  {
    name: '车辆运营分析',
    icon: 'BugOutlined',
    path: '/operation',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/operation',
        redirect: '/operation/status',
      },
      {
        name: '车辆状态',
        icon: 'PartitionOutlined',
        path: '/operation/status',
        component: 'operation/status/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.operationStatus',
      },
      {
        name: '作业数据',
        icon: 'PartitionOutlined',
        path: '/operation/jobData',
        component: 'operation/jobData/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.operationJobData',
      },
      {
        name: '控制数据',
        icon: 'PartitionOutlined',
        path: '/operation/control',
        component: 'operation/control/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.operationControl',
      },
      {
        name: '感知决策数据',
        icon: 'PartitionOutlined',
        path: '/operation/perceive',
        component: 'operation/perceive/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.operationPerceive',
      },
      {
        name: '报警数据',
        icon: 'PartitionOutlined',
        path: '/operation/alarm',
        component: 'operation/alarm/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.operationAlarm',
      },
      {
        name: '对位数据',
        icon: 'PartitionOutlined',
        path: '/operation/counterPoint',
        component: 'operation/counterPoint/index',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.operationCounterPoint',
      },
    ],
  },
  {
    name: 'station',
    icon: 'BankOutlined',
    path: '/station',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/station',
        redirect: '/station/manager',
      },
      {
        name: 'stationManager',
        icon: 'PartitionOutlined',
        path: '/station/manager',
        component: 'station/manager/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.stationManager',
      },
      {
        name: 'stationallots',
        icon: 'PartitionOutlined',
        path: '/station/allots',
        component: 'station/allots/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.stationAllots',
      },
    ],
  },
  {
    name: 'versions',
    icon: 'BankOutlined',
    path: '/versions',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/versions',
        redirect: '/versions/upload',
      },
      {
        name: 'versionsUpload',
        icon: 'PartitionOutlined',
        path: '/versions/upload',
        component: 'versions/upload/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.versionsUpload',
      },
      {
        name: 'appversionRelease',
        icon: 'PartitionOutlined',
        path: '/versions/release',
        component: 'versions/release/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.versionsRelease',
      },
      {
        name: 'appversionRecords',
        icon: 'PartitionOutlined',
        path: '/versions/records',
        component: 'versions/records/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.versionsRecords',
      },
    ],
  },
  {
    name: 'dataClosedLoop',
    icon: 'BankOutlined',
    path: '/closedloop',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/closedloop',
        redirect: '/closedloop/rawdata',
      },
      {
        name: 'rawData',
        icon: 'PartitionOutlined',
        path: '/closedloop/rawdata',
        component: 'closedloop/rawdata/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.rawdata',
      },
      {
        name: 'dataSet',
        icon: 'PartitionOutlined',
        path: '/closedloop/dataset',
        component: 'closedloop/dataset/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.dataset',
      },
      {
        name: 'modelData',
        icon: 'PartitionOutlined',
        path: '/closedloop/model',
        component: 'closedloop/model/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.modeldata',
      },
      {
        name: 'mirrorData',
        icon: 'PartitionOutlined',
        path: '/closedloop/mirror',
        component: 'closedloop/mirror/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.mirrordata',
      },
      {
        name: 'label',
        icon: 'PartitionOutlined',
        path: '/closedloop/label',
        component: 'closedloop/label/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.labeldata',
      }
    ],
  },
  {
    name: 'tool',
    icon: 'BugOutlined',
    path: '/tool',
    component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/',
        redirect: '/tool/swagger',
      },
      {
        name: 'swagger',
        icon: 'PartitionOutlined',
        path: '/tool/swagger',
        component: 'tool/swagger',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.title.swagger',
      },
    ],
  },
  {
    path: '/',
    exact: true,
    redirect: '/home',
  },
];
