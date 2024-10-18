import { Product } from './../models/product.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleProductData } from '../mock/product.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import { toast } from 'react-toastify';
import agent from '../api/agent';

export default class ProductStore {
  productRegistry = new Map<number, Product>();
  productArray: Product[] = [];
  selectedProduct: Product | undefined = undefined;
  loading: boolean = false;
  productPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;
  loadingInitial: boolean = false;

  constructor() {
    console.log('product store initialized');
    this.productPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanProductCache, 30000);
  }

  //#region CRUD
  loadProducts = async () => {
    this.loading = true;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.productPageParams.skip ?? 0}`);
      queryParams.append('pageSize', `${this.productPageParams.pageSize}`);
      if (this.productPageParams.searchTerm) {
        queryParams.append('search', this.productPageParams.searchTerm);
      }
      if (this.productPageParams.filter) {
        queryParams.append('filter', this.productPageParams.filter);
      }
      const { count, data } = await agent.Products.list(`?${queryParams.toString()}`);
      runInAction(() => {
        data.forEach(this.setProduct);

        this.productPageParams.totalElement = count;
        this.loadProductArray();
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.log(error);
        toast.error('Error loading news');
      });
    }
  };

  //#endregion

  //#region mock-up
  mockLoadProducts = async () => {
    this.loading = true;
    try {
      sampleProductData.forEach(this.setProduct);
      await sleep(1000);
      runInAction(() => {
        this.productPageParams.totalPages = Math.ceil(
          this.productRegistry.size / this.productPageParams.pageSize,
        );
        this.productPageParams.totalElement = this.productRegistry.size;
        this.loadProductArray();
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading products:', error);
      });
    } finally {
      this.loading = false;
    }
  };
  //#endregion

  //#region common

  setLoadingInitial = (loading:boolean) =>{
      this.loadingInitial = loading;
  }


  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    await runInAction(async () => {
      this.productRegistry.clear();
      this.productPageParams.clearLazyPage();
      this.productPageParams.searchTerm = term;
      await this.loadProducts();
    });
    this.loadingInitial = false;
  };

  loadProductArray() {
    runInAction(() => {
      this.productArray = Array.from(this.productRegistry.values());
    });
  }

  //#region private methods
  private setProduct = (product: Product) => {
    this.productRegistry.set(product.id, product);
  };

  private cleanProductCache = () => {
    runInAction(() => {
      console.log('cleanProductCache');
      this.productRegistry.clear();
    });
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion
}
