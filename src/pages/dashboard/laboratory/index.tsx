import { FC, useEffect, useState } from 'react';
import { Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import SalesCard from './components/SalesCard';
import PageLoading from './components/PageLoading';
import type { HomeData } from './data.d';
import WrapContent from '@/components/WrapContent';
import CommonEntrances from './components/CommonEntrances';
import SocketDXController from '@/global/SocketDXController';
import DataConfig from '@/global/DataConfig';
import { DataBus } from 'data-dispatch';
import { DataTypeConfig } from '@/global/DataEventConfig';
import { MonitoringHomeBiz } from '@/global/MonitoringBiz';
import { HomeDxData } from '@/global/base/HomeDxData';

type HomeProps = {
  HomeData: HomeData;
  loading: boolean;
};

const Home: FC<HomeProps> = () => {
  const config = DataConfig.getConfig();

  const [data, setData] = useState<HomeDxData>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    SocketDXController.init(config.webSocketTaskURL, (index, connect) => {
      console.log('websocket', index, connect);
    });

    MonitoringHomeBiz.startRefresh();

    const homeData = MonitoringHomeBiz.getHomeData();
    if (homeData) {
      if (loading) {
        setLoading(false);
      }
      setData(homeData);
    }

    return () => {
      MonitoringHomeBiz.stopRefresh();
      DataBus.destroy(DataTypeConfig.ACTION_DaX_HOME);
    };
  }, []);

  return (
    <WrapContent>
      <GridContent>
        <>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow
              loading={loading}
              mileage={data?.mileage}
              box={data?.box}
              runTime={data?.runTime}
              avgSpeed={data?.avgSpeed}
            />
          </Suspense>

          <Suspense fallback={null}>
            <SalesCard loading={loading} />
          </Suspense>

          <Suspense fallback={null}>
            <CommonEntrances loading={loading} />
          </Suspense>
        </>
      </GridContent>
    </WrapContent>
  );
};

export default Home;
