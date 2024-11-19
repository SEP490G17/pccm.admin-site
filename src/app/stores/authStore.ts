import { makeAutoObservable, runInAction } from 'mobx';
import { User, UserFormValues } from '../models/user.model';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';
import { catchErrorHandle } from '../helper/utils';

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
  };

  login = async (creds: UserFormValues) => {
    const [err, res] = await catchErrorHandle(agent.Account.login(creds));

    runInAction(() => {
      if (res) {
        if (this.rememberMe) {
          store.commonStore.setToken(res.token);
        } else {
          store.commonStore.setTokenSession(res.token);
        }

        this.userApp = res;
        router.navigate('/');
      }
    });
  };

  logout = () => {
    store.commonStore.setToken(null);
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
    this.userApp = null;
    router.navigate('/login');
  };

  getUser = async () => {
      const user = await agent.Account.current();
      runInAction(() => (this.userApp = user));
  }
}
