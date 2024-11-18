import { Court, CourtCluster as CourtCluster, CourtClusterListAll } from './../models/court.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleCourtData } from '../mock/court.mock';
import { PageParams, ProductPageParams } from '../models/pageParams.model';
import { catchErrorHandle, customFormatTime, sleep } from '../helper/utils';
import agent from '../api/agent';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { PaginationModel } from '@/app/models/pagination.model.ts';
import { Product } from '@/app/models/product.model.ts';
import { Service } from '@/app/models/service.model.ts';
import { CourtClusterMessage, CourtMessage } from '../common/toastMessage';

export default class CourtClusterStore {
  //registry
  courtClusterRegistry = new Map<number, CourtCluster>(); // regitry cho trang cụm sân
  courtClusterListAllRegistry = new Map<number, CourtClusterListAll>(); // registry cho option court
  productOfClusterRegistry = new Map<number, Product>();
  servicesOfClusterRegistry = new Map<number, Service>();
  courtOfClusterRegistry = new Map<number, Court>();
  // selected
  selectedCourt: CourtCluster | undefined = undefined; //cụm sân đang được chọn (trang details, hoặc khi update)
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
  loadingServicesPage: boolean = false;
  loadingInitialBookingPage: boolean = false;
  loadingCourt: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingInitialBookingPage =(load:boolean) => this.loadingInitialBookingPage = load;

  //#region Court
  loadCourtOfCluster = async (id: number, chakraToast:any) => {
    if (id) {
      this.loadingCourt = true;
      const [error, res] = await catchErrorHandle(agent.CourtAgent.list(id));
      runInAction(() => {
        if (error) {
          chakraToast(CourtMessage.loadCourtOfCourtClusterFail);
        }
        if (res) {
          this.courtOfClusterRegistry.clear();
          res.forEach(this.setCourt);
        }
        this.loadingCourt = false;
      });
    }
  };

  private setCourt = (court: Court) => {
    this.courtOfClusterRegistry.set(court.courtId, court);
  };

  get courtOfClusterArray() {
    return Array.from(this.courtOfClusterRegistry.values());
  }
  //#endRegion

  //#region Services
  loadServicesOfCourtCluster = async (id: number) => {
    if (id) {
      this.loadingServicesPage = true;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.serviceCourtClusterPageParams.skip}`);
      queryParams.append('pageSize', `${this.serviceCourtClusterPageParams.pageSize}`);
      queryParams.append('filter', `${id}`);
      if (this.serviceCourtClusterPageParams.searchTerm) {
        queryParams.append('search', this.serviceCourtClusterPageParams.searchTerm);
      }
      const [error, res] = await catchErrorHandle(
        agent.Services.list('?' + queryParams.toString()),
      );
      runInAction(() => {
        if (error) {
          toast.error('Lấy danh sách dịch vụ của sân thất bại');
        }
        if (res) {
          res.data.forEach(this.setServiceCourtCluster);
          this.serviceCourtClusterPageParams.totalElement = res.count;
        }
        this.loadingServicesPage = false;
      });
    }
  };
  //#endRegion

  //#region Product
  loadProductsOfCourtCluster = async (id: number) => {
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
          toast.error(`Lấy danh sách sản phẩm của cụm sân ${this.selectedCourt?.title} thất bại`);
          this.productCourtClusterPageParams.totalElement = 0;
        }
        if (res) {
          res.data.forEach(this.setProductCourtCluster);
          this.productCourtClusterPageParams.totalElement = res.count;
        }
        this.loadingProductsPage = false;
      });
    }
  };
  //#endRegion

  //#region MainCRUD
  // 1. Load list court clusters for admin
  loadCourtsCluster = async () => {
    this.loadingInitial = true;
    this.clearProductCache();
    const [error, response] = await catchErrorHandle<PaginationModel<CourtCluster>>(
      agent.CourtClusterAgent.list(),
    );

    runInAction(() => {
      if (error) {
        toast.error('Tải danh sách cụm sân thất bại'); // Cải thiện thông báo lỗi nếu cần
      } else {
        response.data.forEach(this.setCourtCluster);
        this.courtPageParams.totalElement = response.count;
      }
      this.loadingInitial = false;
    });
  };
  // 2. Get Details court cluster for admin

  getDetailsCourtCluster = async (id: string, chakraToast: any) => {
    this.loadingInitialDetailsPage = true;
    const [error, response] = await catchErrorHandle<CourtCluster>(
      agent.CourtClusterAgent.details(id),
    );
    runInAction(() => {
      if (error) {
        chakraToast(CourtClusterMessage.loadDetailsFail);
      } else {
        this.selectedCourt = response;
      }
      this.loadingInitialDetailsPage = false;
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

  setSearchTerm = (term: string) => {
    runInAction(() => {
      this.courtPageParams.searchTerm = term;
      this.cleanCourtCache();
    });
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
    return Array.from(this.productOfClusterRegistry.values());
  }

  get serviceOfCourtClusterArray() {
    return Array.from(this.servicesOfClusterRegistry.values());
  }

  setSelectedTab = (index: number) => {
    this.selectedTabs = index;
  };
  private setCourtCluster = (court: CourtCluster) => {
    court.openTime = customFormatTime(court.openTime);
    court.closeTime = customFormatTime(court.closeTime);
    this.courtClusterRegistry.set(court.id, court);
  };

  private setProductCourtCluster = (product: Product) => {
    this.productOfClusterRegistry.set(product.id, product);
  };

  private setServiceCourtCluster = (service: Service) => {
    this.servicesOfClusterRegistry.set(service.id, service);
  };

  private setCourtClusterListAll = (courtClusterListAll: CourtClusterListAll[]) => {
    courtClusterListAll.forEach((c) => {
      this.courtClusterListAllRegistry.set(c.id, c);
    });
  };

  private cleanCourtCache = () => {
    this.courtClusterRegistry.clear();
  };

  private clearProductCache = () => {
    this.productOfClusterRegistry.clear();
  };

  // dispose() {
  //     if (this.cleanupInterval) {
  //         clearInterval(this.cleanupInterval);
  //     }
  // }
}
