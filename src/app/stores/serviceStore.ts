import { Service, ServiceDTO, ServiceEditDTO, ServiceLog } from './../models/service.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleServiceData } from '../mock/service.mock';
import { PageParams, ServiceLogPageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import _ from 'lodash';
export default class ServiceStore {
  serviceRegistry = new Map<number, Service>();
  serviceLogRegistry = new Map<number, ServiceLog>();
  selectedService: Service | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  isOrigin: boolean = true;
  servicePageParams = new PageParams();
  serviceLogPageParams = new ServiceLogPageParams();
  cleanupInterval: number | undefined = undefined;
  loadingEdit: boolean = false;

  constructor() {
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanServiceCache, 30000);
  }

  //#region CRUD
  loadServices = async () => {
    this.loading = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.servicePageParams.skip ?? 0}`);
    queryParams.append('pageSize', `${this.servicePageParams.pageSize}`);
    if (this.servicePageParams.searchTerm) {
      queryParams.append('search', this.servicePageParams.searchTerm);
    }
    if (this.servicePageParams.filter) {
      queryParams.append('filter', this.servicePageParams.filter);
    }
    const [error, res] = await catchErrorHandle(agent.Services.list(`?${queryParams.toString()}`));
    runInAction(() => {
      if (error) {
        toast.error('Lấy danh sách dịch vụ thất bại');
      }
      if (res) {
        const { count, data } = res;
        data.forEach(this.setService);
        this.servicePageParams.totalElement = count;
      }
      this.loading = false;
    });
  };

  loadServicesLog = async () => {
    this.loading = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.serviceLogPageParams.skip ?? 0}`);
    queryParams.append('pageSize', `${this.serviceLogPageParams.pageSize}`);
    if (this.serviceLogPageParams.searchTerm) {
      queryParams.append('search', this.serviceLogPageParams.searchTerm);
    }
    if (this.serviceLogPageParams.filter) {
      queryParams.append('filter', this.serviceLogPageParams.filter);
    }
    if (this.serviceLogPageParams.LogType) {
      queryParams.append('logType', `${this.serviceLogPageParams.LogType}`);
    }
    if (this.serviceLogPageParams.fromDate != null) {
      queryParams.append('fromDate', this.serviceLogPageParams.fromDate);
    }
    if (this.serviceLogPageParams.toDate != null) {
      queryParams.append('toDate', this.serviceLogPageParams.toDate);
    }

    const [error, res] = await catchErrorHandle(
      agent.Services.listlogs(`?${queryParams.toString()}`),
    );
    runInAction(() => {
      if (error) {
        toast.error('Lấy danh sách dịch vụ thất bại');
      }
      if (res) {
        const { count, data } = res;
        data.forEach(this.setServiceLog);
        this.serviceLogPageParams.totalElement = count;
      }
      this.loading = false;
    });
  };

  //#endregion

  createService = async (service: ServiceDTO) => {
    this.loading = true;
    await runInAction(async () => {
      await agent.Services.create(service)
        .then(() => {
          this.loadServices();
          this.loadServicesLog();
          toast.success('Tạo dịch vụ thành công');
        })
        .catch((error) => {
          console.error('Error creating service:', error);
          toast.error('Tạo dịch vụ thất bại');
        })
        .finally(() => (this.loading = false));
    });
  };

  detailService = async (serviceId: number) => {
    this.loadingEdit = true;
    try {
      const data = await agent.Services.details(serviceId);
      runInAction(() => {
        this.selectedService = data;
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

  updateService = async (service: ServiceEditDTO) => {
    this.loading = true;
    try {
      if (this.selectedService?.id) {
        const newService = await agent.Services.update(service);
        this.serviceRegistry.delete(this.selectedService?.id);
        this.setService(newService);
        this.loadServicesLog();
        this.loading = false;
        toast.success('Cập nhật dịch vụ thành công');
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error updating banner:', error);
        toast.error('Cập nhật dịch vụ thất bại');
      });
    }
  };

  deleteService = async (id: number) => {
    this.loading = true;
    try {
      await agent.Services.delete(id);
      runInAction(() => {
        this.loadServicesLog();
        this.serviceRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error deleting news:', error);
      });
    }
  };

  //#region mock-up
  mockLoadServices = async () => {
    this.loading = true;
    try {
      sampleServiceData.forEach(this.setService);
      await sleep(1000);
      runInAction(() => {
        this.servicePageParams.totalPages = Math.ceil(
          this.serviceRegistry.size / this.servicePageParams.pageSize,
        );
        this.servicePageParams.totalElement = this.serviceRegistry.size;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading services:', error);
      });
    } finally {
      this.loading = false;
    }
  };
  //#endregion

  //#region common
  setLoadingInitial = (load: boolean) => {
    this.loadingInitial = load;
  };

  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    this.serviceRegistry.clear();
    this.servicePageParams.clearLazyPage();
    this.servicePageParams.searchTerm = term;
    await this.loadServices();
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setSearchLogTerm = async (term: string) => {
    this.loadingInitial = true;
    this.cleanServiceLogCache();
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.searchTerm = term;
    await this.loadServicesLog();
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setFilterTerm = async (term: string) => {
    this.loadingInitial = true;
    this.cleanServiceCache();
    this.servicePageParams.clearLazyPage();
    this.servicePageParams.filter = term;
    await this.loadServices();
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setFilterTermLog = async (term: string) => {
    this.loadingInitial = true;
    this.cleanServiceLogCache();
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.filter = term;
    await this.loadServicesLog();
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  filterLogByLogType = async (logTypeId: number) => {
    this.loadingInitial = true;
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.LogType = logTypeId;
    this.cleanServiceLogCache();
    await this.loadServicesLog();
    runInAction(() => (this.loadingInitial = false));
  };

  filterLogByDate = async (date1: string | null, date2: string | null) => {
    this.loadingInitial = true;
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.fromDate = date1 ?? null;
    this.serviceLogPageParams.toDate = date2 ?? null;
    this.cleanServiceLogCache();
    await this.loadServicesLog();
    runInAction(() => (this.loadingInitial = false));
  };

  get serviceArray() {
    return _.orderBy(Array.from(this.serviceRegistry.values()), ['id'], ['desc']);
  }

  get serviceLogArray() {
    return _.orderBy(Array.from(this.serviceLogRegistry.values()), ['id'], ['desc']);
  }

  //#region private methods
  setService = (service: Service) => {
    this.serviceRegistry.set(service.id, service);
  };

  setServiceLog = (service: ServiceLog) => {
    this.serviceLogRegistry.set(service.id, service);
  };

  cleanServiceCache = () => {
    runInAction(() => {
      this.serviceRegistry.clear();
    });
  };

  cleanServiceLogCache = () => {
    runInAction(() => {
      this.serviceLogRegistry.clear();
    });
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion
}
