import { makeAutoObservable, runInAction } from 'mobx';
import { User, UserFormValues } from '../models/user.model';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';

export default class AuthStore {
  userApp: User | null = null;
  rememberMe: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.userApp;
  }

  setRememberMe = () => {
    this.rememberMe = !this.rememberMe;
    console.log(this.rememberMe);
  };

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      if (this.rememberMe) {
        store.commonStore.setToken(user.token);
      } else {
        store.commonStore.setTokenSession(user.token);
      }
      runInAction(() => {
        this.userApp = user;
        router.navigate('/');
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
    this.userApp = null;
    router.navigate('/login');
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
