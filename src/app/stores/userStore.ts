import { UserManager } from './../models/user.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleUserData } from '../mock/user.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';

export default class UserStore {
  userRegistry = new Map<number, UserManager>();
  userArray: UserManager[] = [];
  selectedUser: UserManager | undefined = undefined;
  loading: boolean = false;
  userPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('user store initialized');
    this.userPageParams.pageIndex = 1;
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  //#region mock-up
  mockLoadUsers = async () => {
    this.loading = true;
    try {
      sampleUserData.forEach(this.setUser);
      await sleep(1000);
      runInAction(() => {
        this.userPageParams.totalPages = Math.ceil(
          this.userRegistry.size / this.userPageParams.pageSize,
        );
        this.userPageParams.totalElement = this.userRegistry.size;
        this.loadUserArray();
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading users:', error);
      });
    } finally {
      this.loading = false;
    }
  };
  //#endregion

  //#region common
  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin user store');
      this.userPageParams.searchTerm = term;
      this.cleanUserCache();
      this.loadUserArray();
      console.log('term:', term);
    });
  };

  setCurrentPage = (pageIndex: number) => {
    runInAction(() => {
      this.userPageParams.pageIndex = pageIndex;
      this.loadUserArray();
    });
  };

  setPageSize = (size: number) => {
    runInAction(() => {
      this.userPageParams.pageSize = size;
      this.userPageParams.pageIndex = 1;
      this.loadUserArray();
    });
  };  

  loadUserArray = async () => {
    const { pageSize, pageIndex, totalElement } = this.userPageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (
      pageSize * pageIndex > this.userRegistry.size &&
      this.userRegistry.size < totalElement!
    ) {
      await this.mockLoadUsers();
    }
    this.userArray = Array.from(this.userRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

  //#region toggle user activation
  toggleUserActivation = (userId: number) => {
    runInAction(() => {
      const user = this.userArray.find(user => user.id === userId);
      if (user) {
        user.isActivated = !user.isActivated; 
        console.log(`User ${userId} is now ${user.isActivated ? 'active' : 'inactive'}`);
        
        this.mockLoadUsers();  
      }
    });
  };
  //#endregion
  //#region private methods
  private setUser = (user: UserManager) => {
    this.userRegistry.set(user.id, user);
  };

  private cleanUserCache = () => {
    runInAction(() => {
      console.log('cleanUserCache');
      this.userRegistry.clear();
    });
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  //#endregion
}
