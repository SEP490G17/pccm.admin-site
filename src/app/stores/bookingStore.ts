import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { BookingConflict, BookingDetails, BookingForList } from '../models/booking.model';
import {
  calculateTimeDifferenceInHours,
  catchErrorHandle,
  convertBookingStartAndEndUTCToG7,
} from '../helper/utils';
import {
  OrderModel,
  ProductsForOrderCreate,
  OrderOfBooking,
  ProductForOrderDetails,
  ServiceForOrderDetails,
  OrderModelUpdate,
} from '../models/order.model';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { Product } from '../models/product.model';
import { Service } from '../models/service.model';
import { BookingPageParams } from '../models/pageParams.model';
import { PaginationModel } from '../models/pagination.model';
import { BookingMessage } from '../common/toastMessage/bookingMessage';
import { OrderMessage } from '../common/toastMessage/orderMessage';
import { CommonMessage, PaymentMessage } from '../common/toastMessage/commonMessage';
import { store } from './store';
import { PaymentStatus } from '../models/payment.model';
import _ from 'lodash';
export default class BookingStore {
  loadingInitial: boolean = false;
  loading: boolean = false;
  loadingOrder: boolean = false;
  loadingConflict: boolean = false;
  bookingConflict: BookingForList[] = [];
  selectedBooking?: BookingDetails;
  orderOfBooking: OrderOfBooking[] = [];
  selectedProductItems = new Map<number, number>();
  selectedServiceItems = new Map<number, number>();
  totalProductAmount = 0;
  totalServiceAmount = 0;

  selectedOrder?: OrderModelUpdate;
  updateProductItems = new Map<number, ProductForOrderDetails>();
  updateServiceItems = new Map<number, ServiceForOrderDetails>();

  bookingRegistry = new Map<number, BookingForList>();
  bookingPageParams = new BookingPageParams();
  constructor() {
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  //#region  Booking handle function

  loadBookingAll = async (toast: CreateToastFnReturn) => {
    this.loading = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.bookingPageParams.skip}`);
    queryParams.append('pageSize', `${this.bookingPageParams.pageSize}`);
    if (this.bookingPageParams.courtClusterId) {
      queryParams.append('courtClusterId', `${this.bookingPageParams.courtClusterId}`);
    }
    if (this.bookingPageParams.searchTerm) {
      queryParams.append('search', this.bookingPageParams.searchTerm);
    }
    if (this.bookingPageParams.fromDate != null) {
      queryParams.append('fromDate', this.bookingPageParams.fromDate);
    }
    if (this.bookingPageParams.toDate != null) {
      queryParams.append('toDate', this.bookingPageParams.toDate);
    }
    if (this.bookingPageParams.status != null) {
      queryParams.append('status', `${this.bookingPageParams.status}`);
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
      this.loading = false;
    });
  };

  setSearchTerm = async (term: string, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.bookingPageParams.clearLazyPage();
    this.bookingPageParams.searchTerm = term;
    this.bookingRegistry.clear();
    await this.loadBookingAll(toast);
    runInAction(() => {
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

  filterByStatus = async (status: number, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.bookingPageParams.clearLazyPage();
    this.bookingPageParams.status = status;
    this.bookingRegistry.clear();
    await this.loadBookingAll(toast);
    runInAction(() => (this.loadingInitial = false));
  };

  filterByDate = async (date1: string | null, date2: string | null, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    this.bookingPageParams.clearLazyPage();
    this.bookingPageParams.fromDate = date1;
    this.bookingPageParams.toDate = date2;
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

  clearDetailsBooking = () => {
    this.selectedBooking = undefined;
  };

  //#endregion

  //#region  Order function handle

  pushOrderForBooking = (order: OrderOfBooking) => {
    if (this.selectedBooking) {
      this.orderOfBooking.push(order);
      const booking = { ...this.selectedBooking };
      booking.ordersOfBooking = this.orderOfBooking;
      this.selectedBooking = booking;
    }
  };

  cancelOrder = async (orderId: number, courtClusterId:number ,toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage('Hủy Order'));

    const [err, res] = await catchErrorHandle<any>(agent.OrderAgent.cancel(orderId));
    runInAction(() => {
      toast.close(pending);
      if (res) {
        toast(OrderMessage.cancelSuccess());
        const index = this.orderOfBooking.findIndex((o) => o.id === orderId);
        if (index) {
          const newOrder = { ...this.orderOfBooking[index] };
          newOrder.paymentStatus = PaymentStatus.Cancel;
          this.orderOfBooking[index] = newOrder;
          const size = store.courtClusterStore.productOfClusterRegistry.size;
          const oldPageSize = store.courtClusterStore.productCourtClusterPageParams.pageSize;
          store.courtClusterStore.productCourtClusterPageParams.skip = 0;
          store.courtClusterStore.productCourtClusterPageParams.pageSize = size;
          store.courtClusterStore.loadProductsOfCourtCluster(courtClusterId,toast);
          store.courtClusterStore.productCourtClusterPageParams.skip = size;
          store.courtClusterStore.productCourtClusterPageParams.pageSize = oldPageSize;
        }
      }
      if (err) {
        toast(OrderMessage.cancelFailure());
      }
    });
  };

  orderPaymentSuccess = async (id: number, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage('Xác thực thanh toán'));
    const [err, res] = await catchErrorHandle(agent.OrderAgent.paymentSuccess(id));
    runInAction(() => {
      toast.close(pending);
      if (res) {
        toast(PaymentMessage.success());
        const index = this.orderOfBooking.findIndex((o) => o.id === id);
        if (index) {
          const newOrder = { ...this.orderOfBooking[index] };
          newOrder.paymentStatus = PaymentStatus.Success;
          this.orderOfBooking[index] = newOrder;
        }
      }
      if (err) {
        toast(PaymentMessage.failure());
      }
    });
  };

  clearOrderList = () => {
    this.selectedProductItems.clear();
    this.selectedServiceItems.clear();
    this.totalProductAmount = 0;
    this.totalServiceAmount = 0;
  };

  get ProductUpdateArray() {
    return Array.from(this.updateProductItems.values());
  }

  get ServiceUpdateArray() {
    return Array.from(this.updateServiceItems.values());
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
  //#endregion

  //#region  bill
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

  //#endregion

  getBookingConflict = async (booking: BookingConflict, toast: CreateToastFnReturn) => {
    this.loadingConflict = true;
    const [err, res] = await catchErrorHandle(agent.BookingAgent.getListConflict(booking));
    runInAction(() => {
      if (err) {
        toast(BookingMessage.getConfligFailure());
      }
      if (res) {
        this.bookingConflict = res;
      }
      this.loadingConflict = false;
    });
  };

  readonly setBooking = (booking: BookingForList) => {
    this.bookingRegistry.set(booking.id, convertBookingStartAndEndUTCToG7(booking));
  };

  //#region  create Order
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
        toast(OrderMessage.createFailure(err?.response?.data));
      }
    });
    return { res, err };
  };

  addProductToOrder = (productId: number) => {
    const total = this.selectedProductItems.get(productId);
    const product = store.courtClusterStore.productOfClusterRegistry.get(productId);
    if (product && product.quantity > 0) {
      product.quantity -= 1;
      store.courtClusterStore.productOfClusterRegistry.set(productId, product);
      if (total) {
        this.selectedProductItems.set(productId, total + 1);
      } else {
        this.selectedProductItems.set(productId, 1);
      }
    }
  };

  minusProductToOrder = (productId: number) => {
    const total = this.selectedProductItems.get(productId);
    if (total && total > 1) {
      this.selectedProductItems.set(productId, total - 1);
    } else {
      this.selectedProductItems.delete(productId);
    }
    const product = store.courtClusterStore.productOfClusterRegistry.get(productId);
    if (product) {
      product.quantity += 1;
      store.courtClusterStore.productOfClusterRegistry.set(productId, product);
    }
  };

  removeProductFromOrder = (productId: number) => {
    const product = store.courtClusterStore.productOfClusterRegistry.get(productId);
    const quantity = this.selectedProductItems.get(productId);
    if (product && quantity) {
      product.quantity += quantity;
      store.courtClusterStore.productOfClusterRegistry.set(productId, product);
    }
    this.selectedProductItems.delete(productId);
  };

  get ProductItemIdArray() {
    return Array.from(this.selectedProductItems.keys());
  }

  get arrayObjectProductConvert(): ProductsForOrderCreate[] {
    return Array.from(this.selectedProductItems, ([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  addServiceToOrder = (serviceId: number) => {
    const total = this.selectedServiceItems.get(serviceId);
    if (!total) {
      this.selectedServiceItems.set(serviceId, 1);
    }
  };

  removeServiceFromOrder = (serviceId: number) => {
    this.selectedServiceItems.delete(serviceId);
  };

  get ServiceItemIdArray() {
    return Array.from(this.selectedServiceItems.keys());
  }

  resetOnClose = () =>{
    this.ProductItemIdArray.forEach((p) =>{
      const productSelected = this.selectedProductItems.get(p);
      if(productSelected){
        const product = store.courtClusterStore.productOfClusterRegistry.get(p);
        if(product){
          product.quantity += productSelected;
          store.courtClusterStore.productOfClusterRegistry.set(p, product);
        }
      }
    })

    this.selectedProductItems.clear();
    this.selectedServiceItems.clear();
    
  }

  //#endregion

  //#region update Order

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
        res.orderForProducts.forEach((product) =>
          this.updateProductItems.set(product.productId, product),
        );
        res.orderForServices.forEach((service) =>
          this.updateServiceItems.set(service.serviceId, service),
        );
      }
      this.loadingOrder = false;
    });
  };

  updateOrder = async (toast: CreateToastFnReturn) => {
    if (this.selectedOrder) {
      const pending = toast(CommonMessage.loadingMessage('UpdateOrder'));
      const newOrderForProducts = Array.from(this.updateProductItems.values(), (item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const newOrderForServices = Array.from(this.updateServiceItems.values(), (item) => ({
        serviceId: item.serviceId,
      }));

      const objectSend: OrderModel = {
        bookingId: this.selectedOrder.bookingId,
        orderForProducts: newOrderForProducts,
        orderForServices: newOrderForServices,
        id: this.selectedOrder.id,
      };

      const [err, res] = await catchErrorHandle<OrderOfBooking>(
        agent.OrderAgent.update(objectSend),
      );
      runInAction(() => {
        toast.close(pending);
        if (res) {
          toast(OrderMessage.createSuccess());
          const index = this.orderOfBooking.findIndex((o) => o.id == this.selectedOrder?.id);
          const newOrderOfBooking = [...this.orderOfBooking]
          newOrderOfBooking[index] = res;
          this.orderOfBooking = newOrderOfBooking;
          if(this.selectedBooking){
            const booking = { ...this.selectedBooking };
            booking.ordersOfBooking = [...this.orderOfBooking];
            this.selectedBooking = booking;
          }
        }
        if (err) {
          toast(OrderMessage.createFailure(err.message));
        }
      });
      return { res, err };
    }
  };
  addProductToOrderUpdate = (productId: number) => {
    const orderProduct = this.updateProductItems.get(productId);
    const product = store.courtClusterStore.productOfClusterRegistry.get(productId);
    if (product && product.quantity > 0) {
      product.quantity -= 1;
      store.courtClusterStore.productOfClusterRegistry.set(productId, product);
      if (orderProduct) {
        const newProduct = { ...orderProduct };
        newProduct.quantity += 1;
        this.updateProductItems.set(productId, newProduct);
      } else {
        const newProduct: ProductForOrderDetails = {
          price: product.price,
          currPrice: product.price,
          totalPrice: product.price,
          currTotalPrice: product.price,
          productId,
          productName: product.productName,
          quantity: 1,
        };
        this.updateProductItems.set(productId, newProduct);
      }
    }
  };

  minusProductToOrderUpdate = (productId: number) => {
    const orderProduct = this.updateProductItems.get(productId);
    if (orderProduct && orderProduct.quantity > 1) {
      const newOrder = {...orderProduct};
      newOrder.quantity -= 1;
      this.updateProductItems.set(productId, newOrder);
    } else {
      this.updateProductItems.delete(productId);
    }

    const product = store.courtClusterStore.productOfClusterRegistry.get(productId);
    if (product) {
      product.quantity += 1;
      store.courtClusterStore.productOfClusterRegistry.set(productId, product);
    }
  };

  removeProductFromOrderUpdate = (productId: number) => {
    const product = store.courtClusterStore.productOfClusterRegistry.get(productId);
    const orderProduct = this.updateProductItems.get(productId);
    if (product && orderProduct) {
      product.quantity += orderProduct.quantity;
      store.courtClusterStore.productOfClusterRegistry.set(productId, product);
    }
    this.updateProductItems.delete(productId);
  };

  addServiceToOrderUpdate = (serviceId: number) => {
    const check = this.updateServiceItems.get(serviceId);
    const service = store.courtClusterStore.servicesOfClusterRegistry.get(serviceId); 
    if (!check && service) {
      const newService: ServiceForOrderDetails ={
        serviceId: service.id,
        serviceName:service.serviceName,
        currPrice: service.price,
        price: service.price,
      }
      this.updateServiceItems.set(serviceId, newService);
    }
  };

  removeServiceFromOrderUpdate = (serviceId: number) => {
    this.updateServiceItems.delete(serviceId);
  };

  getTotalProductAmountForUpdate(productOfClusterRegistry?: Map<number, Product>) {
    if (
      productOfClusterRegistry &&
      this.ProductUpdateArray 
    ) {
      let sum = 0;
      this.ProductUpdateArray.forEach((p) => {
        const product = productOfClusterRegistry.get(p.productId);
        if (product) {
          sum += product.price * p.quantity;
        }
      });
      this.totalProductAmount = sum;
      return sum;
    }
    return 0;
  }

  getTotalServiceAmountForUpdate(serviceOfClusterRegistry?: Map<number, Service>) {
    if (
      this.selectedBooking &&
      serviceOfClusterRegistry &&
      this.updateServiceItems
    ) {
      const [startTime, endTime] = this.selectedBooking.bookingDetails.playTime.split('-');
      const playHours = calculateTimeDifferenceInHours(startTime, endTime);
      let sum = 0;
      this.updateServiceItems.forEach((s) => {
        const service = serviceOfClusterRegistry.get(s.serviceId);
        if (service) {
          sum += service.price * playHours;
        }
      });
      this.totalServiceAmount = sum;
      return sum;
    }
    return 0;
  }

  //#endregion

  lastPayment = () =>{
    if(this.selectedBooking){

      return this.selectedBooking.bookingDetails.totalPrice + _.sumBy(this.selectedBooking.ordersOfBooking, 'totalAmount');
    }
    return 0;
  }
}
