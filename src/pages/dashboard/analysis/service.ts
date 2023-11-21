import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';
import type { AnalysisData } from './data';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request(getUrl('/api/fake_analysis_chart_data'));
}
