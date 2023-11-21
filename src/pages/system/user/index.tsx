import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Row, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WrapContent from '@/components/WrapContent';
import Card from 'antd/es/card';
import type { UserType, UserListParams } from './data.d';
import {
  getUserList,
  getUser,
  removeUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
} from './service';
import UpdateForm from './components/edit';
import { getDict } from '../dict/service';
import ResetPwd from './components/ResetPwd';
import { getTreeList as getDeptTreeList } from '../dept/service';
import DeptTree from './components/DeptTree';
import type { DataNode } from 'antd/lib/tree';
import { getPostList } from '../post/service';
import { getRoleList } from '../role/service';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: UserType) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addUser({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: UserType) => {
  const hide = message.loading('正在配置');
  try {
    const resp = await updateUser(fields);
    hide();
    if (resp.code === 200) {
      message.success('配置成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: UserType[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await removeUser(selectedRows.map((row) => row.userId).join(','));
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

const handleRemoveOne = async (selectedRow: UserType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.userId];
    const resp = await removeUser(params.join(','));
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

/**
 * 导出数据
 *
 * @param id
 */
const handleExport = async () => {
  const hide = message.loading('正在导出');
  try {
    await exportUser();
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const UserTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [resetPwdModalVisible, setResetPwdModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<UserType>();
  const [selectedRowsState, setSelectedRows] = useState<UserType[]>([]);

  const [selectDept, setSelectDept] = useState<any>({ id: 0 });

  const [sexOptions, setSexOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  const [postIds, setPostIds] = useState<string[]>();
  const [postList, setPostList] = useState<string[]>();
  const [roleIds, setRoleIds] = useState<string[]>();
  const [roleList, setRoleList] = useState<string[]>();
  const [deptTree, setDeptTree] = useState<DataNode[]>();

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    setSelectDept({ id: 0 });
    getDict('sys_user_sex').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setSexOptions(opts);
      }
    });
    getDict('sys_normal_disable').then((res) => {
      if (res && res.code === 200) {
        const opts = {};
        res.data.forEach((item: any) => {
          opts[item.dictValue] = item.dictLabel;
        });
        setStatusOptions(opts);
      }
    });
    getDeptTreeList({ status: 0 }).then((treeData) => {
      setDeptTree(treeData);
    });
  }, []);

  let deptStr = '';
  function getDeptTitle(data: any, company: number) {
    data?.map((dept: any) => {
      if (dept.value === company) {
        deptStr = dept.title;
      } else {
        getDeptTitle(dept.children, company);
      }
    });
  }

  const columns: ProColumns<UserType>[] = [
    {
      title: <FormattedMessage id="system.User.user_id" defaultMessage="编号" />,
      dataIndex: 'userId',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.User.dept_id" defaultMessage="部门名称" />,
      //dataIndex: 'deptId',
      valueType: 'text',
      render: (_, record) => {
        console.log(deptTree);
        deptStr = '';
        getDeptTitle(deptTree, record.deptId);
        return <span>{deptStr}</span>;
      },
      hideInSearch: true,
    },
    // 左侧有部门选择，这里就取消部门查询条件了
    // {
    //   title: <FormattedMessage id="system.User.dept_id" defaultMessage="部门名称" />,
    //   dataIndex: 'deptId',
    //   hideInTable: true,
    //   renderFormItem: () => {
    //     return (
    //       // value 和 onchange 会通过 form 自动注入。
    //       <TreeSelect
    //         showSearch
    //         treeData={deptTree}
    //         treeDefaultExpandAll
    //         allowClear
    //         dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    //         placeholder="请选择部门名称"
    //         treeNodeFilterProp="title"
    //       />
    //     );
    //   },
    // },
    {
      title: <FormattedMessage id="system.User.user_name" defaultMessage="用户账号" />,
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.User.nick_name" defaultMessage="用户昵称" />,
      dataIndex: 'nickName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.User.email" defaultMessage="用户邮箱" />,
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.User.phonenumber" defaultMessage="手机号码" />,
      dataIndex: 'phonenumber',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.User.status" defaultMessage="帐号状态" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('system:user:edit')}
          onClick={() => {
            const fetchUserInfo = async (userId: number) => {
              const res = await getUser(userId);
              setPostIds(res.postIds);
              setPostList(
                res.posts.map((item: any) => {
                  return {
                    value: item.postId,
                    label: item.postName,
                  };
                }),
              );
              setRoleIds(res.roleIds);
              const rolesList1 = res.roles.map((item: any) => {
                return {
                  value: item.roleId,
                  label: item.roleName,
                };
              });
              setRoleList(rolesList1.filter((role) => role.value !== 1));
            };
            fetchUserInfo(record.userId);
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="编辑" />
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('system:user:remove') || record.userId === 1}
          onClick={async () => {
            if (record.userId === 1) {
              message.error('超级管理员无法删除！');
              return;
            }
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
        </Button>,
        <Button
          type="link"
          size="small"
          key="resetpwd"
          hidden={!access.hasPerms('system:user:resetPwd')}
          onClick={() => {
            setResetPwdModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="system.User.reset.password" defaultMessage="密码重置" />
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <Row gutter={[16, 24]}>
        <Col lg={6} md={24}>
          <Card>
            <DeptTree
              onSelect={async (value: any) => {
                setSelectDept(value);
                if (actionRef.current) {
                  formTableRef?.current?.submit();
                }
              }}
            />
          </Card>
        </Col>
        <Col lg={18} md={24}>
          <ProTable<UserType>
            headerTitle={intl.formatMessage({
              id: 'pages.searchTable.title',
              defaultMessage: '信息',
            })}
            actionRef={actionRef}
            formRef={formTableRef}
            rowKey="userId"
            key="userList"
            search={{
              labelWidth: 120,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="add"
                hidden={!access.hasPerms('system:user:add')}
                onClick={async () => {
                  if (selectDept.id === '' || selectDept.id == null) {
                    message.warning('请选择左侧父级节点');
                  } else {
                    getDeptTreeList({ status: 0 }).then((treeData) => {
                      setDeptTree(treeData);
                      setCurrentRow(undefined);
                      setModalVisible(true);
                    });
                    getPostList().then((res) => {
                      if (res && res.code === 200) {
                        setPostList(
                          res.rows.map((item: any) => {
                            return {
                              value: item.postId,
                              label: item.postName,
                            };
                          }),
                        );
                      }
                    });
                    getRoleList().then((res) => {
                      if (res && res.code === 200) {
                        const rolesList1 = res.rows.map((item: any) => {
                          return {
                            value: item.roleId,
                            label: item.roleName,
                          };
                        });
                        setRoleList(rolesList1.filter((role) => role.value !== 1));
                      }
                    });
                  }
                }}
              >
                <PlusOutlined />{' '}
                <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
              </Button>,
              <Button
                type="primary"
                key="remove"
                hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:user:remove')}
                onClick={async () => {
                  const success = await handleRemove(selectedRowsState);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                }}
              >
                <DeleteOutlined />
                <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
              </Button>,
              <Button
                type="primary"
                key="export"
                hidden={!access.hasPerms('system:user:export')}
                onClick={async () => {
                  handleExport();
                }}
              >
                <PlusOutlined />
                <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
              </Button>,
            ]}
            request={(params) =>
              getUserList({
                ...params,
                deptId: params.deptId ? params.deptId : selectDept.id,
              } as UserListParams).then((res) => {
                console.log(res.rows);
                return {
                  data: res.rows,
                  total: res.total,
                  success: true,
                };
              })
            }
            columns={columns}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </Col>
      </Row>
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            key="remove"
            hidden={!access.hasPerms('system:user:remove')}
            onClick={async () => {
              Modal.confirm({
                title: '删除',
                content: '确定删除该项吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const success = await handleRemove(selectedRowsState);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.userId) {
            success = await handleUpdate({ ...values } as UserType);
          } else {
            success = await handleAdd({ ...values } as UserType);
          }
          if (success) {
            setModalVisible(false);
            setCurrentRow(undefined);
            setPostIds([]);
            setRoleIds([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
          setPostIds([]);
          setRoleIds([]);
        }}
        visible={modalVisible}
        values={currentRow || {}}
        sexOptions={sexOptions}
        statusOptions={statusOptions}
        posts={postList || []}
        postIds={postIds || []}
        roles={roleList || []}
        roleIds={roleIds || []}
        depts={deptTree || []}
      />

      <ResetPwd
        onSubmit={async (value: any) => {
          const selectUser: UserType = value.user;
          selectUser.password = value.password;
          const result = await resetUserPwd({ ...selectUser });
          if (result && result.code === 200) {
            message.success('密码重置成功！');
          } else {
            message.success('密码重置失败！');
          }
          setResetPwdModalVisible(false);
          setSelectedRows([]);
          setCurrentRow(undefined);
        }}
        onCancel={() => {
          setResetPwdModalVisible(false);
          setSelectedRows([]);
          setCurrentRow(undefined);
        }}
        resetPwdModalVisible={resetPwdModalVisible}
        values={currentRow || {}}
      />
    </WrapContent>
  );
};

export default UserTableList;
