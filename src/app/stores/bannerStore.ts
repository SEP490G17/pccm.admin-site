import { Banner } from './../models/banner.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { PageParams } from '../models/pageParams.model';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { customFormatDate } from '../helper/utils';
export default class BannerStore {
  bannerRegistry = new Map<number, Banner>();
  bannerArray: Banner[] = [];
  selectedBanner: Banner | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  bannerPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;
  isOrigin: boolean = true;
  constructor() {
    console.log('banner store initialized');
    makeAutoObservable(this);
  }

  //#region CRUD
  loadBanners = async () => {
    this.loading = true;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.bannerPageParams.skip ?? 0}`);
      queryParams.append('pageSize', `${this.bannerPageParams.pageSize}`);
      if (this.bannerPageParams.searchTerm) {
        queryParams.append('search', this.bannerPageParams.searchTerm);
        this.isOrigin = false;
      } else {
        this.isOrigin = true;
      }
      const { count, data } = await agent.Banners.list(`?${queryParams.toString()}`);
      runInAction(() => {
        data.forEach(this.setBanner);

        this.bannerPageParams.totalElement = count;
        this.loadBannerArray();
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.log(error);
        toast.error('Error loading banners');
      });
    }
  };

  createBanner = async (banner: Banner) => {
    this.loading = true;
    try {
      await agent.Banners.create(banner);
      runInAction(() => {
        this.setBanner(banner);
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error creating banner:', error);
      });
    } finally {
      this.loading = false;
    }
  };

  updateBanner = async (banner: Banner) => {
    this.loading = true;
    try {
      await agent.Banners.update(banner);
      runInAction(() => {
        this.setBanner(banner);
        this.selectedBanner = banner;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error updating banner:', error);
      });
    }
  };

  deleteBanner = async (id: number) => {
    this.loading = true;
    try {
      await agent.Banners.delete(id);
      runInAction(() => {
        this.bannerRegistry.delete(id);
        this.loading = false;
        this.loadBannerArray()
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error deleting banner:', error);
      });
    }
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

  mockLoadBannerArray = async () => {
    const { pageSize, skip = 0, totalElement } = this.bannerPageParams;
    const endIndex = skip + pageSize;
    console.log('total element:', totalElement);
    this.bannerArray = Array.from(this.bannerRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(skip, endIndex);
  };
  //#endregion

  //#region common
  setLoadingInitial = (isLoad: boolean) => {
    runInAction(() => {
      this.loadingInitial = isLoad;
    });
  };

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

  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    await runInAction(async () => {
      if (this.bannerPageParams.totalElement === this.bannerRegistry.size && this.isOrigin) {
        console.log('checking');
        this.bannerPageParams.searchTerm = term;
        this.loadBannerArray();
        return;
      }
      this.bannerRegistry.clear();
      this.bannerPageParams.clearLazyPage();
      this.bannerPageParams.searchTerm = term;
      await this.loadBanners();
    });
    this.loadingInitial = false;
  };

  loadBannerArray() {
    runInAction(() => {
      const { searchTerm } = this.bannerPageParams;
      if (this.bannerRegistry.size === this.bannerPageParams.totalElement && searchTerm) {
        this.bannerArray = Array.from(this.bannerRegistry.values()).filter(
          (b) => _.includes(b.title, searchTerm) || _.includes(b.description, searchTerm),
        );
        return;
      }
      this.bannerArray = Array.from(this.bannerRegistry.values());
    });
  }

  //#region private methods
  private setBanner = (banner: Banner) => {
    banner.startDate = customFormatDate(new Date(banner.startDate));
    banner.endDate = customFormatDate(new Date(banner.endDate));
    this.bannerRegistry.set(banner.id, banner);
  };

  // Phương thức dọn dẹp cache (xóa sạch bannerRegistry)
  private cleanBannerCache = () => {
    runInAction(() => {
      console.log('cleanBannerCache');
      this.bannerRegistry.clear();
    });
  };

  // Hủy interval khi component bị destroy (nếu cần)
  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion

  //#endregion
}
