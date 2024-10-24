import { Service } from './../models/service.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleServiceData } from '../mock/service.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import agent from '../api/agent';
import { toast } from 'react-toastify';
export default class ServiceStore {
  serviceRegistry = new Map<number, Service>();
  selectedService: Service | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  isOrigin: boolean = true;
  servicePageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('Service store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanServiceCache, 30000);
  }

  //#region CRUD
  loadServices = async () => {
    this.loading = true;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.servicePageParams.skip ?? 0}`);
      queryParams.append('pageSize', `${this.servicePageParams.pageSize}`);
      if (this.servicePageParams.searchTerm) {
        queryParams.append('search', this.servicePageParams.searchTerm);
      }
      const { count, data } = await agent.Services.list(`?${queryParams.toString()}`);
      runInAction(() => {
        data.forEach(this.setService);

        this.servicePageParams.totalElement = count;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.log(error);
        toast.error('Error loading services');
      });
    }
  };
  //#endregion

  deleteService = async (id: number) => {
    this.loading = true;
    try {
      await agent.Services.delete(id);
      runInAction(() => {
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
    await runInAction(async () => {
      this.serviceRegistry.clear();
      this.servicePageParams.clearLazyPage();
      this.servicePageParams.searchTerm = term;
      await this.loadServices();
    });
    this.loadingInitial = false;
  };

  get serviceArray() {
    return Array.from(this.serviceRegistry.values());
  }
  //#region private methods
  private setService = (service: Service) => {
    this.serviceRegistry.set(service.id, service);
  };

  private cleanServiceCache = () => {
    runInAction(() => {
      console.log('cleanServiceCache');
      this.serviceRegistry.clear();
    });
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion
}
