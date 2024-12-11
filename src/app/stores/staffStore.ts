import { Staff, StaffEdit } from './../models/staff.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleStaffData } from '../mock/staff.mock';
import { PageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
import _ from 'lodash';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { CreateStaffDTO, UpdateStaffDTO } from '../models/user.model';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { StaffMessage } from '../common/toastMessage/staffMessage';
export default class StaffStore {
  staffRegistry = new Map<number, Staff>();
  staffArray: Staff[] = [];
  selectedStaff: Staff | undefined = undefined;
  selectedStaffEdit: StaffEdit | undefined = undefined;
  loading: boolean = false;
  loadingEdit: boolean = false;
  loadingSearch: boolean = false;
  loadingInitial: boolean = false;
  staffPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;
  constructor() {
    this.staffPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanStaffCache, 30000);
  }

  loadStaffs = async () => {
    this.loading = true;
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
          this.staffPageParams.skip = this.staffRegistry.size;
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

  detailStaffEdit = async (staffId: number) => {
    this.loadingEdit = true;
    try {
      const data = await agent.Staffs.detailsEdit(staffId);
      runInAction(() => {
        this.selectedStaffEdit = data;
        this.loadingEdit = false;
      });
      return data;
    } catch (error) {
      runInAction(() => {
        this.loadingEdit = false;
        console.error('Error creating news:', error);
      });
    }
  };

  createStaff = async (
    staffData: CreateStaffDTO,
    onClose: () => void,
    toast: CreateToastFnReturn,
  ) => {
    this.loading = true;
    const [err, res] = await catchErrorHandle(agent.Account.createStaff(staffData));
    runInAction(() => {
      if (err) {
        toast(StaffMessage.createFailure(undefined, err));
      }
      if (res) {
        toast(StaffMessage.createSuccess());
        this.setStaff(res);
        onClose();
      }
      this.loading = false;
    });
    return { err, res };
  };

  updateStaff = async (
    staffData: UpdateStaffDTO,
    onClose: () => void,
    toast: CreateToastFnReturn,
  ) => {
    this.loading = true;
    const [err, res] = await catchErrorHandle(agent.Staffs.updateStaff(staffData));
    runInAction(() => {
      if (err) {
        toast(StaffMessage.updateFailure(undefined, err));
      }
      if (res) {
        toast(StaffMessage.updateSuccess());
        this.staffRegistry.set(res.id, res);
        this.setStaff(res);
        onClose();
      }
      this.loading = false;
    });
    return { err, res };
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
    this.loadingSearch = true;
    this.staffPageParams.searchTerm = term;
    this.cleanStaffCache();
    await this.loadStaffs();
    runInAction(() => (this.loadingSearch = false));
  };

  setCategoryTerm = async (term: string) => {
    this.loadingSearch = true;
    this.staffPageParams.filter = term;
    this.cleanStaffCache();
    await this.loadStaffs();
    runInAction(() => (this.loadingSearch = false));
  };

  get StaffArray() {
    return _.orderBy(Array.from(this.staffRegistry.values()), ['id'], ['desc']);
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
