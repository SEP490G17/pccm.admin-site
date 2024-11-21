import agent from '@/app/api/agent';
import { CommonMessage } from '@/app/common/toastMessage/commonMessage';
import { CourtMessage, DefaultCourtText } from '@/app/common/toastMessage/courtMessage';
import { catchErrorHandle, sleep } from '@/app/helper/utils';
import {
  CourtCombo,
  CourtForTable,
  CourtPriceResponse,
  CourtStatus,
} from '@/app/models/court.model';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { makeAutoObservable, runInAction } from 'mobx';

export default class CourtManagerStore {
  loadingInitial: boolean = false;
  loadingUpdateCourtPrice: boolean = false;
  courtRegistry = new Map<number, CourtForTable>();
  courtClusterName = '';
  constructor() {
    makeAutoObservable(this);
  }

  setLoadingInitial = (value: boolean) => (this.loadingInitial = value);

  loadCourts = async (courtClusterId: number, toast: CreateToastFnReturn) => {
    this.loadingInitial = true;
    const [err, res] = await catchErrorHandle(agent.CourtAgent.listByCluster(courtClusterId));

    runInAction(() => {
      if (err) {
        toast(CourtMessage.loadCourtClusterFailure());
      }
      if (res) {
        res.courtForTable.forEach(this.setCourt);
        this.courtClusterName = res.courtClusterName;
      }
      this.setLoadingInitial(false);
    });

    return { res, err };
  };

  updateCourtPrices = async (
    courtId: number,
    courtPrices: CourtPriceResponse[],
    toast: CreateToastFnReturn,
  ) => {
    const [err, res] = await catchErrorHandle(
      agent.CourtAgent.updateCourtPrice(courtId, courtPrices),
    );
    const pending = toast(CommonMessage.loadingMessage(DefaultCourtText.updateCourtPrice.title));

    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(CourtMessage.updateCourtPricesFailure());
      }
      if (res) {
        toast(CourtMessage.updateCourtPricesSuccess());

        const courts = this.courtRegistry.get(courtId);

        if (courts) {
          courts.courtPrices = [];
          courts.courtPrices = courtPrices;
          const minPrice = Math.min(...courtPrices.map((item) => item.price));
          const maxPrice = Math.max(...courtPrices.map((item) => item.price));
          courts.minPrice = minPrice;
          courts.maxPrice = maxPrice;
          this.courtRegistry.set(courtId, courts);
        }
      }
    });

    return { res, err };
  };

  updateCourtCombos = async (
    courtId: number,
    courtCombos: CourtCombo[],
    toast: CreateToastFnReturn,
  ) => {
    const pending = toast(CommonMessage.loadingMessage(DefaultCourtText.updateCourtPrice.title));
    const [err, res] = await catchErrorHandle(
      agent.CourtAgent.updateCourtCombo(courtId, courtCombos),
    );
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(CourtMessage.updateCourtCombosFailure());
      }
      if (res) {
        toast(CourtMessage.updateCourtCombosSuccess());
        const courts = this.courtRegistry.get(courtId);
        if (courts) {
          courts.courtCombos = [];
          courts.courtCombos = courtCombos;
        }
      }
    });
  };

  removeCourt = async (id: number, toast: CreateToastFnReturn) => {
    const pending = toast(CommonMessage.loadingMessage(DefaultCourtText.removeCourt.title));
    const [err, res] = await catchErrorHandle(agent.CourtAgent.removeCourt(id));
    runInAction(() => {
      toast.close(pending);
      if (err) {
        toast(CourtMessage.removeCourtFailure());
      }
      if (res) {
        toast(CourtMessage.removeCourtSuccess());
        this.courtRegistry.delete(id);
      }
    });

    return { res, err };
  };

  toggleCourtStatus = async (id: number, toast: CreateToastFnReturn) => {
    const court = this.courtRegistry.get(id);
    if (court) {
      const status = court.status;
      court.status = status === CourtStatus.Available ? CourtStatus.Closed : CourtStatus.Available;
      this.courtRegistry.set(id, court);
      await sleep(500);
      const [err] = await catchErrorHandle(
        agent.CourtAgent.toggle(
          id,
          status === CourtStatus.Available ? CourtStatus.Closed : CourtStatus.Available,
        ),
      );

      runInAction(() => {
        if (err) {
          toast(CourtMessage.toggleCourtFailure());
          const courtErr = { ...court, status };
          this.courtRegistry.set(id, courtErr);
        }
      });
    }
  };

  setCourt = (court: CourtForTable) => {
    this.courtRegistry.set(court.courtId, court);
  };

  get courtArray() {
    return Array.from(this.courtRegistry.values());
  }
}
