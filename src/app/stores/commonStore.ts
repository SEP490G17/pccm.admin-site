import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ServeError } from '../models/serverError.model';

export default class CommonStore {
  error: ServeError | null = null;
  token: string | null = localStorage.getItem('jwt');
  appLoaded = false;
  isCollapsed = false;
  selectedMenuItem: number = 1;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem('jwt', token);
        } else {
          localStorage.removeItem('jwt');
        }
      },
    );
  }
  setServerError(err: ServeError) {
    this.error = err;
  }

  setToken = (token: string | null) => {
    if (token) localStorage.setItem('jwt', token);
    this.token = token;
  };
  setTokenSession = (token: string | null) => {
    if (token) sessionStorage.setItem('jwt', token);
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };

  toggleSidebar = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  setSelectedMenuItem = (key: number) => runInAction(() => (this.selectedMenuItem = key));
  setCollapsed = () => {runInAction(() => this.isCollapsed = !this.isCollapsed)}
}
