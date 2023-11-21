import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { TaskListParams } from './data.d';
import { TaskAllot } from './data';

export async function getConfig() {
  return request(getUrl(`/config.json`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询任务信息列表
export async function getTaskList(params?: TaskListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/dispatch/task/list?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询任务详细信息列表
export async function getTaskDetail() {
  return request(getUrl(`/dispatch/task/task-list`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 新增任务信息
export async function addTask(params: TaskAllot) {
  return request(getUrl('/dispatch/task/add'), {
    method: 'POST',
    data: params,
  });
}

// 删除任务信息
export async function removeTask(vin: string) {
  return request(getUrl(`/dispatch/task/delete/${vin}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
