import { Staff } from './../models/staff.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleStaffData } from '../mock/staff.mock';
import { PageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
// import _ from 'lodash';
import agent from '../api/agent';
import { toast } from 'react-toastify';
export default class StaffStore {
  staffRegistry = new Map<number, Staff>();
  staffArray: Staff[] = [];
  selectedStaff: Staff | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  staffPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;
  constructor() {
    this.staffPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanStaffCache, 30000);
  }

  loadStaffs = async () => {
    this.loadingInitial = true;
    await runInAction(async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.staffPageParams.skip ?? 0}`);
      queryParams.append('pageSize', `${this.staffPageParams.pageSize}`);
      if (this.staffPageParams.searchTerm) {
        queryParams.append('search', this.staffPageParams.searchTerm);
      }
      if (this.staffPageParams.filter) {
        queryParams.append('filter', this.staffPageParams.filter);
      }
      const [error, res] = await catchErrorHandle(agent.Staffs.list(`?${queryParams.toString()}`));
      runInAction(() => {
        if (error) {
          toast.error('Lấy danh sách nhân thất bại');
        }
        if (res) {
          const { count, data } = res;
          data.forEach(this.setStaff);
          this.staffPageParams.totalElement = count;
        }
        this.loading = false;
      });
    });
  };

  detailStaff = async (staffId: number) => {
    this.loading = true;
    try {
      const data = await agent.Staffs.details(staffId);
      runInAction(() => {
        this.selectedStaff = data;
        this.loading = false;
      });
      return data;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error creating news:', error);
      });
    }
  };

  //#region mock-up
  mockLoadStaffs = async () => {
    this.loading = true;
    try {
      sampleStaffData.forEach(this.setStaff);
      await sleep(1000);
      runInAction(() => {
        this.staffPageParams.totalPages = Math.ceil(
          this.staffRegistry.size / this.staffPageParams.pageSize,
        );
        this.staffPageParams.totalElement = this.staffRegistry.size;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading staffs:', error);
      });
    } finally {
      this.loading = false;
    }
  };
  //#endregion

  //#region common
  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    this.staffPageParams.searchTerm = term;
    this.cleanStaffCache();
    await this.loadStaffs();
    runInAction(() => (this.loadingInitial = false));
  };

  setCategoryTerm = async (term: string) => {
    this.loadingInitial = true;
    this.staffPageParams.filter = term;
    this.cleanStaffCache();
    await this.loadStaffs();
    runInAction(() => (this.loadingInitial = false));
  };

  get StaffArray() {
    return Array.from(this.staffRegistry.values());
  }

  //#region private methods
  private setStaff = (staff: Staff) => {
    this.staffRegistry.set(staff.id, staff);
  };

  private cleanStaffCache = () => {
    runInAction(() => {
      this.staffRegistry.clear();
    });
  };

  setLoadingInitial = (load: boolean) => {
    runInAction(() => {
      this.loadingInitial = load;
    });
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion
}
