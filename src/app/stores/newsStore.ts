import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { News } from "../models/news.models";

export default class NewsStore {
  news: News[] = [];
  selectedNews: News | undefined = undefined;
  searchTerm: string = "";
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  loadNews = async () => {
    this.loading = true;
    try {
      const news = await agent.News.list();
      runInAction(() => {
        this.news = news;
        this.totalPages = Math.ceil(news.length / this.pageSize);
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
        this.news.push(news);
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
        this.news = this.news.map(n => (n.id === news.id ? news : n));
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
        this.news = this.news.filter(n => n.id !== id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Error deleting news:', error);
      });
    }
  };

  get filteredNews() {
    return this.news.filter(news =>
      news.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedNews() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredNews.slice(startIndex, endIndex);
  }

  setPage = (page: number) => {
    this.currentPage = page;
  };
}
