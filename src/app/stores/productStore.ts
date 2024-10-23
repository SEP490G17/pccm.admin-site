import { Product, ProductCreate } from './../models/product.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleProductData } from '../mock/product.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import _ from 'lodash';
export default class ProductStore {
  productRegistry = new Map<number, Product>();
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
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.productPageParams.skip ?? 0}`);
    queryParams.append('pageSize', `${this.productPageParams.pageSize}`);
    if (this.productPageParams.searchTerm) {
      queryParams.append('search', this.productPageParams.searchTerm);
    }
    if (this.productPageParams.filter) {
      queryParams.append('filter', this.productPageParams.filter);
    }
    await runInAction(async () => {
      await agent.Products.list(`?${queryParams.toString()}`)
        .then(({ data, count }) => {
          data.forEach(this.setProduct);
          this.productPageParams.totalElement = count;
        })
        .catch((error) => {
          console.error('Error loading products:', error);
          toast.error('Load products fail!');
        })
        .finally(() => (this.loading = false));
    });
  };

  createProduct = async (product: ProductCreate) => {
    this.loading = true;
    await runInAction(async () => {
      await agent.Products.create(product)
        .then(this.setProduct)
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Create Product fail!');
        })
        .finally(() => (this.loading = false));
    });
  };

  //#endregion

  deleteProduct = async (id: number) => {
    this.loading = true;
    try {
      await agent.Products.delete(id);
      runInAction(() => {
        this.productRegistry.delete(id);
        this.loading = false;
        this.loadProductArray()
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error deleting news:', error);
      });
    }
  };

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

  setLoadingInitial = (loading: boolean) => {
    this.loadingInitial = loading;
  };

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

  get productArray() {
    return _.orderBy(Array.from(this.productRegistry.values()), ['id'], ['desc']);
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
