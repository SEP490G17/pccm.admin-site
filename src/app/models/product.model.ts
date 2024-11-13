export interface Product {
  id: number;
  productName: string;
  thumbnailUrl: string;
  categoryId: number;
  categoryName: string;
  courtClusterName: string;
  quantity: number;
  importFee: number;
  price: number;
}

export class ProductInput {
  categoryId: number | 2 = 2;
  courtClusterId: number | 2 = 2;
  productName: string = '';
  description: string = '';
  quantity: number | '' = '';
  price: number | '' = '';
  importFee: number | '' = '';
  thumbnailUrl: string = '';

  constructor(data?: Partial<ProductInput>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
