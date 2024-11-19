import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ICategory } from '../models/category.model';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import { toast } from 'react-toastify';

export default class CategoryStore {
  loading: boolean = false;
  categoryRegistry = new Map<number, ICategory>();
  loadingInitial: boolean = false;

  constructor() {
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  loadCategories = async () => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<ICategory[]>(agent.Categories.list());
    runInAction(() => {
      if (res) {
        res.forEach(this.setCategory);
      }
      if (error) {
        toast.error('Lấy danh sách option thể loại thất bại');
      }
    });
  };

addCategory = async (category: { categoryName: string }) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<ICategory>(agent.Categories.create(category)); 

    runInAction(() => {
        if (res) {
            this.setCategory(res);  // Add to the registry
            toast.success('Thêm thể loại thành công');
        } else if (error) {
            toast.error('Thêm thể loại thất bại');
        }
        this.loading = false;
    });
};

  updateCategory = async (category: ICategory) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<ICategory>(agent.Categories.update(category));

    runInAction(() => {
      if (res) {
        this.setCategory(res); 
        toast.success('Cập nhật thể loại thành công');
      } else if (error) {
        toast.error('Cập nhật thể loại thất bại');
      }
      this.loading = false;
    });
  };

  deleteCategory = async (id: number) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<void>(agent.Categories.delete(id));

    runInAction(() => {
      if (res) {
        this.categoryRegistry.delete(id);
      } else if (error) {
        toast.error('Xóa thể loại thất bại');
      }
      this.loading = false;
    });
  };

  get categoryArray() {
    return Array.from(this.categoryRegistry.values());
  }

  get categoryOption() {
    return this.categoryArray.map((category) => ({
      value: category.id,
      label: category.categoryName,
    }));
  }

  private setCategory = (category: ICategory) => {
    if (category.id) {
      this.categoryRegistry.set(category.id, category);
    }
  };
}
