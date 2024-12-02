import { Banner, BannerDTO } from './../models/banner.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { BannerPageParams } from '../models/pageParams.model';
import _ from 'lodash';
import { catchErrorHandle, customFormatDate } from '../helper/utils';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { BannerMessage } from '../common/toastMessage/bannerMessage';
export default class BannerStore {
  bannerRegistry = new Map<number, Banner>();
  selectedBanner: Banner | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  bannerPageParams = new BannerPageParams();
  cleanupInterval: number | undefined = undefined;
  isOrigin: boolean = true;
  loadingEdit: boolean = false;
  loadingStatusMap = new Map<number, boolean>();

  constructor() {
    makeAutoObservable(this);
  }

  //#region CRUD
  loadBanners = async (toast: CreateToastFnReturn) => {
    this.loading = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.bannerPageParams.skip ?? 0}`);
    queryParams.append('pageSize', `${this.bannerPageParams.pageSize}`);
    if (this.bannerPageParams.searchTerm) {
      queryParams.append('search', this.bannerPageParams.searchTerm);
    }
    if (this.bannerPageParams.category) {
      queryParams.append('category', `${this.bannerPageParams.category}`);
    }
    if (this.bannerPageParams.status) {
      queryParams.append('status', `${this.bannerPageParams.status}`);
    }
    const [err, res] = await catchErrorHandle(agent.Banners.list(`?${queryParams.toString()}`));
    runInAction(() => {
      if (err) {
        toast(BannerMessage.loadingFailure());
      }

      if (res) {
        const { data, count } = res;
        data.forEach(this.setBanner);
        this.bannerPageParams.totalElement = count;
      }
      this.loading = false;
    });
    return { err, res };
  };

  createBanner = async (banner: BannerDTO, toast: CreateToastFnReturn) => {
    this.loading = true;
    const [err, res] = await catchErrorHandle(agent.Banners.create(banner));
    runInAction(async () => {
      if (res) {
        this.setBanner(res);
        toast(BannerMessage.createSuccess());
      }
      if (err) {
        toast(BannerMessage.createFailure());
      }
      this.loading = false;
    });
    return { err, res };
  };

  detailBanner = async (bannerId: number, toast: CreateToastFnReturn) => {
    this.loadingEdit = true;
    const [err, res] = await catchErrorHandle(agent.Banners.details(bannerId));
    runInAction(() => {
      if (res) {
        this.selectedBanner = res;
      }
      if (err) {
        toast(BannerMessage.detailFailure());
      }
      this.loadingEdit = false;
    });

    return { err, res };
  };

  updateBanner = async (banner: BannerDTO, toast: CreateToastFnReturn) => {
    this.loading = true;
    const [err, res] = await catchErrorHandle(agent.Banners.update(banner));
    runInAction(() => {
      if (res) {
        this.setBanner(banner);
        toast(BannerMessage.updateSuccess());
      }
      if (err) {
        toast(BannerMessage.updateFailure());
      }
      this.loading = false;
    });
  };

  changeStatus = async (bannerId: number, status: number, toast: CreateToastFnReturn) => {
    this.setLoadingStatus(bannerId, true);
    const [err, res] = await catchErrorHandle(agent.Banners.changestatus(bannerId, status));
    runInAction(() => {
      if (err) {
        toast(BannerMessage.updateFailure());
      }
      if (res) {
        toast(BannerMessage.updateSuccess());
        this.setBanner(res);
      }
      this.setLoadingStatus(bannerId, false);
    });
    return { err, res };
  };

  deleteBanner = async (id: number, toast:CreateToastFnReturn) => {
    this.loading = true;
    const [err,res] = await catchErrorHandle(agent.Banners.delete(id));
    runInAction(()=>{
      if (err) {
        toast(BannerMessage.deleteFailure());
      }
      if (res) {
        this.bannerRegistry.delete(id);
      }
      this.loading = false;
    })
    return { err, res };
  };

  //#endregion

  //#region mock-up
  mockLoadBanners = async () => {
    // this.loading = true;
    // try {
    //   sampleBannerData.forEach(this.setBanner);
    //   await sleep(1000);
    //   runInAction(() => {
    //     this.bannerPageParams.totalPages = Math.ceil(
    //       this.bannerRegistry.size / this.bannerPageParams.pageSize,
    //     );
    //     this.bannerPageParams.totalElement = this.bannerRegistry.size;
    //     this.mockLoadBannerArray();
    //   });
    // } catch (error) {
    //   runInAction(() => {
    //     console.error('Error loading banners:', error);
    //   });
    // } finally {
    //   this.loading = false;
    // }
  };

  // mockLoadBannerArray = async () => {
  //   const { pageSize, skip = 0, totalElement } = this.bannerPageParams;
  //   const endIndex = skip + pageSize;
  // };
  //#endregion

  //#region common
  setLoadingInitial = (isLoad: boolean) => {
    runInAction(() => {
      this.loadingInitial = isLoad;
    });
  };

  setLoadingStatus(id: number, isLoading: boolean) {
    this.loadingStatusMap.set(id, isLoading);
  }

  isLoading(id: number) {
    return this.loadingStatusMap.get(id);
  }

  // setCurrentPage = (pageIndex: number) => {
  //   runInAction(() => {
  //     this.bannerPageParams.pageIndex = pageIndex;
  //     this.loadBanners();
  //   });
  // };

  // setPageSize = (size: number) => {
  //   runInAction(() => {
  //     this.bannerPageParams.pageSize = size;
  //     this.bannerPageParams.pageIndex = 1;
  //     this.loadBanners();
  //   });
  // };

  setSearchTerm = async (term: string, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.bannerRegistry.clear();
    this.bannerPageParams.clearLazyPage();
    this.bannerPageParams.searchTerm = term;
    await this.loadBanners(toast);
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  get bannerArray() {
    return Array.from(this.bannerRegistry.values());
  }

  //#region private methodsU
  readonly setBanner = (banner: Banner) => {
    banner.startDate = customFormatDate(new Date(banner.startDate));
    banner.endDate = customFormatDate(new Date(banner.endDate));
    this.bannerRegistry.set(banner.id, banner);
  };

  setStatusTerm = async (term: string, toast: CreateToastFnReturn) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.bannerRegistry.clear();
      this.bannerPageParams.clearLazyPage();
      this.bannerPageParams.status = term;
      await this.loadBanners(toast);
      this.loadingInitial = false;
    });
  };

  setCategoryTerm = async (term: string, toast: CreateToastFnReturn) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.bannerRegistry.clear();
      this.bannerPageParams.clearLazyPage();
      this.bannerPageParams.category = term;
      await this.loadBanners(toast);
      this.loadingInitial = false;
    });
  };

  get bannersArray() {
    return _.orderBy(Array.from(this.bannerRegistry.values()), ['id'], ['desc']);
  }

  // Hủy interval khi component bị destroy (nếu cần)
  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion

  //#endregion
}
