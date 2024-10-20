import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { News } from '../models/news.models';
import { sampleNewsData } from '../mock/news.mock';
import { PageParams } from '../models/pageParams.model';
import _ from 'lodash';
import { customFormatDate, sleep } from '../helper/utils';
import { toast } from 'react-toastify';

export default class NewsStore {
  newsRegistry = new Map<number, News>();
  newsArray: News[] = [];
  selectedNews: News | undefined = undefined;
  loading: boolean = false;
  loadingInitial: boolean = false;
  newsPageParams = new PageParams();
  isOrigin: boolean = true;

  constructor() {
    this.newsPageParams.pageSize = 5;
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
        this.isOrigin = false;
      } else {
        this.isOrigin = true;
      }
      const { count, data } = await agent.NewsAgent.list(`?${queryParams.toString()}`);
      runInAction(() => {
        data.forEach(this.setNews);

        this.newsPageParams.totalElement = count;
        this.loadNewsArray();
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

  createNews = async (news: News) => {
    this.loading = true;
    try {
      await agent.NewsAgent.create(news);
      runInAction(() => {
        this.setNews(news);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error creating news:', error);
      });
    }
  };

  detailNews = async (newsId: number) => {
    this.loading = true;
    try {
      const data = await agent.NewsAgent.details(newsId);
      runInAction(() => {
        this.selectedNews = data;
        this.loading = false;
      });
      return data;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error creating news:', error);
      });
    }
  };

  updateNews = async (news: News) => {
    this.loading = true;
    try {
      await agent.NewsAgent.update(news);
      runInAction(() => {
        this.setNews(news);
        this.selectedNews = news;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error updating news:', error);
      });
    }
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
        this.loadNewsArray();
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
      if (this.newsPageParams.totalElement === this.newsRegistry.size && this.isOrigin) {
        console.log('checking');
        this.newsPageParams.searchTerm = term;
        this.loadNewsArray();
        return;
      }
      this.newsRegistry.clear();
      this.newsPageParams.clearLazyPage();
      this.newsPageParams.searchTerm = term;
      await this.loadNews();
      this.loadingInitial = false;
    });
    console.groupEnd();
  };

  loadNewsArray = async () => {
    runInAction(() => {
      const { searchTerm } = this.newsPageParams;
      if (this.newsRegistry.size === this.newsPageParams.totalElement && searchTerm) {
        this.newsArray = Array.from(this.newsRegistry.values()).filter(
          (b) => _.includes(b.title, searchTerm) || _.includes(b.tags, searchTerm),
        );
        return;
      }
      this.newsArray = Array.from(this.newsRegistry.values());
    });
  };

  //#region private function
  private setNews = (news: News) => {
    news.createdAt = customFormatDate(new Date(news.createdAt));
    this.newsRegistry.set(news.id, news);
  };
  //#endregion

  //#endregion
}
