import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ICategory } from '../models/category.model';

export default class CategoryStore {
  loading: boolean = false;
  categoryRegistry = new Map<number, ICategory>();
  constructor() {
    console.log('user store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  loadCategories = () => {
    this.loading = true;
    runInAction(() => {
      agent.Categories.list().then((cat) => {
        cat.forEach(this.setCategory);
      });
    });
  };

  get categoryArray() {
    return Array.from(this.categoryRegistry.values());
  }

  get categoryOption() {
    return this.categoryArray.map((category) => ({
      value: category.id??'',
      label: category.categoryName,
    }));
  }

  private setCategory = (category: ICategory) => {
    if (category.id) {
      this.categoryRegistry.set(category.id, category);
    }
  };
}
