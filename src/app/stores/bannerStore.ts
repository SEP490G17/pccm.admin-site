import { Banner } from './../models/banner.model';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { sampleBannerData } from '../mock/banner.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
export default class BannerStore {
  bannerRegistry = new Map<number, Banner>();
  bannerArray: Banner[] = [];
  selectedBanner: Banner | undefined = undefined;
  loading: boolean = false;
  bannerPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('banner store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanBannerCache, 30000);
  }

  //#region CRUD
  loadBanners = async () => {
    this.loading = true;
    try {
      const banners = await agent.Banner.list();
      runInAction(() => {
        banners.forEach(this.setBanner);
        this.bannerPageParams.totalPages = Math.ceil(
          banners.length / this.bannerPageParams.pageSize,
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error loading banners:', error);
      });
    }
  };

  createBanner = async (banner: Banner) => {
    this.loading = true;
    try {
      await agent.Banner.create(banner);
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
      await agent.Banner.update(banner);
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
      await agent.Banner.delete(id);
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
    this.loading = true;
    try {
      sampleBannerData.forEach(this.setBanner);
      await sleep(1000);
      runInAction(() => {
        this.bannerPageParams.totalPages = Math.ceil(
          this.bannerRegistry.size / this.bannerPageParams.pageSize,
        );
        this.bannerPageParams.totalElement = this.bannerRegistry.size;
        this.loadBannerArray();
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading banners:', error);
      });
    } finally {
      this.loading = false;
    }
  };
  //#endregion

  //#region common
  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin banner store');
      this.bannerPageParams.searchTerm = term;
      this.cleanBannerCache();
      this.loadBannerArray();
      console.log('term:', term);
    });
  };

  setPageIndex = (pageIndex: number) => {
    runInAction(() => {
      this.bannerPageParams.pageIndex = pageIndex;
      this.loadBannerArray();
    });
  };

  loadBannerArray = async () => {
    const { pageSize, pageIndex, totalElement } = this.bannerPageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (
      pageSize * pageIndex > this.bannerRegistry.size &&
      this.bannerRegistry.size < totalElement!
    ) {
      await this.loadBanners();
    }
    this.bannerArray = Array.from(this.bannerRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

  //#region private methods
  private setBanner = (banner: Banner) => {
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
