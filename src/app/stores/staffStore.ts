import { Staff } from './../models/staff.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleStaffData } from '../mock/staff.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import _ from 'lodash';
export default class StaffStore {
  staffRegistry = new Map<number, Staff>();
  staffArray: Staff[] = [];
  selectedStaff: Staff | undefined = undefined;
  loading: boolean = false;
  staffPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('Staff store initialized');
    this.staffPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanStaffCache, 30000);
  }

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
        this.loadStaffArray();
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
      this.loadStaffArray();
      console.log('term:', term);
    });
  };

  setCurrentPage = (pageIndex: number) => {
    runInAction(() => {
      this.staffPageParams.pageIndex = pageIndex;
      this.loadStaffArray();
    });
  };

  setPageSize = (size: number) => {
    runInAction(() => {
      this.staffPageParams.pageSize = size;
      this.staffPageParams.pageIndex = 1; 
      this.loadStaffArray();
    });
  };

  loadStaffArray = async () => {
    const { pageSize, pageIndex, totalElement, searchTerm = '' } = this.staffPageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (
      pageSize * pageIndex > this.staffRegistry.size &&
      this.staffRegistry.size < totalElement!
    ) {
      await this.mockLoadStaffs();
    }
    this.staffArray = Array.from(this.staffRegistry.values())
    .filter(s => _.includes(s.name, searchTerm) 
        || _.includes(s.phoneNumber, searchTerm)
        || _.includes(s.identityCard,searchTerm))
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

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

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion
}
