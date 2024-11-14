import { makeAutoObservable } from 'mobx';
import { OrderCreate, OrderForProducts, OrderOfBooking } from '../models/order.model';
import { catchErrorHandle } from '../helper/utils';
import agent from '../api/agent';

export default class OrderStore {
  loadingInitial: boolean = false;

  selectedProductItems = new Map<number, number>();
  selectedServiceItems = new Map<number, number>();
  totalProductAmount: number = 0;
  totalServiceAmount: number = 0;
  constructor() {
    makeAutoObservable(this);
  }

  createOrder = async (bookingId: number, toast: any) => {
    const model: OrderCreate = {
      bookingId: bookingId,
      orderForProducts: Array.from(this.selectedProductItems, ([productId, quantity]) => ({
        productId,
        quantity,
      })),
      orderForServices: Array.from(this.selectedServiceItems, ([serviceId]) => ({
        serviceId,
      })),
    };
    const [err, res] = await catchErrorHandle<OrderOfBooking>(agent.OrderAgent.create(model));
    return { res, err };
  };

  addProductToOrder = (productId: number) => {
    const total = this.selectedProductItems.get(productId);
    if (total) {
      this.selectedProductItems.set(productId, total + 1);
    } else {
      this.selectedProductItems.set(productId, 1);
    }
  };

  get arrayObjectProductConvert(): OrderForProducts[] {
    return Array.from(this.selectedProductItems, ([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  minusProductToOrder = (productId: number) => {
    const total = this.selectedProductItems.get(productId);
    if (total && total > 1) {
      this.selectedProductItems.set(productId, total - 1);
    } else {
      this.selectedProductItems.delete(productId);
    }
  };

  removeProductFromOrder = (productId: number) => {
    this.selectedProductItems.delete(productId);
  };

  addServiceToOrder = (serviceId: number) => {
    const total = this.selectedServiceItems.get(serviceId);
    if (!total) {
      this.selectedServiceItems.set(serviceId, 1);
    }
  };

  removeServiceFromOrder = (serviceId: number) => {
    this.selectedServiceItems.delete(serviceId);
  };

  get ProductItemIdArray() {
    return Array.from(this.selectedProductItems.keys());
  }

  get ServiceItemIdArray() {
    return Array.from(this.selectedServiceItems.keys());
  }

  get totalAllAmount() {
    return this.totalProductAmount + this.totalServiceAmount;
  }

  setTotalProductAmount(amount: number) {
    this.totalProductAmount += amount;
  }
}
