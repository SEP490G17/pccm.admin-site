export interface ICategory {
  id: number;
  categoryName: string;
}

export class Category implements ICategory {
  id: number = 0;
  categoryName: string;
  constructor(categoryName: string) {
    this.categoryName = categoryName;
  }
}

export class CategoryDTO {
    id: number = 0;
    categoryName: string = '';  
}