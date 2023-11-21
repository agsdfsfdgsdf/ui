import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  tabsLayout?: boolean;
} = {
  navTheme: 'dark',
  headerTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'side',
  splitMenus: false,
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: true,
  title: '',
  pwa: false,
  logo: '/images/menu_logo.png',
  iconfontUrl: '',
  tabsLayout: false,
  headerHeight: 68,
  menu:{
    locale: false,
  }
};

export default Settings;
