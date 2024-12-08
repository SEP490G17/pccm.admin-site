import { Service, ServiceDTO, ServiceEditDTO, ServiceLog } from './../models/service.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleServiceData } from '../mock/service.mock';
import { PageParams, ServiceLogPageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
import agent from '../api/agent';
import _ from 'lodash';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { DefaultServiceText, ServiceMessage } from '../common/toastMessage/serviceMessage';
import { CommonMessage } from '../common/toastMessage/commonMessage';
import { store } from './store';
import { ServiceLogsMessage } from '../common/toastMessage/serviceLogsMessage';
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
  loadServices = async (toast: CreateToastFnReturn) => {
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
        toast(ServiceMessage.loadFailure());
      }
      if (res) {
        const { count, data } = res;
        data.forEach(this.setService);
        this.servicePageParams.totalElement = count;
      }
      this.loading = false;
    });
  };

  loadServicesLog = async (toast: CreateToastFnReturn) => {
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
        toast(ServiceLogsMessage.loadingFailure());
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

  createService = async (service: ServiceDTO, toast: CreateToastFnReturn) => {
    this.loading = true;
    const pending = toast(CommonMessage.loadingMessage(DefaultServiceText.create.title));
    const [err, res] = await catchErrorHandle(agent.Services.create(service));
    runInAction(() => {
      toast.close(pending);
      if (res) {
        toast(ServiceMessage.createSuccess());
        this.loadServices(toast);
        this.loadServicesLog(toast);
        if (store.courtClusterStore.selectedCourtCluster) {
          const oldSkip = store.courtClusterStore.servicesOfClusterRegistry.size;
          store.courtClusterStore.serviceCourtClusterPageParams.skip = 0;
          store.courtClusterStore.loadServicesOfCourtCluster(
            store.courtClusterStore.selectedCourtCluster?.id,
            toast,
          );
          store.courtClusterStore.serviceCourtClusterPageParams.skip = oldSkip+1;
        }
      }
      if (err) {
        toast(ServiceMessage.createFailure(err.response.data));
      }
      this.loading = false;
    });
  };

  detailService = async (serviceId: number, toast: CreateToastFnReturn) => {
    this.loadingEdit = true;
    const [err, res] = await catchErrorHandle(agent.Services.details(serviceId));
    runInAction(() => {
      if (res) {
        this.selectedService = res;
      }
      if (err) {
        toast(ServiceMessage.updateFailure());
      }
      this.loadingEdit = false;
    });
  };

  updateService = async (service: ServiceEditDTO, toast: CreateToastFnReturn) => {
    this.loading = true;
    const pending = toast(CommonMessage.loadingMessage(DefaultServiceText.update.title));
    const [err, res] = await catchErrorHandle(agent.Services.update(service));
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(ServiceMessage.updateFailure());
      }
      if (res) {
        toast(ServiceMessage.updateSuccess());
        store.courtClusterStore.servicesOfClusterRegistry.set(res.id, res);
        this.setService(res);
      }
      this.loading = false;
    });
  };

  deleteService = async (id: number, toast: CreateToastFnReturn) => {
    this.loading = true;
    const pending = toast(CommonMessage.loadingMessage(DefaultServiceText.delete.title));
    const [err, res] = await catchErrorHandle(agent.Services.delete(id));

    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(ServiceMessage.deleteFailure());
      }
      if (res) {
        toast(ServiceMessage.deleteSuccess());
        this.loadServicesLog(toast);
        this.serviceRegistry.delete(id);
        store.courtClusterStore.servicesOfClusterRegistry.delete(id);
      }
      this.loading = false;
    });
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

  setSearchTerm = async (term: string, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.serviceRegistry.clear();
    this.servicePageParams.clearLazyPage();
    this.servicePageParams.searchTerm = term;
    await this.loadServices(toast);
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setSearchLogTerm = async (term: string, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.cleanServiceLogCache();
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.searchTerm = term;
    await this.loadServicesLog(toast);
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setFilterTerm = async (term: string, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.cleanServiceCache();
    this.servicePageParams.clearLazyPage();
    this.servicePageParams.filter = term;
    await this.loadServices(toast);
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setFilterTermLog = async (term: string, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.cleanServiceLogCache();
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.filter = term;
    await this.loadServicesLog(toast);
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  filterLogByLogType = async (logTypeId: number, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.LogType = logTypeId;
    this.cleanServiceLogCache();
    await this.loadServicesLog(toast);
    runInAction(() => (this.loadingInitial = false));
  };

  filterLogByDate = async (
    date1: string | null,
    date2: string | null,
    toast: CreateToastFnReturn,
  ) => {
    this.loadingInitial = true;
    this.serviceLogPageParams.clearLazyPage();
    this.serviceLogPageParams.fromDate = date1 ?? null;
    this.serviceLogPageParams.toDate = date2 ?? null;
    this.cleanServiceLogCache();
    await this.loadServicesLog(toast);
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

  reset = () =>{
    this.serviceRegistry.clear();
    this.serviceLogRegistry.clear();

    this.servicePageParams.reset();
    this.serviceLogPageParams.reset();
  }
}
