import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Drawer, Tree } from 'antd';
import { CloseOutlined, FolderFilled } from '@ant-design/icons';
import { DataNode } from 'antd/lib/tree';
import styles from '../style.less';
import { getDirList } from './server';

export type MoveFormProps = {
  selectData: any[];
  type: number;
  show?: boolean;
  onCancel: () => void;
  onSubmit: (directory: string) => void;
};

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

const DrawerFromMove: React.FC<MoveFormProps> = (props: MoveFormProps) => {
  const { type } = props;

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectDir, setSelectDir] = useState<string>('');

  const loadData = ({ key, children }: any) =>
  (
    new Promise<void>(async (resolve) => {
      if (children) {
        resolve();
        return;
      }

      const result = await getDirList(key, type);
      if (result && result.code === 200) {
        if (result.data && result.data.length > 0) {
          const dataChild = result.data.map((data1) => {
            return {
              title: <span className={styles.treeLabel}>{data1.fileName}</span>,
              key: data1.url,
              icon: <FolderFilled className={styles.treeIcon} />,
            }
          });

          setTreeData((origin: DataNode[]) => (
            updateTreeData(origin, key, dataChild)
          ));
        }
      }
      resolve();
    })
  );

  useEffect(() => {
    getDirList(null, type).then((result) => {
      if (result && result.code === 200) {
        if (result.data && result.data.length > 0) {
          setTreeData(result.data.map((data1) => {
            return {
              title: <span className={styles.treeLabel}>{data1.fileName}</span>,
              key: data1.url,
              icon: <FolderFilled className={styles.treeIcon} />,
            }
          }));
        }
      }
    });
  }, []);

  const handleOk = () => {
    props.onSubmit(selectDir);
  };

  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Drawer
      width={640}
      title={'移动到'}
      placement="right"
      closable={false}
      onClose={handleCancel}
      open={props.show}
      key="moveDrawer"
      footer={[
        <Button key="submit" type="primary" style={{ marginLeft: 30 }} onClick={handleOk}>
          确定
        </Button>,
        <Button key="back" style={{ marginLeft: 20 }} onClick={handleCancel}>
          取消
        </Button>,
      ]}
      extra={[<CloseOutlined key="closeUploadTask" onClick={handleCancel} />]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24} order={1}>
          <Tree
            showIcon
            defaultExpandAll
            treeData={treeData}
            loadData={loadData}
            blockNode
            onSelect={(keys: any) => {
              if (keys.length > 0) {
                setSelectDir(keys[0]);
              }
            }}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default DrawerFromMove;
