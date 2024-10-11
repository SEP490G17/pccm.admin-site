import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import AuthStore from "./authStore";
import NewsStore from "./newsStore";
import BannerStore from "./bannerStore"; 
import CourtStore from "./courtStore";

interface Store {
  commonStore: CommonStore;
  authStore: AuthStore;
  newsStore: NewsStore;
  bannerStore: BannerStore; 
  courtStore: CourtStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  authStore: new AuthStore(),
  newsStore: new NewsStore(),
  bannerStore: new BannerStore(),
  courtStore: new CourtStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
