import { makeAutoObservable, runInAction } from 'mobx';
import { ResetPasswordDTO, User, UserFormValues } from '../models/user.model';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';
import { catchErrorHandle } from '../helper/utils';

export default class AuthStore {
  userApp: User | null = null;
  rememberMe: boolean = false;
  loadingReset: boolean = false;

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
          store.commonStore.setToken(res.token);
          store.commonStore.setUserApp(res);
          this.userApp = res;
          router.navigate('/');
      }
    });
    return { err, res };
  };

  logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    store.commonStore.clearAll();
    this.userApp = null;
    router.navigate('/login');
  };

  resetPassword = async (data: ResetPasswordDTO) => {
    this.loadingReset = true;
    try {
      runInAction(() => {
        agent.Account.resetPassword(data);
      });
    } catch (error) {
      runInAction(() => {
        console.error('Reset password fail:', error);
      });
    } finally {
      this.loadingReset = false;
    }
  };

  getUser = async () => {
    const user = await agent.Account.current();
    runInAction(() => {
      this.userApp = user;
      store.commonStore.setUserApp(user);
    });
  };
}
