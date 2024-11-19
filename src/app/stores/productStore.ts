import { Product, ProductInput, ProductLog } from './../models/product.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleProductData } from '../mock/product.mock';
import { ProductLogPageParams, ProductPageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import _ from 'lodash';
import { PaginationModel } from '@/app/models/pagination.model.ts';

export default class ProductStore {
  productRegistry = new Map<number, Product>();
  productLogRegistry = new Map<number, ProductLog>();
  selectedProduct: ProductInput = new ProductInput();
  selectedIdProduct: number | undefined = undefined;
  loading: boolean = false;
  loadingLog: boolean = false;
  loadingCreate: boolean = false;
  productPageParams = new ProductPageParams();
  productLogPageParams = new ProductLogPageParams();
  cleanupInterval: number | undefined = undefined;
  loadingInitial: boolean = false;
  loadingEdit: boolean = false;

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
    queryParams.append('skip', `${this.productPageParams.skip}`);
    queryParams.append('pageSize', `${this.productPageParams.pageSize}`);
    if (this.productPageParams.searchTerm) {
      queryParams.append('search', this.productPageParams.searchTerm);
    }
    if (this.productPageParams.courtCluster) {
      queryParams.append('courtCluster', `${this.productPageParams.courtCluster}`);
    }
    if (this.productPageParams.category) {
      queryParams.append('category', `${this.productPageParams.category}`);
    }

    const [error, res] = await catchErrorHandle<PaginationModel<Product>>(
      agent.Products.list(`?${queryParams.toString()}`),
    );
    runInAction(() => {
      if (error) {
        console.error('Error loading products:', error);
        toast.error('Lấy danh sách sản phẩm thất bại');
      }
      if (res) {
        const { data, count } = res;
        data.forEach(this.setProduct);
        this.productPageParams.totalElement = count;
      }
      this.loading = false;
    });
  };

  loadProductsLog = async () => {
    this.loadingLog = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.productLogPageParams.skip}`);
    queryParams.append('pageSize', `${this.productLogPageParams.pageSize}`);
    if (this.productLogPageParams.searchTerm) {
      queryParams.append('search', this.productLogPageParams.searchTerm);
    }
    if (this.productLogPageParams.courtCluster) {
      queryParams.append('courtCluster', `${this.productLogPageParams.courtCluster}`);
    }
    if (this.productLogPageParams.LogType) {
      queryParams.append('LogType', `${this.productLogPageParams.LogType}`);
    }
    if (this.productLogPageParams.fromDate != null) {
      queryParams.append('fromDate', this.productLogPageParams.fromDate);
    }
    if (this.productLogPageParams.toDate != null) {
      queryParams.append('toDate', this.productLogPageParams.toDate);
    }

    const [error, res] = await catchErrorHandle<PaginationModel<ProductLog>>(
      agent.Products.listlogs(`?${queryParams.toString()}`),
    );
    runInAction(() => {
      if (error) {
        console.error('Error loading products:', error);
        toast.error('Lấy danh sách sản phẩm thất bại');
      }
      if (res) {
        const { data, count } = res;
        data.forEach(this.setProductLog);
        this.productLogPageParams.totalElement = count;
      }
      this.loadingLog = false;
    });
  };

  detailProduct = async (id: number) => {
    this.setLoadingEdit(true);
    await runInAction(async () => {
      this.selectedIdProduct = id;
      await agent.Products.details(id)
        .then((product) => (this.selectedProduct = product))
        .catch(() => toast.error('Lấy chi tiết sản phẩm thất bại'))
        .finally(() => this.setLoadingEdit(false));
    });
  };

  createProduct = async (product: ProductInput) => {
    this.loadingCreate = true;
    await runInAction(async () => {
      await agent.Products.create(product)
        .then((res) => {
          this.setProduct(res);
          this.loadProductsLog();
        })
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Tạo product thất bại');
        })
        .finally(() => (this.loadingCreate = false));
    });
  };

  editProduct = async (product: ProductInput) => {
    this.loading = true;

    if (this.selectedIdProduct) {
      const [error, res] = await catchErrorHandle<Product>(
        agent.Products.update(product, this.selectedIdProduct),
      );
      runInAction(() => {
        if (!error && res) {
          this.setProduct(res);
          toast.success('Cập nhật hàng hóa thành công');
        }
        if (error) {
          console.error('Error updating product:', error);
          toast.error('Cập nhật hàng hóa thất bại');
        }
        this.loading = false;
      });
    }
  };

  //#endregion

  deleteProduct = async (id: number) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle(agent.Products.delete(id));
    runInAction(() => {
      if (!error && res) {
        this.loadProductsLog();
        this.productRegistry.delete(id);
      }
      this.loading = false;
    });
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
  setLoadingEdit = (load: boolean) => {
    runInAction(() => {
      this.loadingEdit = load;
    });
  };
  setLoadingInitial = (loading: boolean) => {
    this.loadingInitial = loading;
  };

  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    await runInAction(async () => {
      this.cleanProductCache();
      this.productPageParams.clearLazyPage();
      this.productPageParams.searchTerm = term;
      await this.loadProducts();
    });
    this.loadingInitial = false;
  };

  setSearchTermProductLog = async (term: string) => {
    this.loadingInitial = true;
    await runInAction(async () => {
      this.cleanProductLogCache();
      this.productLogPageParams.clearLazyPage();
      this.productLogPageParams.searchTerm = term;
      await this.loadProductsLog();
    });
    this.loadingInitial = false;
  };

  get productArray() {
    return _.orderBy(Array.from(this.productRegistry.values()), ['id'], ['desc']);
  }

  get productLogArray() {
    return _.orderBy(Array.from(this.productLogRegistry.values()), ['id'], ['desc']);
  }

  filterByCategory = async (category: number) => {
    this.loadingInitial = true;
    this.productPageParams.clearLazyPage();
    this.productPageParams.category = category;
    this.cleanProductCache();
    await this.loadProducts();
    runInAction(() => (this.loadingInitial = false));
  };
  filterByCourtCluster = async (courtCluster: number) => {
    this.loadingInitial = true;
    this.productPageParams.clearLazyPage();
    this.productPageParams.courtCluster = courtCluster;
    this.cleanProductCache();
    await this.loadProducts();
    runInAction(() => (this.loadingInitial = false));
  };

  filterLogByCourtCluster = async (courtCluster: number) => {
    this.loadingInitial = true;
    this.productLogPageParams.clearLazyPage();
    this.productLogPageParams.courtCluster = courtCluster;
    this.cleanProductLogCache();
    await this.loadProductsLog();
    runInAction(() => (this.loadingInitial = false));
  };

  filterLogByLogType = async (logTypeId: number) => {
    this.loadingInitial = true;
    this.productLogPageParams.clearLazyPage();
    this.productLogPageParams.LogType = logTypeId;
    this.cleanProductLogCache();
    await this.loadProductsLog();
    runInAction(() => (this.loadingInitial = false));
  };

  filterLogByDate = async (date1: string | null, date2: string | null) => {
    this.loadingInitial = true;
    this.productLogPageParams.clearLazyPage();
    this.productLogPageParams.fromDate = date1 ?? null;
    this.productLogPageParams.toDate = date2 ?? null;
    this.cleanProductLogCache();
    await this.loadProductsLog();
    runInAction(() => (this.loadingInitial = false));
  };
  //#region private methods

  private setProduct = (product: Product) => {
    this.productRegistry.set(product.id, product);
  };

  private setProductLog = (productLog: ProductLog) => {
    this.productLogRegistry.set(productLog.id, productLog);
  };

  private cleanProductCache = () => {
    this.productRegistry.clear();
  };

  private cleanProductLogCache = () => {
    this.productLogRegistry.clear();
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  //#endregion
}
