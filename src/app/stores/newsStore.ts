import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { News } from '../models/news.models';
import { sampleNewsData } from '../mock/news.mock';
import { PageParams } from '../models/pageParams.model';
import _ from 'lodash';
import { sleep } from '../helper/utils';

export default class NewsStore {
  newsRegistry = new Map<number, News>();
  newsArray: News[] = [];
  selectedNews: News | undefined = undefined;
  loading: boolean = false;
  newsPageParams = new PageParams();

  constructor() {
    this.newsPageParams.pageSize = 5;
    makeAutoObservable(this);
  }
  //#region CRUD

  loadNews = async () => {
    this.loading = true;
    try {
      const news = await agent.News.list();
      runInAction(() => {
        news.forEach(this.setNews);
        this.newsPageParams.totalPages = Math.ceil(news.length / this.newsPageParams.pageSize);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error loading news:', error);
      });
    }
  };

  createNews = async (news: News) => {
    this.loading = true;
    try {
      await agent.News.create(news);
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

  updateNews = async (news: News) => {
    this.loading = true;
    try {
      await agent.News.update(news);
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
      await agent.News.delete(id);
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
        this.newsPageParams.totalPages = Math.ceil(this.newsRegistry.size / this.newsPageParams.pageSize);
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

  setSearchTerm(term: string) {
    runInAction(() => {
      console.log('check term:',term);
      this.newsPageParams.searchTerm = term;
      this.loadNewsArray();
    });
  }

  setCurrentPage = (page: number) => {
    runInAction(() => {
      this.newsPageParams.pageIndex = page;
      this.loadNewsArray();
    });
  };

  setPageSize = (size: number) => {
    runInAction(() => {
      this.newsPageParams.pageSize = size;
      this.newsPageParams.pageIndex = 1; 
      this.loadNewsArray();
    });
  };  

  loadNewsArray = async () => {
    const { pageSize, pageIndex, searchTerm, totalElement } = this.newsPageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (pageSize * pageIndex > this.newsRegistry.size && this.newsRegistry.size < totalElement!) {
      await this.loadNews();
    }
    this.newsArray = Array.from(this.newsRegistry.values())
      .filter((news) => _.includes(news.title.toLocaleLowerCase(), searchTerm?.toLocaleLowerCase() ?? ''))
      .slice(startIndex, endIndex);
  };

  //#region private function
  private setNews = (news: News) => {
    this.newsRegistry.set(news.id, news);
  };
  //#endregion

  //#endregion
}
