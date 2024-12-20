import { createContext, useContext } from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';
import NewsStore from './newsStore';
import BannerStore from './bannerStore';
import CourtClusterStore from './courtClusterStore.ts';
import ProductStore from './productStore';
import ServiceStore from './serviceStore';
import StaffStore from './staffStore';
import UserStore from './userStore';
import StaffPositionStore from './staffPositionStore';
import UploadStore from './uploadStore';
import CategoryStore from './categoryStore';
import StatisticStore from './statisticStore';
import revenueStore from './revenueStore';
import BookingClusterStore from './bookingClusterStore.ts';
import PaymentStore from './paymentStore.ts';
import BookingStore from './bookingStore.ts';
import CourtManagerStore from '@/features/court-cluster/CourtsManager/CourtManagerStore.ts';
import SignalRStore from './signalrStore.ts';
import AccountStore from './accountStore.ts';

interface Store {
  commonStore: CommonStore;
  authStore: AuthStore;
  newsStore: NewsStore;
  bannerStore: BannerStore;
  courtClusterStore: CourtClusterStore;
  productStore: ProductStore;
  serviceStore: ServiceStore;
  staffStore: StaffStore;
  userStore: UserStore;
  staffPositionStore: StaffPositionStore;
  uploadStore: UploadStore;
  categoryStore: CategoryStore;
  statisticStore: StatisticStore;
  revenueStore: revenueStore;
  bookingClusterStore: BookingClusterStore;
  paymentStore: PaymentStore;
  bookingStore: BookingStore;
  courtManagerStore: CourtManagerStore;
  signalrStore: SignalRStore;
  accountStore: AccountStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  authStore: new AuthStore(),
  newsStore: new NewsStore(),
  bannerStore: new BannerStore(),
  courtClusterStore: new CourtClusterStore(),
  productStore: new ProductStore(),
  serviceStore: new ServiceStore(),
  staffStore: new StaffStore(),
  userStore: new UserStore(),
  staffPositionStore: new StaffPositionStore(), // add more stores as needed
  uploadStore: new UploadStore(), // add more stores as needed
  categoryStore: new CategoryStore(), // add more stores as needed
  statisticStore: new StatisticStore(),
  revenueStore: new revenueStore(),
  bookingStore: new BookingStore(), // add more stores as needed
  bookingClusterStore: new BookingClusterStore(),
  paymentStore: new PaymentStore(), // add more stores as needed
  courtManagerStore: new CourtManagerStore(), // add more stores as needed
  signalrStore: new SignalRStore(),
  accountStore: new AccountStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
