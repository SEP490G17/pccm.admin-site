import { UserManager } from './../models/user.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleUserData } from '../mock/user.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import agent from '../api/agent';

export default class UserStore {
  userRegistry = new Map<string, UserManager>();
  selectedUser: UserManager | undefined = undefined;
  loading: boolean = false;
  userPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('user store initialized');
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  //#region CRUD
  loadUsers = async () => {
    this.loading = true;
    try {
      await runInAction(async () => {
        await agent.Users.list().then((response) => {
          response.data.forEach(this.setUser);
          this.userPageParams.totalElement = response.count;
          this.userPageParams.pageSize = response.pageSize;
        });
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

  //#region mock-up
  // mockLoadUsers = async () => {
  //   this.loading = true;
  //   try {
  //     sampleUserData.forEach(this.setUser);
  //     await sleep(1000);
  //     runInAction(() => {
  //       this.userPageParams.totalPages = Math.ceil(
  //         this.userRegistry.size / this.userPageParams.pageSize,
  //       );
  //       this.userPageParams.totalElement = this.userRegistry.size;
  //       this.loadUserArray();
  //     });
  //   } catch (error) {
  //     runInAction(() => {
  //       console.error('Error loading users:', error);
  //     });
  //   } finally {
  //     this.loading = false;
  //   }
  // };
  //#endregion

  //#region common
  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin user store');
      this.userPageParams.searchTerm = term;
      this.cleanUserCache();
      this.loadUsers();
      console.log('term:', term);
    });
  };

  get userArray() {
    return Array.from(this.userRegistry.values());
  }

  //#region toggle user activation
  // toggleUserActivation = (userId: number) => {
  //   runInAction(() => {
  //     const user = this.userArray.find((user) => user.id === userId);
  //     if (user) {
  //       user.isActivated = !user.isActivated;
  //       console.log(`User ${userId} is now ${user.isActivated ? 'active' : 'inactive'}`);

  //       this.mockLoadUsers();
  //     }
  //   });
  // };
  //#endregion
  //#region private methods
  private setUser = (user: UserManager) => {
    this.userRegistry.set(user.email, user);
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
