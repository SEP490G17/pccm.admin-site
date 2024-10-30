import { CourtCluster as CourtCluster, CourtClusterListAll } from './../models/court.model';
import { makeAutoObservable, runInAction } from 'mobx';
import { sampleCourtData } from '../mock/court.mock';
import { PageParams } from '../models/pageParams.model';
import { sleep } from '../helper/utils';
import agent from '../api/agent';

export default class CourtClusterStore {
  courtRegistry = new Map<number, CourtCluster>();
  courtListAllRegistry = new Map<number, CourtClusterListAll>();
  courtArray: CourtCluster[] = [];
  selectedCourt: CourtCluster | undefined = undefined;
  loading: boolean = false;
  courtPageParams = new PageParams();
  cleanupInterval: number | undefined = undefined;
  isOrigin: boolean = true;
  loadingInitial: boolean = false;

  constructor() {
    this.courtPageParams.pageIndex = 1;
    console.log('court-cluster store initialized');
    this.courtPageParams.pageIndex = 1;

    makeAutoObservable(this);
  }

  loadCourtClusterListAll = async () => {
    this.loadingInitial = true;
    await runInAction(async () => {
      try {
        await agent.CourtClusterAgent.listAll().then(this.setCourtClusterListAll);
      } finally {
        this.loadingInitial = false;
      }
    });
  };

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
      console.log('begin court-cluster store');
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
    if (pageSize * pageIndex > this.courtRegistry.size && this.courtRegistry.size < totalElement!) {
      await this.mockLoadCourts();
    }
    this.courtArray = Array.from(this.courtRegistry.values())
      .sort((a, b) => a.id - b.id)
      .slice(startIndex, endIndex);
  };

  get courtListAllArray() {
    return Array.from(this.courtListAllRegistry.values());
  }

  get courtListAllOptions() {
    return this.courtListAllArray.map((courtCluster) => ({
      value: courtCluster.id,
      label: courtCluster.courtClusterName,
    }));
  }

  private setCourt = (court: CourtCluster) => {
    this.courtRegistry.set(court.id, court);
  };

  private setCourtClusterListAll = (courtClusterListAll: CourtClusterListAll[]) => {
    courtClusterListAll.forEach((c) => {
      this.courtListAllRegistry.set(c.id, c);
    });
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
