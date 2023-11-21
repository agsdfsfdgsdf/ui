import { Card } from 'antd';
import type { CardProps } from 'antd/es/card';
import React from 'react';
import styles from './index.less';

type totalType = () => React.ReactNode;

const renderTotal = (total?: number | totalType | React.ReactNode) => {
  if (!total && total !== 0) {
    return null;
  }
  let totalDom;
  switch (typeof total) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
      totalDom = <div className={styles.total}>{total()}</div>;
      break;
    default:
      totalDom = <div className={styles.total}>{total}</div>;
  }
  return totalDom;
};

export type ChartCardProps = {
  title: React.ReactNode;
  action?: React.ReactNode;
  total?: React.ReactNode | number | (() => React.ReactNode | number);
  footer?: React.ReactNode;
  contentHeight?: number;
  avatar?: string;
  label?: string;
  style?: React.CSSProperties;
} & CardProps;

class ChartCard extends React.Component<ChartCardProps> {
  renderContent = () => {
    const { contentHeight, title, avatar, label, total, children, loading } = this.props;
    if (loading) {
      return false;
    }
    return (
      <div className={styles.chartCard}>
        <div className={styles.chartCardTop}>
          {avatar && <img src={avatar} />}
          {label && <span>{label}</span>}
        </div>

        <div className={styles.chartCardValue}>{renderTotal(total)}</div>

        <div className={styles.chartCardTitle}>
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.chartCardFooter}>
          {children && (
            <div className={styles.content} style={{ height: contentHeight || 'auto' }}>
              <div className={contentHeight && styles.contentFixed}>{children}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const {
      loading = false,
      contentHeight,
      title,
      avatar,
      action,
      total,
      footer,
      children,
      ...rest
    } = this.props;
    return (
      <Card loading={loading} bodyStyle={{ padding: '20px 24px 8px 24px' }} {...rest}>
        {this.renderContent()}
      </Card>
    );
  }
}

export default ChartCard;
