import { Staff } from './../models/staff.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleStaffData } from '../mock/staff.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
// import _ from 'lodash';
import agent from '../api/agent';
export default class StaffStore {
  staffRegistry = new Map<number, Staff>();
  staffArray: Staff[] = [];
  selectedStaff: Staff | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  staffPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;
  constructor() {
    console.log('Staff store initialized');
    this.staffPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanStaffCache, 30000);
  }

  loadStaffs = async () => {
    this.loadingInitial = true;
    await runInAction(async () => {
      await agent.Staffs.list().then((staffs) => staffs.data.forEach(this.setStaff));
      this.loadingInitial = false;
    });
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
  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin staff store');
      this.staffPageParams.searchTerm = term;
      this.cleanStaffCache();

      console.log('term:', term);
    });
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
      console.log('cleanStaffCache');
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
