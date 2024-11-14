import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { DataExpend, DataTop, DataTotal, FilterData, FilterDataDTO } from '../models/statistic.model';
import { BookingRecent } from '../models/booking.model';

export default class StatisticStore {
  loadingData: boolean = false;
  loadingDataFilter: boolean = false;
  years: number[] = [];
  dataFilter: FilterData[] = [];
  dataTotal: DataTotal | undefined = undefined;
  dataTop: DataTop | undefined = undefined;
  dataExpense: DataExpend | undefined = undefined;
  loadingDataTotal: boolean = false;
  loadingBookingRecent: boolean = false;
  bookingRecent: BookingRecent[] | undefined = undefined;

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
      } catch (error) {
        console.error('Failed to load years:', error);
      } finally {
        this.loadingDataFilter = false;
      }
    });
  };

  loadDataFilter = async (filterData: FilterDataDTO) => {
    this.loadingData = true;
    await runInAction(async () => {
      try {
        this.dataFilter = await agent.Statistic.getincome(filterData);
      } catch (error) {
        console.error('Failed to load filtered data:', error);
      } finally {
        this.loadingData = false;
      }
    });
  };

  loadDataTotal = async () => {
    this.loadingDataTotal = true;
    await runInAction(async () => {
      try {
        this.dataTotal = await agent.Statistic.count();
      } catch (error) {
        console.error('Failed to load total data:', error);
      } finally {
        this.loadingDataTotal = false;
      }
    });
  };

  loadExpense = async (filterData: FilterDataDTO) => {
    this.loadingDataTotal = true;
    await runInAction(async () => {
      try {
        this.dataExpense = await agent.Statistic.expense(filterData);
      } catch (error) {
        console.error('Failed to load total data:', error);
      } finally {
        this.loadingDataTotal = false;
      }
    });
  };

  loadTop = async (filterData: FilterDataDTO) => {
    this.loadingDataTotal = true;
    await runInAction(async () => {
      try {
        this.dataTop = await agent.Statistic.top(filterData);
      } catch (error) {
        console.error('Failed to load total data:', error);
      } finally {
        this.loadingDataTotal = false;
      }
    });
  };

  getBookingRecent = async () => {
    this.loadingBookingRecent = true;
    await runInAction(async () => {
      try {
        this.bookingRecent = await agent.Statistic.bookingRecent();
      } catch (error) {
        console.error('Failed to load total data:', error);
      } finally {
        this.loadingBookingRecent = false;
      }
    });
  };
}
