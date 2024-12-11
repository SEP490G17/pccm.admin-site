import { makeAutoObservable, runInAction } from 'mobx';
import _ from 'lodash';
import { StaffInputDTO, StaffPosition } from '../models/role.model';
import agent from '../api/agent';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { catchErrorHandle } from '../helper/utils';
import { StaffMessage } from '../common/toastMessage/staffMessage';
export default class StaffPositionStore {
  staffPositionRegistry = new Map<string, StaffPosition>();
  staffRoles: string[] = [];
  loading: boolean = false;
  loadingUpdate: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadStaffPosition = async () => {
    this.loading = true;
    await runInAction(async () => {
      await agent.StaffPositions.list().then((positions) =>
        positions.forEach(this.setStaffPosition),
      );
      this.loading = false;
    });
  };

  loadRoles = async () => {
    this.loading = true;
    await runInAction(async () => {
      await agent.Roles.list().then((roles) => (this.staffRoles = roles));
      this.loading = false;
    });
  };

  applyAll = async (data: StaffInputDTO[], toast: CreateToastFnReturn) => {
    this.loading = true;
    const [err, res] = await catchErrorHandle(agent.StaffPositions.applyAll(data));
    runInAction(() => {
      if (err) {
        toast(StaffMessage.updateRoleFailure(undefined, err));
      }
      if (res) {
        toast(StaffMessage.updateRoleSuccess());
      }
      this.loading = false;
    });
    return { err, res };
  };

  updateRole = async (data: StaffInputDTO[], toast: CreateToastFnReturn) => {
    this.loadingUpdate = true;
    const [err, res] = await catchErrorHandle(agent.StaffPositions.update(data));
    runInAction(() => {
      if (err) {
        toast(StaffMessage.updateRoleFailure(undefined, err));
      }
      if (res) {
        toast(StaffMessage.updateRoleSuccess());
      }
      this.loadingUpdate = false;
    });
    return { err, res };
  };

  get StaffPositionArray() {
    return Array.from(this.staffPositionRegistry.values());
  }

  private setStaffPosition = (staffPosition: StaffPosition) => {
    this.staffPositionRegistry.set(staffPosition.name, staffPosition);
  };
}
