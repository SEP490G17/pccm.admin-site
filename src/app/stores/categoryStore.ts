import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ICategory } from '../models/category.model';
import { catchErrorHandle } from '@/app/helper/utils.ts';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { CategoryMessage } from '../common/toastMessage/categoryMessage';

export default class CategoryStore {
  loading: boolean = false;
  categoryRegistry = new Map<number, ICategory>();
  loadingInitial: boolean = false;

  constructor() {
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  loadCategories = async (toast: CreateToastFnReturn) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<ICategory[]>(agent.Categories.list());
    runInAction(() => {
      if (res) {
        res.forEach(this.setCategory);
      }
      if (error) {
        toast(CategoryMessage.loadingFailure());
      }
    });
  };

  addCategory = async (category: { categoryName: string }, toast: CreateToastFnReturn) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<ICategory>(agent.Categories.create(category));

    runInAction(() => {
      if (res) {
        this.setCategory(res); // Add to the registry
        toast(CategoryMessage.createSuccess());
      }
      if (error) {
        toast(CategoryMessage.createFailure());
      }
      this.loading = false;
    });
  };

  updateCategory = async (category: ICategory, toast: CreateToastFnReturn) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<ICategory>(agent.Categories.update(category));

    runInAction(() => {
      if (res) {
        this.setCategory(res);
        toast(CategoryMessage.updateSuccess());
      }
      if (error) {
        toast(CategoryMessage.updateFailure());
      }
      this.loading = false;
    });
  };

  deleteCategory = async (id: number, toast: CreateToastFnReturn) => {
    this.loading = true;
    const [error, res] = await catchErrorHandle<void>(agent.Categories.delete(id));

    runInAction(() => {
      if (res) {
        this.categoryRegistry.delete(id);
        toast(CategoryMessage.deleteSuccess());
      }
      if (error) {
        toast(CategoryMessage.deleteFailure());
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
