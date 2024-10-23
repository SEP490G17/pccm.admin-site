export interface ICategory {
  id?: number;
  categoryName: string;
}

export class Category implements ICategory {
  id?: number;
  categoryName: string;
  constructor(categoryName: string) {
    this.categoryName = categoryName;
  }
}
