import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { News, NewsDTO } from '../models/news.models';
import { sampleNewsData } from '../mock/news.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import { toast } from 'react-toastify';
import _ from 'lodash';

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

  loadNews = async () => {
    this.loading = true;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', `${this.newsPageParams.skip ?? 0}`);
      queryParams.append('pageSize', `${this.newsPageParams.pageSize}`);
      if (this.newsPageParams.searchTerm) {
        queryParams.append('search', this.newsPageParams.searchTerm);
      }
      const { count, data } = await agent.NewsAgent.list(`?${queryParams.toString()}`);
      runInAction(() => {
        data.forEach(this.setNews);
        this.newsPageParams.totalElement = count;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.log(error);
        toast.error('Error loading news');
      });
    }
  };

  createNews = async (news: NewsDTO) => {
    this.loading = true;
    await runInAction(async () => {
      await agent.NewsAgent.create(news)
        .then((s) => {
          this.setNews(s);
          toast.success('Tạo tin tức thành công');
        })
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Tạo tin tức thất bại');
        })
        .finally(() => (this.loading = false));
    });
  };

  detailNews = async (newsId: number) => {
    this.isLoadingEdit = true;
    try {
      const data = await agent.NewsAgent.details(newsId);
      runInAction(() => {
        this.selectedNews = data;
        this.isLoadingEdit = false;
      });
      return data;
    } catch (error) {
      runInAction(() => {
        this.isLoadingEdit = false;
        console.error('Error creating news:', error);
      });
    }
  };

  updateNews = async (news: NewsDTO) => {
    this.loading = true;
    await runInAction(async () => {
      await agent.NewsAgent.update(news)
        .then((s) => {
          this.setNews(s);
          toast.success('Cập nhật tức thành công');
        })
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Cập nhật tin tức thất bại');
        })
        .finally(() => (this.loading = false));
    });
  };

  deleteNews = async (id: number) => {
    this.loading = true;
    try {
      await agent.NewsAgent.delete(id);
      runInAction(() => {
        this.newsRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error deleting news:', error);
      });
    }
  };

  changeStatus = async (newsId: number, status: number) => {
    this.setLoadingStatus(newsId, true);
    await runInAction(async () => {
      await agent.NewsAgent.changestatus(newsId, status)
        .then((s) => {
          this.setNews(s);
          toast.success('Cập nhật tin tức thành công');
        })
        .catch((error) => {
          console.error('Error creating product:', error);
          toast.error('Cập nhật tin tức thất bại');
        })
        .finally(() => this.setLoadingStatus(newsId, false));
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

  setSearchTerm = async (term: string) => {
    await runInAction(async () => {
      this.loadingInitial = true;
      this.newsRegistry.clear();
      this.newsPageParams.clearLazyPage();
      this.newsPageParams.searchTerm = term;
      await this.loadNews();
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
