import { Service } from './../models/service.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleServiceData } from '../mock/service.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';

export default class ServiceStore {
  serviceRegistry = new Map<number, Service>();
  serviceArray: Service[] = [];
  selectedService: Service | undefined = undefined;
  loading: boolean = false;
  servicePageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('Service store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanServiceCache, 30000);
  }

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
        this.loadServiceArray();
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
  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin service store');
      this.servicePageParams.searchTerm = term;
      this.cleanServiceCache();
      this.loadServiceArray();
      console.log('term:', term);
    });
  };

  setCurrentPage = (pageIndex: number) => {
    runInAction(() => {
      this.servicePageParams.pageIndex = pageIndex;
      this.loadServiceArray();
    });
  };

  setPageSize = (size: number) => {
    runInAction(() => {
      this.servicePageParams.pageSize = size;
      this.servicePageParams.pageIndex = 1; 
      this.loadServiceArray();
    });
  };

  loadServiceArray = async () => {
    const { pageSize, pageIndex, totalElement } = this.servicePageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (
      pageSize * pageIndex > this.serviceRegistry.size &&
      this.serviceRegistry.size < totalElement!
    ) {
      await this.mockLoadServices();
    }
    this.serviceArray = Array.from(this.serviceRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

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
