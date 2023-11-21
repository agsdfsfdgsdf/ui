import { useIntl } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Color } from '@antv/l7-react/lib/component/LayerAttribute';

const Footer = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '德创未来汽车科技有限公司',
  });

  const currentYear = new Date().getFullYear();

  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} />;
};

export default Footer;
