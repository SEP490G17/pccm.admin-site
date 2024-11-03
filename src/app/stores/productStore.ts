import { Product, ProductInput } from './../models/product.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleProductData } from '../mock/product.mock';
import { ProductPageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import _ from 'lodash';
import { PaginationModel } from '@/app/models/pagination.model.ts';

export default class ProductStore {
  productRegistry = new Map<number, Product>();
  selectedProduct: ProductInput = new ProductInput();
  selectedIdProduct: number | undefined = undefined;
  loading: boolean = false;
  loadingCreate: boolean = false;
  productPageParams = new ProductPageParams();
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
        .then(this.setProduct)
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Tạo product thất bại');
        })
        .finally(() => (this.loadingCreate = false));
    });
  };

  editProduct = async (product: ProductInput) => {
    this.loading = true;
    await runInAction(async () => {
      if (this.selectedIdProduct) {
        try {
          const updatedProduct = await agent.Products.update(product, this.selectedIdProduct);
          this.productRegistry.delete(this.selectedIdProduct);
          this.setProduct(updatedProduct);
          toast.success('Cập nhật hàng hóa thành công');
        } catch (error) {
          console.error('Error updating product:', error);
          toast.error('Cập nhật hàng hóa thất bại');
        } finally {
          this.loading = false;
        }
      }
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

  filterByCourtCluster = async (term: number) => {
    this.loadingInitial = true;
    await runInAction(async () => {
      this.productRegistry.clear();
      this.productPageParams.clearLazyPage();
      this.productPageParams.courtCluster = term;
      await this.loadProducts();
    });
    this.loadingInitial = false;
  };

  filterByCategory = async (term: number) => {
    this.loadingInitial = true;
    await runInAction(async () => {
      this.productRegistry.clear();
      this.productPageParams.clearLazyPage();
      this.productPageParams.category = term;
      await this.loadProducts();
    });
    this.loadingInitial = false;
  };

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
    this.productRegistry.clear();
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  //#endregion
}
