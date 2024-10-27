import {CourtCluster as CourtCluster, CourtClusterListAll} from './../models/court.model';
import {makeAutoObservable, runInAction} from 'mobx';
import {sampleCourtData} from '../mock/court.mock';
import {PageParams} from '../models/pageParams.model';
import {catchErrorHandle, customFormatTime, sleep} from '../helper/utils';
import agent from '../api/agent';
import _ from 'lodash';
import {toast} from "react-toastify";
import {PaginationModel} from "@/app/models/pagination.model.ts";

export default class CourtClusterStore {
    courtRegistry = new Map<number, CourtCluster>();
    courtListAllRegistry = new Map<number, CourtClusterListAll>();
    selectedCourt: CourtCluster | undefined = undefined;
    loading: boolean = false;
    courtPageParams = new PageParams();
    cleanupInterval: number | undefined = undefined;
    loadingInitial: boolean = false;
    loadingInitialDetailsPage: boolean = false;

    constructor() {
        this.courtPageParams.pageIndex = 1;
        console.log('court-cluster store initialized');
        this.courtPageParams.pageIndex = 1;

        makeAutoObservable(this);
    }

    catchError<T>(promise: Promise<T>) {
        return promise
            .then(data => {
                return [undefined, data] as [undefined, T]
            })
            .catch(error => {
                return [error]
            });
    }

    //#region MainCRUD
    // 1. Load list court clusters for admin
    loadCourtsCluster = async () => {
        this.loadingInitial = true;
        const [error, response] = await catchErrorHandle<PaginationModel<CourtCluster>>(agent.CourtClusterAgent.list());

        runInAction(() => {
            if (error) {
                toast.error('Tải danh sách cụm sân thất bại'); // Cải thiện thông báo lỗi nếu cần
                console.log(error);
            } else {
                response.data.forEach(this.setCourt);
                this.courtPageParams.totalElement = response.count;
            }
            this.loadingInitial = false;
        })
    }
    // 2. Get Details court cluster for admin
    // getDetailsCourtCluster = async (id: number) => {
    //     this.loadingInitialDetailsPage = true;
    //     await runInAction(());
    // }
    //#endregion


    loadCourtClusterListAll = async () => {
        this.loading = true;
        await runInAction(async () => {
            try {
                await agent.CourtClusterAgent.listAll()
                    .then(this.setCourtClusterListAll);
            } finally {
                this.loading = false;
            }
        })
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
            console.log('term:', term);
        });
    };


    get courtArray() {
        return _.orderBy(Array.from(this.courtRegistry.values()), ['id'], 'desc');
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
        court.openTime = customFormatTime(court.openTime);
        court.closeTime = customFormatTime(court.closeTime);
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
