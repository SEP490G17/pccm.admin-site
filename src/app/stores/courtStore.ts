import { makeAutoObservable, runInAction } from 'mobx';
import { Court, ICourt } from '../models/court.model';
import agent from '../api/agent';
import { PageParams } from '../models/pageParams.model';
import { sampleCourtData } from '../mock/court.mock';
import _ from 'lodash';

export default class CourtStore {
  courtRegistry = new Map<number, ICourt>();
  courtArray: ICourt[] = [];
  selectedCourt: ICourt | undefined = undefined;
  loading = false;
  pageParams = new PageParams();

  constructor() {
    makeAutoObservable(this);
  }

  //#region CRUD

  loadCourts = async () => {
    this.loading = true;
    try {
      const courts = await agent.Court.list();
      runInAction(() => {
        courts.forEach(this.setCourt);
        this.pageParams.totalPages = Math.ceil(courts.length / this.pageParams.pageSize);
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
        // this.courtRegistry.set(court.id, );
      });
    } catch (error) {
      runInAction(() => {
        console.error('Failed to create court', error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateCourt = async (court: Court) => {
    this.loading = true;
    try {
      await agent.Court.update(court);
      runInAction(() => {
        // this.courtRegistry.set(court.id, );
      });
    } catch (error) {
      runInAction(() => {
        console.error('Failed to update court', error);
      });
    } finally {
      this.loading = false;
    }
  };

  deleteCourt = async (id: number) => {
    this.loading = true;
    try {
      await agent.Court.delete(id);
      runInAction(() => {
        this.courtRegistry.delete(id);
      });
    } catch (error) {
      runInAction(() => {
        console.error('Failed to delete court', error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  //#endregion

  //#region mock-up
  mockLoadCourts = () => {
    this.loading = true;
    console.log('mock-up');
    try {
      runInAction(() => {
        sampleCourtData.forEach(this.setCourt);
        this.pageParams.totalPages = Math.ceil(this.courtRegistry.size / this.pageParams.pageSize);
        this.loadCourtArray();
      });
    } catch (error) {
      runInAction(() => {
        console.error('Failed to load courts', error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  //#endregion

  //#region common functions

  loadCourtArray = async () => {
    const { pageSize, pageIndex, searchTerm, totalElement } = this.pageParams;
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    console.log('total element:', totalElement);
    if (pageSize * pageIndex > this.courtRegistry.size && this.courtRegistry.size < totalElement!) {
      await this.loadCourts();
    }
    this.courtArray = Array.from(this.courtRegistry.values())
      .filter((court) => _.includes(court.name, searchTerm ?? ''))
      .slice(startIndex, endIndex);
  };

  setSearchTerm = async (term: string) => {
    runInAction(() => {
      this.loading = true;
      this.pageParams.searchTerm = term;
      this.loadCourtArray();
      this.loading = false;
    });
  };

  setPageNumber = (page: number) => {
    runInAction(() => {
      this.loading = true;
      this.pageParams.pageIndex = page;
      this.loadCourtArray();
      this.loading = false;
    });
  };

  private setCourt = (court: ICourt) => {
    this.courtRegistry.set(court.id, court);
  };
  //#endregion
}
