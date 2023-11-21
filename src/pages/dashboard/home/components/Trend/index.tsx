import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export type TrendProps = {
  colorful?: boolean;
  flag: 'up' | 'down';
  style?: React.CSSProperties;
  title: string;
  reverseColor?: boolean;
  className?: string;
};

const Trend: React.FC<TrendProps> = ({
  colorful = true,
  reverseColor = false,
  flag,
  title,
  children,
  className,
  ...rest
}) => {
  const classString = classNames(
    styles.trendItem,
    {
      [styles.trendItemGrey]: !colorful,
      [styles.reverseColor]: reverseColor && colorful,
    },
    className,
  );
  return (
    <div {...rest} className={classString} title={typeof children === 'string' ? children : ''}>
      {title && <span className={styles.title}>{title}</span>}
      {flag && (
        <span className={styles[flag]}>
          {flag === 'up' ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </span>
      )}
      <span className={styles[flag]}>{children}</span>
    </div>
  );
};

export default Trend;
