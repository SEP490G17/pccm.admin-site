import { makeAutoObservable, runInAction } from 'mobx';
import _ from 'lodash';
import { StaffInputDTO, StaffPosition } from '../models/role.model';
import agent from '../api/agent';
export default class StaffPositionStore {
  staffPositionRegistry = new Map<string, StaffPosition>();
  staffRoles: string[] = [];
  loading: boolean = false;

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

  applyAll = async () => {
    this.loading = true;
    await runInAction(async () => {
      await agent.StaffPositions.applyAll().then((positions) =>
        positions.forEach(this.setStaffPosition),
      );
      this.loading = false;
    });
  };

  updateRoles = async (data: StaffInputDTO[]) => {
    this.loading = true;
    await runInAction(async () => {
      await agent.StaffPositions.update(data).then((roles) => (this.staffRoles = roles));
      this.loading = false;
    });
  };

  get StaffPositionArray() {
    return Array.from(this.staffPositionRegistry.values());
  }

  private setStaffPosition = (staffPosition: StaffPosition) => {
    this.staffPositionRegistry.set(staffPosition.name, staffPosition);
  };
}
