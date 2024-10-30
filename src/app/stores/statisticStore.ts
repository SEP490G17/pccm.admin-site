import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { DataTotal, FilterData, FilterDataDTO } from '../models/filter.model';

export default class StatisticStore {
  loadingData: boolean = false;
  loadingDataFilter: boolean = false;
  years: number[] = [];
  dataFilter: FilterData[] = [];
  dataTotal: DataTotal | undefined = undefined;
  loadingDataTotal: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingData = (loading: boolean) => {
    this.loadingData = loading;
  };

  setLoadingDataFilter = (loading: boolean) => {
    this.loadingDataFilter = loading;
  };

  setLoadingDataTotal = (loading: boolean) => {
    this.loadingDataTotal = loading;
  };

  loadYears = async () => {
    this.loadingDataFilter = true;
    await runInAction(async () => {
      try {
        this.years = await agent.Statistic.years();
      } finally {
        this.loadingDataFilter = false;
      }
    });
  };

  loadDataFilter = async (filterData: FilterDataDTO) => {
    this.loadingData = true;
    await runInAction(async () => {
      try {
        await agent.Statistic.getincome(filterData).then((values) => (this.dataFilter = values));
      } finally {
        this.loadingData = false;
      }
    });
  };

  loadDataTotal = async () => {
    this.loadingDataTotal = true;
    await runInAction(async () => {
      try {
        await agent.Statistic.count().then((values) => (this.dataTotal = values));
      } finally {
        this.loadingDataTotal = false;
      }
    });
  };
}
