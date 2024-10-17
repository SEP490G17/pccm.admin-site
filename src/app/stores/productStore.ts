import { Product } from './../models/product.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleProductData } from '../mock/product.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';

export default class ProductStore {
  productRegistry = new Map<number, Product>();
  productArray: Product[] = [];
  selectedProduct: Product | undefined = undefined;
  loading: boolean = false;
  productPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('product store initialized');
    this.productPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanProductCache, 30000);
  }

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
  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin product store');
      this.productPageParams.searchTerm = term;
      this.cleanProductCache();
      this.loadProductArray();
      console.log('term:', term);
    });
  };

  setCurrentPage = (pageIndex: number) => {
    runInAction(() => {
      this.productPageParams.pageIndex = pageIndex;
      this.loadProductArray();
    });
  };

  setPageSize = (size: number) => {
    runInAction(() => {
      this.productPageParams.pageSize = size;
      this.productPageParams.pageIndex = 1;
      this.loadProductArray();
    });
  };

  loadProductArray = async () => {
    const { pageSize, pageIndex, totalElement } = this.productPageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (
      pageSize * pageIndex > this.productRegistry.size &&
      this.productRegistry.size < totalElement!
    ) {
      await this.mockLoadProducts();
    }
    this.productArray = Array.from(this.productRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

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
