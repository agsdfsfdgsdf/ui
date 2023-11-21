import { FC, useState } from 'react';
import { Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import SalesCard from './components/SalesCard';
import { useRequest } from 'umi';

import { getChartData } from './service';
import PageLoading from './components/PageLoading';
import type { HomeData } from './data.d';
import WrapContent from '@/components/WrapContent';
import CommonEntrances from './components/CommonEntrances';

type HomeProps = {
  HomeData: HomeData;
  loading: boolean;
};

const Home: FC<HomeProps> = () => {
  const [data, setData] = useState<HomeData>();

  const { loading } = useRequest(getChartData, {
    onSuccess: (data0: any) => {
      setData(data0);
    },
  });

  if (!data) return null;

  return (
    <WrapContent>
      <GridContent>
        <>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow
              loading={loading}
              mileage={data.mileage}
              vehicleCount={data.VehicleCount}
              runCount={data.RunCount}
              time={data.time}
            />
          </Suspense>

          <Suspense fallback={null}>
            <SalesCard
              speed={data.speed}
              online={data.online}
              warning={data.warning}
              loading={loading}
              callback={() => {}}
            />
          </Suspense>

          <Suspense fallback={null}>
            <CommonEntrances common={data.Common} loading={loading} />
          </Suspense>
        </>
      </GridContent>
    </WrapContent>
  );
};

export default Home;
