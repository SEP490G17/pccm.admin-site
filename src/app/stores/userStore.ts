import { CreateUserDTO, UserManager } from './../models/user.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { PageParams } from '../models/pageParams.model';
import agent from '../api/agent';
import { catchErrorHandle } from '../helper/utils';
import { toast } from 'react-toastify';

export default class UserStore {
  userRegistry = new Map<string, UserManager>();
  selectedUser: UserManager | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  loadingDetail: boolean = false;
  loadingCreateUserByStaff: boolean = false;
  userPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  //#region CRUD
  loadUsers = async () => {
    this.loading = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.userPageParams.skip ?? 0}`);
    queryParams.append('pageSize', `${this.userPageParams.pageSize}`);
    if (this.userPageParams.searchTerm) {
      queryParams.append('search', this.userPageParams.searchTerm);
    }
    if (this.userPageParams.filter) {
      queryParams.append('filter', this.userPageParams.filter);
    }
    if (this.userPageParams.sort) {
      queryParams.append('sort', this.userPageParams.sort);
    }
    const [error, res] = await catchErrorHandle(agent.Users.list(`?${queryParams.toString()}`));
    if (error) {
      toast.error('Lấy danh sách người dùng thất bại');
    }
    if (res) {
      const { count, data } = res;
      data.forEach(this.setUser);
      this.userPageParams.totalElement = count;
    }
    this.loading = false;
  };

  loadUserDetails = async (userId: string) => {
    this.loadingDetail = true;
    try {
      const userDetails = await agent.Users.details(userId);
      runInAction(() => {
        this.selectedUser = userDetails;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading user details:', error);
      });
    } finally {
      this.loadingDetail = false;
    }
  };

  createUserStaff = async (data: CreateUserDTO) => {
    this.loadingCreateUserByStaff = true;
    try {
      runInAction(() => {
        agent.Account.createUserByStaff(data).then((s) => {
          this.setUser(s);
          toast.success('Tạo người dùng thành công');
        });
      });
    } catch (error) {
      runInAction(() => {
        console.error('Reset password fail:', error);
      });
    } finally {
      this.loadingCreateUserByStaff = false;
    }
  };

  setLoadingInitial = (load: boolean) => {
    this.loadingInitial = load;
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
  setSearchTerm = async (term: string) => {
    this.loadingInitial = true;
    this.cleanUserCache();
    this.userPageParams.clearLazyPage();
    this.userPageParams.searchTerm = term;
    await this.loadUsers();
    runInAction(() => {
      this.loadingInitial = false;
    });
  };

  setStatusTerm = async (term: string) => {
    this.loadingInitial = true;
    this.cleanUserCache();
    this.userPageParams.clearLazyPage();
    this.userPageParams.sort = term;
    await this.loadUsers();
    runInAction(() => {
      this.loadingInitial = false;
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
