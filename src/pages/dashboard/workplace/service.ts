import request from '@/utils/request';
import type { NoticeType, ActivitiesType, AnalysisData } from './data';
import { getUrl } from '@/utils/RequestUrl';

export async function queryProjectNotice(): Promise<{ data: NoticeType[] }> {
  return request(getUrl('/api/project/notice'));
}

export async function queryActivities(): Promise<{ data: ActivitiesType[] }> {
  return request(getUrl('/api/activities'));
}

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request(getUrl('/api/fake_workplace_chart_data'));
}
