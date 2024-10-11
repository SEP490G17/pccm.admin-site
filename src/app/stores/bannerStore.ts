import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Banner } from "../models/banner.model";

export default class BannerStore {
  banners: Banner[] = [];
  selectedBanner: Banner | undefined = undefined;
  searchTerm: string = "";
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  loadBanners = async () => {
    this.loading = true;
    try {
      const banners = await agent.Banner.list();
      runInAction(() => {
        this.banners = banners;
        this.totalPages = Math.ceil(banners.length / this.pageSize);
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
        this.banners.push(banner);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error creating banner:', error);
      });
    }
  };

  updateBanner = async (banner: Banner) => {
    this.loading = true;
    try {
      await agent.Banner.update(banner);
      runInAction(() => {
        this.banners = this.banners.map(b => (b.id === banner.id ? banner : b));
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
        this.banners = this.banners.filter(b => b.id !== id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error deleting banner:', error);
      });
    }
  };

  get filteredBanners() {
    return this.banners.filter(banner =>
      banner.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedBanners() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredBanners.slice(startIndex, endIndex);
  }

  setPage = (page: number) => {
    this.currentPage = page;
  };
}
