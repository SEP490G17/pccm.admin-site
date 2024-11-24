import { Banner, BannerDTO } from './../models/banner.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { BannerPageParams } from '../models/pageParams.model';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { catchErrorHandle, customFormatDate } from '../helper/utils';
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
  loadBanners = async () => {
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
        toast.error('Lấy danh sách banner thất bại');
      }

      if (res) {
        const { data, count, pageSize } = res;
        data.forEach(this.setBanner);
        this.bannerPageParams.totalElement = count;
      }

      this.loading = false;
    });
  };

  createBanner = async (banner: BannerDTO) => {
    this.loading = true;
    await runInAction(async () => {
      await agent.Banners.create(banner)
        .then((s) => {
          this.setBanner(s);
          toast.success('Tạo banner thành công');
        })
        .catch((error) => {
          console.error('Error creating banner:', error);
          toast.error('Tạo banner lỗi');
        })
        .finally(() => (this.loading = false));
    });
  };

  detailBanner = async (bannerId: number) => {
    this.loadingEdit = true;
    try {
      const data = await agent.Banners.details(bannerId);
      runInAction(() => {
        this.selectedBanner = data;
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

  updateBanner = async (banner: BannerDTO) => {
    this.loading = true;
    try {
      await agent.Banners.update(banner);
      runInAction(() => {
        this.setBanner(banner);
        this.selectedBanner = banner;
        this.loading = false;
        toast.success('Cập nhật thành công');
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error updating banner:', error);
        toast.error('Cập nhật thất bại');
      });
    }
  };

  changeStatus = async (bannerId: number, status: number) => {
    this.setLoadingStatus(bannerId, true);
    await runInAction(async () => {
      await agent.Banners.changestatus(bannerId, status)
        .then((s) => {
          this.setBanner(s);
          toast.success('Cập nhật banner thành công');
        })
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Cập nhật banner thất bại');
        })
        .finally(() => this.setLoadingStatus(bannerId, false));
    });
  };

  deleteBanner = async (id: number) => {
    this.loading = true;
    try {
      await agent.Banners.delete(id);
      runInAction(() => {
        this.bannerRegistry.delete(id);
        this.loading = false;
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
  };
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

  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    this.bannerRegistry.clear();
    this.bannerPageParams.clearLazyPage();
    this.bannerPageParams.searchTerm = term;
    await this.loadBanners();
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  get bannerArray() {
    return Array.from(this.bannerRegistry.values());
  }

  //#region private methodsU
  private setBanner = (banner: Banner) => {
    banner.startDate = customFormatDate(new Date(banner.startDate));
    banner.endDate = customFormatDate(new Date(banner.endDate));
    this.bannerRegistry.set(banner.id, banner);
  };

  setStatusTerm = async (term: string) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.bannerRegistry.clear();
      this.bannerPageParams.clearLazyPage();
      this.bannerPageParams.status = term;
      await this.loadBanners();
      this.loadingInitial = false;
    });
  };

  setCategoryTerm = async (term: string) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.bannerRegistry.clear();
      this.bannerPageParams.clearLazyPage();
      this.bannerPageParams.category = term;
      await this.loadBanners();
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
