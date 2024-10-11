import { makeAutoObservable, runInAction } from 'mobx';
import { Court } from '../models/court.model';
import agent from '../api/agent';

export default class CourtStore {
  courts: Court[] = [];
  selectedCourt: Court | undefined = undefined;
  loading = false;
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  pageSize = 3;

  constructor() {
    makeAutoObservable(this);
  }

  loadCourts = async () => {
    this.loading = true;
    try {
      const courts = await agent.Court.list();
      runInAction(() => {
        this.courts = courts;
        this.totalPages = Math.ceil(courts.length / this.pageSize);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Failed to load courts', error);
      });
    }
  };

  createCourt = async (court: Court) => {
    this.loading = true;
    try {
      await agent.Court.create(court);
      runInAction(() => {
        this.courts.push(court);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Failed to create court', error);
      });
    }
  };

  updateCourt = async (court: Court) => {
    this.loading = true;
    try {
      await agent.Court.update(court);
      runInAction(() => {
        this.courts = this.courts.map(c => (c.id === court.id ? court : c));
        this.selectedCourt = court;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Failed to update court', error);
      });
    }
  };

  deleteCourt = async (id: number) => {
    this.loading = true;
    try {
      await agent.Court.delete(id);
      runInAction(() => {
        this.courts = this.courts.filter(c => c.id !== id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Failed to delete court', error);
      });
    }
  };

  setSearchTerm = (term: string) => {
    this.searchTerm = term;
  };

  get filteredCourts() {
    return this.courts.filter(court =>
      court.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      court.address.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Pagination logic
  get paginatedCourts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredCourts.slice(startIndex, endIndex);
  }

  setPage = (page: number) => {
    this.currentPage = page;
  };
}
