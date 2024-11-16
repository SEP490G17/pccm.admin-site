import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { BookingDetails, BookingForList } from '../models/booking.model';
import {
  calculateTimeDifferenceInHours,
  catchErrorHandle,
  convertBookingStartAndEndUTCToG7,
} from '../helper/utils';
import { BookingMessage, CommonMessage, OrderMessage } from '../common/toastMessage';
import { OrderModel, OrderForProducts, OrderOfBooking } from '../models/order.model';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { Product } from '../models/product.model';
import { Service } from '../models/service.model';
import { BookingPageParams } from '../models/pageParams.model';
import { PaginationModel } from '../models/pagination.model';

export default class BookingStore {
  loadingInitial: boolean = false;
  loadingOrder: boolean = false;

  selectedBooking?: BookingDetails;
  orderOfBooking: OrderOfBooking[] = [];
  selectedProductItems = new Map<number, number>();
  selectedServiceItems = new Map<number, number>();
  totalProductAmount = 0;
  totalServiceAmount = 0;

  selectedOrder?: OrderModel;
  bookingRegistry = new Map<number, BookingForList>();
  bookingPageParams = new BookingPageParams();
  constructor() {
    console.log('user store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  loadBookingAll = async (toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.bookingPageParams.skip}`);
    queryParams.append('pageSize', `${this.bookingPageParams.pageSize}`);
    if (this.bookingPageParams.courtClusterId) {
      queryParams.append('courtClusterId', `${this.bookingPageParams.courtClusterId}`);
    }
    if (this.bookingPageParams.searchTerm) {
      if (this.bookingPageParams.searchTerm) {
        queryParams.append('search', this.bookingPageParams.searchTerm);
      }
    }
    const [err, res] = await catchErrorHandle<PaginationModel<BookingForList>>(
      agent.BookingAgent.getListV2(`?${queryParams.toString()}`),
    );

    runInAction(() => {
      if (err) {
        toast(BookingMessage.loadPendingFailure());
      }
      if (!err && res) {
        res.data.forEach((booking) => {
          this.setBooking(booking);
        });
        this.bookingPageParams.pageSize = res.pageSize;
        this.bookingPageParams.skip = this.bookingRegistry.size;
        this.bookingPageParams.totalElement = res.count;
      }
      this.loadingInitial = false;
    });
  };

  filterByCourtCluster = async (courtCluster: number, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.bookingPageParams.clearLazyPage();
    this.bookingPageParams.courtClusterId = courtCluster;
    this.bookingRegistry.clear();
    await this.loadBookingAll(toast);
    runInAction(() => (this.loadingInitial = false));
  };
  get bookingArray() {
    return Array.from(this.bookingRegistry.values());
  }

  getDetailsBooking = async (id: number, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    const [err, res] = await catchErrorHandle(agent.BookingAgent.getDetailsV1(id));
    runInAction(() => {
      if (err) {
        toast(BookingMessage.getDetailFailure());
      }
      if (res) {
        this.selectedBooking = res;
        this.orderOfBooking = this.selectedBooking.ordersOfBooking;
      }
      this.loadingInitial = false;
    });
  };

  getDetailsOrder = async (id: number, toast: CreateToastFnReturn) => {
    this.clearOrderList();
    this.loadingOrder = true;
    const [err, res] = await catchErrorHandle(agent.OrderAgent.details(id));
    runInAction(() => {
      if (err) {
        toast(BookingMessage.getDetailFailure());
      }
      if (res) {
        this.selectedOrder = res;
        res.orderForProducts.map((product) =>
          this.selectedProductItems.set(product.productId, product.quantity),
        );
        res.orderForServices.map((service) => this.selectedServiceItems.set(service.serviceId, 1));
      }
      this.loadingOrder = false;
    });
  };

  pushOrderForBooking = (order: OrderOfBooking) => {
    console.log('begin push');
    if (this.selectedBooking) {
      console.log('pushing order');
      this.selectedBooking.ordersOfBooking.push(order);
      this.orderOfBooking.push(order);
    }
  };

  createOrder = async (bookingId: number, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage('Tạo Order'));
    const model: OrderModel = {
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
    runInAction(() => {
      toast.close(pending);
      if (res) {
        toast(OrderMessage.createSuccess());
        this.pushOrderForBooking(res);
      }
      if (err) {
        toast(OrderMessage.createFailure(err.message));
      }
    });
    return { res, err };
  };

  updateOrder = async (toast: CreateToastFnReturn) => {
    if (this.selectedOrder) {
      const pending = toast(CommonMessage.loadingMessage('UpdateOrder'));
      this.selectedOrder = {
        ...this.selectedOrder,
        orderForProducts: Array.from(this.selectedProductItems, ([productId, quantity]) => ({
          productId,
          quantity,
        })),
        orderForServices: Array.from(this.selectedServiceItems, ([serviceId]) => ({
          serviceId,
        })),
      };

      const [err, res] = await catchErrorHandle<OrderOfBooking>(
        agent.OrderAgent.update(this.selectedOrder),
      );
      runInAction(() => {
        toast.close(pending);
        if (res) {
          toast(OrderMessage.createSuccess());
          const index = this.orderOfBooking.findIndex((o) => o.id == this.selectedOrder?.id);
          this.orderOfBooking[index] = res;
        }
        if (err) {
          toast(OrderMessage.createFailure(err.message));
        }
      });
      return { res, err };
    }
  };
  private setBooking = (booking: BookingForList) => {
    this.bookingRegistry.set(booking.id, convertBookingStartAndEndUTCToG7(booking));
  };
  clearOrderList = () => {
    this.selectedProductItems.clear();
    this.selectedServiceItems.clear();
    this.totalProductAmount = 0;
    this.totalServiceAmount = 0;
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

  getTotalProductAmount(productOfClusterRegistry?: Map<number, Product>) {
    if (
      productOfClusterRegistry &&
      this.selectedProductItems &&
      this.selectedProductItems.size > 0
    ) {
      let sum = 0;
      this.selectedProductItems.forEach((quantity, productId) => {
        const product = productOfClusterRegistry.get(productId);
        if (product) {
          sum += product.price * quantity;
        }
      });
      this.totalProductAmount = sum;
      return sum;
    }
    return 0;
  }

  getTotalServiceAmount(serviceOfClusterRegistry?: Map<number, Service>) {
    if (
      this.selectedBooking &&
      serviceOfClusterRegistry &&
      this.selectedServiceItems &&
      this.selectedServiceItems.size > 0
    ) {
      const [startTime, endTime] = this.selectedBooking.bookingDetails.playTime.split('-');
      const playHours = calculateTimeDifferenceInHours(startTime, endTime);
      let sum = 0;
      this.selectedServiceItems.forEach((quantity, serviceId) => {
        const service = serviceOfClusterRegistry.get(serviceId);
        if (service) {
          sum += service.price * playHours;
        }
      });
      this.totalServiceAmount = sum;
      return sum;
    }
    return 0;
  }

  exportBill = (courtClusterId: number) => {
    runInAction(async () => {
      try {
        const response = await agent.BookingAgent.exportBill(courtClusterId);
        const byteCharacters = atob(response.fileContents);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(
            offset,
            Math.min(byteCharacters.length, offset + 1024),
          );
          const byteArray = new Uint8Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteArray[i] = slice.charCodeAt(i);
          }

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `Hoa_don.pdf`);

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export bill:', error);
      }
    });
  };

  exportBillOrder = (orderId: number) => {
    runInAction(async () => {
      try {
        const response = await agent.BookingAgent.exportBillOrder(orderId);
        const byteCharacters = atob(response.fileContents);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(
            offset,
            Math.min(byteCharacters.length, offset + 1024),
          );
          const byteArray = new Uint8Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteArray[i] = slice.charCodeAt(i);
          }

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `Hoa_don.pdf`);

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export bill:', error);
      }
    });
  };
}
