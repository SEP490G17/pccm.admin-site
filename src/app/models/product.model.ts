export interface Product {
  id: number;
  productName: string;
  thumbnailUrl: string;
  categoryId: number;
  categoryName: string;
  courtClusterName: string;
  quantity: number;
  price: number;
}

export class ProductInput {
  categoryId: number|2  = 2;
  courtClusterId: number | 2 = 2;
  productName: string = '';
  description: string = '';
  quantity: number | '' = '';
  price: number | '' = '';
  thumbnailUrl: string = '';

  constructor(data?: Partial<ProductInput>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
