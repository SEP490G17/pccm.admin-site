import { CourtCluster, CourtClusterListAll } from './../models/court.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleCourtData } from '../mock/court.mock';
import { PageParams, ProductPageParams } from '../models/pageParams.model';
import { catchErrorHandle, customFormatTime, sleep } from '../helper/utils';
import agent from '../api/agent';
import _ from 'lodash';
import { PaginationModel } from '@/app/models/pagination.model.ts';
import { Product } from '@/app/models/product.model.ts';
import { Service } from '@/app/models/service.model.ts';
import {
  CourtClusterMessage,
  DefaultCourtClusterText,
} from '../common/toastMessage/courtClusterMessage';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { CommonMessage } from '../common/toastMessage/commonMessage';
import { store } from './store';
import { ServiceMessage } from '../common/toastMessage/serviceMessage';
import { ProductMessage } from '../common/toastMessage/productMessage';

export default class CourtClusterStore {
  //registry
  courtClusterRegistry = new Map<number, CourtCluster>(); // regitry cho trang cụm sân
  courtClusterListAllRegistry = new Map<number, CourtClusterListAll>(); // registry cho option court
  productOfClusterRegistry = new Map<number, Product>();
  servicesOfClusterRegistry = new Map<number, Service>();
  // selected
  selectedCourtCluster?: CourtCluster; //cụm sân đang được chọn (trang details, hoặc khi update)
  selectedTabs: number = 0;
  // page param
  courtPageParams = new PageParams(); // page param cho trang cụm sân
  productCourtClusterPageParams = new ProductPageParams();
  serviceCourtClusterPageParams = new PageParams();
  // loading

  loading: boolean = false;
  loadingInitial: boolean = false;
  loadingInitialDetailsPage: boolean = false;
  loadingProductsPage: boolean = false;
  loadingInitialProductPage: boolean = false;
  loadingServicesPage: boolean = false;
  loadingIntitialServicePage: boolean = false;
  loadingInitialBookingPage: boolean = false;
  loadingCourt: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.productCourtClusterPageParams.pageSize = 6;
    this.serviceCourtClusterPageParams.pageSize = 6;

  }

  setLoadingInitialBookingPage = (load: boolean) => (this.loadingInitialBookingPage = load);

  //#region Court

  //#endRegion

  //#region Services
  loadServicesOfCourtCluster = async (id: number, toast: CreateToastFnReturn) => {
    if (id) {
      this.loadingServicesPage = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.serviceCourtClusterPageParams.skip}`);
      queryParams.append('pageSize',`${this.serviceCourtClusterPageParams.pageSize}`)
      queryParams.append('filter', `${id}`);
      if (this.serviceCourtClusterPageParams.searchTerm) {
        queryParams.append('search', this.serviceCourtClusterPageParams.searchTerm);
      }
      const [error, res] = await catchErrorHandle(
        agent.Services.list('?' + queryParams.toString()),
      );
      runInAction(() => {
        if (error) {
          toast(ServiceMessage.loadFailure());
        }
        if (res) {
          res.data.forEach(this.setServiceCourtCluster);
          this.serviceCourtClusterPageParams.totalElement = res.count;
          this.serviceCourtClusterPageParams.skip = this.servicesOfClusterRegistry.size;
        }
        this.loadingServicesPage = false;
      });
    }
  };
  //#endRegion

  //#region Product
  loadProductsOfCourtCluster = async (id: number, toast: CreateToastFnReturn) => {
    if (id) {
      this.loadingProductsPage = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.productCourtClusterPageParams.skip ?? 0}`);
      queryParams.append('pageSize', `${this.productCourtClusterPageParams.pageSize}`);
      if (this.productCourtClusterPageParams.searchTerm) {
        queryParams.append('search', this.productCourtClusterPageParams.searchTerm);
      }
      queryParams.append('courtCluster', `${id}`);
      if (this.productCourtClusterPageParams.category) {
        queryParams.append('category', `${this.productCourtClusterPageParams.category}`);
      }
      const [error, res] = await catchErrorHandle(
        agent.Products.list('?' + queryParams.toString()),
      );
      runInAction(() => {
        if (error) {
          toast(ProductMessage.loadingFailure());
          this.productCourtClusterPageParams.totalElement = 0;
        }
        if (res) {
          res.data.forEach(this.setProductCourtCluster);
          this.productCourtClusterPageParams.totalElement = res.count;
          this.productCourtClusterPageParams.skip = this.productOfClusterRegistry.size;
        }
        this.loadingProductsPage = false;
      });
    }
  };
  //#endRegion

  //#region MainCRUD
  // 1. Load list court clusters for admin
  loadCourtsCluster = async (toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.courtPageParams.skip}`);
    queryParams.append('pageSize', `${this.courtPageParams.pageSize}`);
    if (this.courtPageParams.searchTerm) {
      queryParams.append('search', this.courtPageParams.searchTerm);
    }

    const [error, response] = await catchErrorHandle<PaginationModel<CourtCluster>>(
      agent.CourtClusterAgent.list(`?${queryParams.toString()}`),
    );

    runInAction(() => {
      if (error) {
        toast(CourtClusterMessage.loadFailure()); // Cải thiện thông báo lỗi nếu cần
      }
      if (response) {
        response.data.forEach(this.setCourtCluster);
        this.courtPageParams.totalElement = response.count;
      }
      this.loadingInitial = false;
    });
  };
  // 2. Get Details court cluster for admin

  getDetailsCourtCluster = async (id: string, chakraToast: CreateToastFnReturn) => {
    this.loadingInitialDetailsPage = true;
    const [error, response] = await catchErrorHandle<CourtCluster>(
      agent.CourtClusterAgent.details(id),
    );
    runInAction(() => {
      if (error) {
        chakraToast(CourtClusterMessage.loadDetailsFail());
      }
      if (response) {
        this.selectedCourtCluster = response;
      }
      this.loadingInitialDetailsPage = false;
    });
  };

  deleteCourtCluster = async (id: number, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage(DefaultCourtClusterText.delete.title));
    const [err, res] = await catchErrorHandle(agent.CourtClusterAgent.delete(id));
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(CourtClusterMessage.deleteFailure());
      }
      if (res) {
        toast(CourtClusterMessage.deleteSuccess());
        this.courtClusterRegistry.delete(id);
      }
    });
  };

  visibleToggle = async (id: number, isVisible: boolean, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage(DefaultCourtClusterText.visible.title));
    const [err, res] = await catchErrorHandle(agent.CourtClusterAgent.visible(id, !isVisible));
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(CourtClusterMessage.visibleFailure());
      }
      if (res) {
        toast(CourtClusterMessage.visibleSuccess());
        const courtCluster = this.courtClusterRegistry.get(id);
        if (courtCluster) {
          courtCluster.isVisible = !isVisible;
          this.courtClusterRegistry.set(id, courtCluster);
        }
      }
    });
  };
  //#endregion

  loadCourtClusterListAll = async () => {
    this.loading = true;
    await runInAction(async () => {
      try {
        await agent.CourtClusterAgent.listAll().then(this.setCourtClusterListAll);
      } finally {
        this.loading = false;
      }
    });
  };

  mockLoadCourts = async () => {
    this.loading = true;
    try {
      sampleCourtData.forEach(this.setCourtCluster);
      await sleep(1000);
      runInAction(() => {
        this.courtPageParams.totalPages = Math.ceil(
          this.courtClusterRegistry.size / this.courtPageParams.pageSize,
        );
        this.courtPageParams.totalElement = this.courtClusterRegistry.size;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading courts:', error);
      });
    } finally {
      this.loading = false;
    }
  };

  setSearchTerm = async (term: string, toast: CreateToastFnReturn) => {
    this.courtPageParams.searchTerm = term;
    this.cleanCourtCache();
    await this.loadCourtsCluster(toast);
  };

  get courtClusterArray() {
    return _.orderBy(Array.from(this.courtClusterRegistry.values()), ['id'], 'desc');
  }

  get courtClusterListAllArray() {
    return Array.from(this.courtClusterListAllRegistry.values());
  }

  get courtClusterListAllOptions() {
    return this.courtClusterListAllArray.map((courtCluster) => ({
      value: courtCluster.id,
      label: courtCluster.courtClusterName,
    }));
  }

  get productOfCourtClusterArray() {
    return _.orderBy(Array.from(this.productOfClusterRegistry.values()),["id"],"desc");
  }

  get serviceOfCourtClusterArray() {
    return _.orderBy(Array.from(this.servicesOfClusterRegistry.values()),["id"],"desc");
  }

  setSelectedTab = (index: number) => {
    this.selectedTabs = index;
  };
  setCourtCluster = (court: CourtCluster) => {
    court.openTime = customFormatTime(court.openTime);
    court.closeTime = customFormatTime(court.closeTime);
    this.courtClusterRegistry.set(court.id, court);
  };

  setProductCourtCluster = (product: Product) => {
    this.productOfClusterRegistry.set(product.id, product);
  };

  setServiceCourtCluster = (service: Service) => {
    this.servicesOfClusterRegistry.set(service.id, service);
  };

  setCourtClusterListAll = (courtClusterListAll: CourtClusterListAll[]) => {
    courtClusterListAll.forEach((c) => {
      this.courtClusterListAllRegistry.set(c.id, c);
    });
  };

  cleanCourtCache = () => {
    this.courtClusterRegistry.clear();
  };

  clearProductCache = () => {
    this.productOfClusterRegistry.clear();
  };

  // dispose() {
  //     if (this.cleanupInterval) {
  //         clearInterval(this.cleanupInterval);
  //     }
  // }

  updateCourtCluster = async (
    id: number,
    courtCluster: CourtCluster,
    toast: CreateToastFnReturn,
  ) => {
    const pending = toast(CommonMessage.loadingMessage(DefaultCourtClusterText.edit.title));
    const [err, res] = await catchErrorHandle(agent.CourtClusterAgent.edit(id, courtCluster));
    runInAction(() => {
      toast.close(pending);
      if (res) {
        toast(CourtClusterMessage.editSuccess());
      }
      if (err) {
        toast(CourtClusterMessage.editFailure());
      }
    });
  };

  clearDetailsCourtCluster = () => {
    this.selectedCourtCluster = undefined;
    this.productOfClusterRegistry.clear();
    this.servicesOfClusterRegistry.clear();
    this.productCourtClusterPageParams.clearLazyPage();
    this.serviceCourtClusterPageParams.clearLazyPage();
    this.productCourtClusterPageParams.searchTerm = '';
    this.serviceCourtClusterPageParams.searchTerm = '';
    store.bookingClusterStore.bookingAllRegistry.clear();
    store.bookingClusterStore.bookingDenyRegistry.clear();
    store.bookingClusterStore.bookingTodayRegistry.clear();
    store.bookingClusterStore.bookingPendingRegistry.clear();
    store.bookingClusterStore.loadBookingTodayArray();
    store.bookingClusterStore.bookingForScheduleRegistry.clear();
  };

  filterProductByCategory = async (
    category: number,
    courtClusterId: number,
    toast: CreateToastFnReturn,
  ) => {
    this.productCourtClusterPageParams.clearLazyPage();
    this.productOfClusterRegistry.clear();
    this.productCourtClusterPageParams.category = category;
    await this.loadProductsOfCourtCluster(courtClusterId, toast);
  };

  setLoadingInitialProductPage = (value:boolean)=>{
    this.loadingInitialProductPage = value;
  }

  setLoadingInitialServicePage = (value:boolean)=>{
    this.loadingIntitialServicePage = value;
  }

  setServiceSearchTemp = async (searchTemp:string, courtClusterId: number, toast:CreateToastFnReturn) =>{
    this.productCourtClusterPageParams.clearLazyPage();
    this.productCourtClusterPageParams.searchTerm = searchTemp;
    return await this.loadServicesOfCourtCluster(courtClusterId,toast);
  }

  reset = () =>{
    this.courtClusterRegistry.clear();
    this.productOfClusterRegistry.clear();
    this.servicesOfClusterRegistry.clear();
    this.courtClusterListAllRegistry.clear();
    this.courtPageParams.reset();
    this.serviceCourtClusterPageParams.reset();
    this.productCourtClusterPageParams.reset();
  }
}
