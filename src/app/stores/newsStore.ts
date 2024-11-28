import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { News, NewsDTO } from '../models/news.models';
import { sampleNewsData } from '../mock/news.mock';
import { PageParams } from '../models/pageParams.model';
import { catchErrorHandle, sleep } from '../helper/utils';
import _ from 'lodash';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { NewsMessage } from '../common/toastMessage/newsMessage';
import { CommonMessage } from '../common/toastMessage/commonMessage';

export default class NewsStore {
  newsRegistry = new Map<number, News>();
  selectedNews: News | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  newsPageParams = new PageParams();
  isOrigin: boolean = true;
  isLoadingEdit: boolean = false;
  isloadingStatus: boolean = false;
  loadingStatusMap = new Map<number, boolean>();

  constructor() {
    makeAutoObservable(this);
  }
  //#region CRUD

  loadNews = async (toast: CreateToastFnReturn) => {
    this.loading = true;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', `${this.newsPageParams.skip ?? 0}`);
    queryParams.append('pageSize', `${this.newsPageParams.pageSize}`);
    if (this.newsPageParams.searchTerm) {
      queryParams.append('search', this.newsPageParams.searchTerm);
    }
    if (this.newsPageParams.filter) {
      queryParams.append('filter', this.newsPageParams.filter);
    }
    const [err, res] = await catchErrorHandle(agent.NewsAgent.list(`?${queryParams.toString()}`));

    runInAction(() => {
      if (err) {
        toast(NewsMessage.loadingFailure());
      }
      if (res) {
        const { count, data } = res;
        data.forEach(this.setNews);
        this.newsPageParams.totalElement = count;
      }
      this.loading = false;
    });
  };

  createNews = async (news: NewsDTO, toast: CreateToastFnReturn) => {
    this.loading = true;
    const pending = toast(CommonMessage.loadingMessage('Tạo mới tin tức'));

    const [err, res] = await catchErrorHandle(agent.NewsAgent.create(news));
    runInAction(() => {
      toast.close(pending);
      if (res) {
        this.setNews(res);
        toast(NewsMessage.createSuccess());
      }
      if (err) {
        toast(NewsMessage.createFailure());
      }
      this.loading = false;
    });
  };

  detailNews = async (newsId: number, toast: CreateToastFnReturn) => {
    this.isLoadingEdit = true;
    const [err, res] = await catchErrorHandle(agent.NewsAgent.details(newsId));
    runInAction(() => {
      if (res) {
        this.selectedNews = res;
      }
      if (err) {
        toast(NewsMessage.detailFailure());
      }
      this.isLoadingEdit = false;
    });
  };

  updateNews = async (news: NewsDTO, toast: CreateToastFnReturn) => {
    this.loading = true;
    const pending = toast(CommonMessage.loadingMessage('Chỉnh sửa tin tức'));
    const [err, res] = await catchErrorHandle(agent.NewsAgent.update(news));
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(NewsMessage.updateFailure());
      }
      if (res) {
        toast(NewsMessage.updateSuccess());
        this.setNews(res);
      }
      this.loading = false;
    });
  };

  deleteNews = async (id: number, toast: CreateToastFnReturn) => {
    this.loading = true;
    const pending = toast(CommonMessage.loadingMessage('Xóa tin tức'));
    const [err, res] = await catchErrorHandle(agent.NewsAgent.delete(id));
    runInAction(() => {
      toast.close(pending);
      if (res) {
        toast(NewsMessage.deleteSuccess());
        this.newsRegistry.delete(id);
      }
      if (err) {
        toast(NewsMessage.deleteFailure());
      }
      this.loading = false;
    });
  };

  changeStatus = async (newsId: number, status: number, toast: CreateToastFnReturn) => {
    this.setLoadingStatus(newsId, true);
    const [err, res] = await catchErrorHandle(agent.NewsAgent.changestatus(newsId, status));
    runInAction(() => {
      if (err) {
        toast(NewsMessage.updateFailure());
      }
      if (res) {
        toast(NewsMessage.updateSuccess());
        this.setNews(res);
      }
      this.setLoadingStatus(newsId, false);
    });
  };
  //#endregion

  //#region mockup
  loadMockNews = async () => {
    this.loading = true;
    await sleep(1000);
    try {
      sampleNewsData.forEach(this.setNews);
      runInAction(() => {
        this.newsPageParams.totalPages = Math.ceil(
          this.newsRegistry.size / this.newsPageParams.pageSize,
        );
        this.newsPageParams.totalElement = this.newsRegistry.size;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading banners:', error);
      });
    } finally {
      this.loading = false;
    }
  };

  //#endregion

  //#region common function

  setLoadingInitial = (isLoad: boolean) => {
    this.loadingInitial = isLoad;
  };

  setSearchTerm = async (term: string, toast:CreateToastFnReturn) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.newsRegistry.clear();
      this.newsPageParams.clearLazyPage();
      this.newsPageParams.searchTerm = term;
      await this.loadNews(toast);
      this.loadingInitial = false;
    });
    console.groupEnd();
  };

  setFilterTerm = async (term: string, toast:CreateToastFnReturn) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.newsRegistry.clear();
      this.newsPageParams.clearLazyPage();
      this.newsPageParams.filter = term;
      await this.loadNews(toast);
      this.loadingInitial = false;
    });
    console.groupEnd();
  };

  setLoadingStatus(id: number, isLoading: boolean) {
    this.loadingStatusMap.set(id, isLoading);
  }

  isLoading(id: number) {
    return this.loadingStatusMap.get(id);
  }

  get newsArray() {
    return _.orderBy(Array.from(this.newsRegistry.values()), ['id'], ['desc']);
  }

  //#region private function
  private setNews = (news: News) => {
    this.newsRegistry.set(news.id, news);
  };
  //#endregion

  //#endregion
}
