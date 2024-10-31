import { makeAutoObservable, runInAction } from 'mobx';
import {
  CourtClusterStatisticDetails,
  FilterCourtClusterStatisticDetailsDTO,
} from '../models/details.models';
import agent from '../api/agent';

export default class revenueStore {
  loading: boolean = false;
  cleanupInterval: number | undefined = undefined;
  loadingStatistic: boolean = true;
  dataDetail: CourtClusterStatisticDetails | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  loadCourtClusterStatisticDetail = (data: FilterCourtClusterStatisticDetailsDTO) => {
    this.loadingStatistic = true;
    runInAction(async () => {
      try {
        this.dataDetail = await agent.Revenue.getrevenue(data);
      } catch (error) {
        console.error('Failed to load years:', error);
      } finally {
        this.loadingStatistic = false;
      }
    });
  };
}
