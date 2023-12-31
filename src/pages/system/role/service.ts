import { downLoadXlsx } from '@/utils/downloadfile';
import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { RoleType, RoleListParams } from './data.d';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

// 查询角色信息列表
export async function getRoleList(params?: RoleListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request(getUrl(`/api/system/role/list?${queryString}`), {
    data: params,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 查询角色信息详细
export function getRole(roleId: number) {
  return request(getUrl(`/api/system/role/${roleId}`), {
    method: 'GET',
  });
}

// 新增角色信息
export async function addRole(params: RoleType) {
  return request(getUrl('/api/system/role'), {
    method: 'POST',
    data: params,
  });
}

// 修改角色信息
export async function updateRole(params: RoleType) {
  return request(getUrl('/api/system/role'), {
    method: 'PUT',
    data: params,
  });
}

// 删除角色信息
export async function removeRole(ids: string) {
  return request(getUrl(`/api/system/role/${ids}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 导出角色信息
export async function exportRole(params?: RoleListParams) {
  return downLoadXlsx(
    getUrl(`/api/system/role/export`),
    { params },
    `role_${new Date().getTime()}.xlsx`,
  );
}

// 获取角色菜单列表
export function getRoleMenuList(id: number) {
  return request(getUrl(`/api/system/menu/roleMenuTreeselect/${id}`), {
    method: 'get',
  });
}
