import { Court } from './../models/court.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleCourtData } from '../mock/court.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';

export default class CourtStore {
  courtRegistry = new Map<number, Court>();
  courtArray: Court[] = [];
  selectedCourt: Court | undefined = undefined;
  loading: boolean = false;
  courtPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;

  constructor() {
    console.log('court store initialized');
    this.courtPageParams.pageIndex =1;

    makeAutoObservable(this);
  }

  mockLoadCourts = async () => {
    this.loading = true;
    try {
      sampleCourtData.forEach(this.setCourt);
      await sleep(1000);
      runInAction(() => {
        this.courtPageParams.totalPages = Math.ceil(
          this.courtRegistry.size / this.courtPageParams.pageSize,
        );
        this.courtPageParams.totalElement = this.courtRegistry.size;
        this.loadCourtArray();
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error loading courts:', error);
      });
    } finally {
      this.loading = false;
    }
  };

  setSearchTerm = (term: string) => {
    runInAction(() => {
      console.log('begin court store');
      this.courtPageParams.searchTerm = term;
      this.cleanCourtCache();
      this.loadCourtArray();
      console.log('term:', term);
    });
  };

  setCurrentPage = (pageIndex: number) => {
    runInAction(() => {
      this.courtPageParams.pageIndex = pageIndex;
      this.loadCourtArray();
    });
  };

  setPageSize = (size: number) => {
    runInAction(() => {
      this.courtPageParams.pageSize = size;
      this.courtPageParams.pageIndex = 1;
      this.loadCourtArray();
    });
  };

  loadCourtArray = async () => {
    const { pageSize, pageIndex, totalElement } = this.courtPageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (
      pageSize * pageIndex > this.courtRegistry.size &&
      this.courtRegistry.size < totalElement!
    ) {
      await this.mockLoadCourts();
    }
    this.courtArray = Array.from(this.courtRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

  private setCourt = (court: Court) => {
    this.courtRegistry.set(court.id, court);
  };

  private cleanCourtCache = () => {
    runInAction(() => {
      console.log('cleanCourtCache');
      this.courtRegistry.clear();
    });
  };

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
