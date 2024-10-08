import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user.model";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class AuthStore {
  userApp: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.userApp;
  }

  login = async (creds: UserFormValues, rememberMe: boolean) => {
    try {
      const user = await agent.Account.login(creds);
      if (rememberMe) {
        store.commonStore.setToken(user.token);
      } else {
        store.commonStore.setTokenSession(user.token);
      }
      runInAction(() => {
        this.userApp = user;
        router.navigate("/");
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.userApp = user));
      router.navigate("/");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    localStorage.removeItem("jwt");
    this.userApp = null;
    router.navigate("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => (this.userApp = user));
    } catch (error) {
      console.log(error);
    }
  };
}
