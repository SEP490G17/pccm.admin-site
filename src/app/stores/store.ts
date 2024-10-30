import { createContext, useContext } from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';
import NewsStore from './newsStore';
import BannerStore from './bannerStore';
import CourtClusterStore from './courtStore';
import ProductStore from './productStore';
import ServiceStore from './serviceStore';
import StaffStore from './staffStore';
import UserStore from './userStore';
import StaffPositionStore from './staffPositionStore';
import UploadStore from './uploadStore';
import CategoryStore from './categoryStore';
import StatisticStore from './statisticStore';

interface Store {
  commonStore: CommonStore;
  authStore: AuthStore;
  newsStore: NewsStore;
  bannerStore: BannerStore;
  courtStore: CourtClusterStore;
  productStore: ProductStore;
  serviceStore: ServiceStore;
  staffStore: StaffStore;
  userStore: UserStore;
  staffPositionStore: StaffPositionStore;
  uploadStore: UploadStore;
  categoryStore: CategoryStore;
  statisticStore: StatisticStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  authStore: new AuthStore(),
  newsStore: new NewsStore(),
  bannerStore: new BannerStore(),
  courtStore: new CourtClusterStore(),
  productStore: new ProductStore(),
  serviceStore: new ServiceStore(),
  staffStore: new StaffStore(),
  userStore: new UserStore(),
  staffPositionStore: new StaffPositionStore(), // add more stores as needed
  uploadStore: new UploadStore(), // add more stores as needed
  categoryStore: new CategoryStore(), // add more stores as needed
  statisticStore: new StatisticStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
