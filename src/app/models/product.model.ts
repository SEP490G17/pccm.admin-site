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

export class ProductCreate {
  categoryId: number|2  = 2;
  courtClusterId: number | 2 = 2;
  productName: string = '';
  description: string = '';
  quantity: number | '' = '';
  price: number | '' = '';
  thumbnail: string = '';

  constructor(data?: Partial<ProductCreate>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
