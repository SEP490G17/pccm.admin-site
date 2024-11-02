import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ICategory } from '../models/category.model';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import { toast } from 'react-toastify';

export default class CategoryStore {
  loading: boolean = false;
  categoryRegistry = new Map<number, ICategory>();

  constructor() {
    console.log('user store initialized');
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
