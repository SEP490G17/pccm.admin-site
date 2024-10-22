import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import AuthStore from "./authStore";
import NewsStore from "./newsStore";
import BannerStore from "./bannerStore"; 
import CourtStore from "./courtStore";
import ProductStore from "./productStore"
import ServiceStore from "./serviceStore";
import StaffStore from "./staffStore";
import UserStore from "./userStore";
import StaffPositionStore from "./staffPositionStore";

interface Store {
  commonStore: CommonStore;
  authStore: AuthStore;
  newsStore: NewsStore;
  bannerStore: BannerStore; 
  courtStore: CourtStore;
  productStore: ProductStore;
  serviceStore: ServiceStore;
  staffStore: StaffStore;
  userStore: UserStore;
  staffPositionStore: StaffPositionStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  authStore: new AuthStore(),
  newsStore: new NewsStore(),
  bannerStore: new BannerStore(),
  courtStore: new CourtStore(),
  productStore: new ProductStore(),
  serviceStore: new ServiceStore(),
  staffStore: new StaffStore(),
  userStore: new UserStore(),
  staffPositionStore: new StaffPositionStore()  // add more stores as needed
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
