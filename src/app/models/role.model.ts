export interface StaffPosition {
  id: number;
  name: string;
  defaultRoles: string[];
}

export class StaffInputDTO {
  defaultRoles: string[] = [];
  name: string = '';

  constructor(data?: Partial<StaffInputDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
