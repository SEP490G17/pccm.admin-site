export interface User {
  username: string;
  displayName: string;
  token: string;
  phoneNumber: string;
  roles: string[];
  image: string;
}
export interface UserFormValues {
  username: string;
  password: string;
  displayName?: string;
}
export interface UserManager {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  lockoutEnabled: boolean;
  lockoutEnd: string;
  isDisabled: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  phoneNumber: string;
  birthDate: string;
  gender: boolean;
}

export class ResetPasswordDTO {
  email: string = '';

  constructor(data?: Partial<ResetPasswordDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class CreateUserDTO {
  userName: string = '';
  phoneNumber: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  rePassword: string = '';

  constructor(data?: Partial<CreateUserDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class CreateStaffDTO {
  userName: string = '';
  phoneNumber: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  positionId: number = 0;
  courtCluster: number[] = [];

  constructor(data?: Partial<CreateStaffDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class UpdateStaffDTO {
  staffDetailId: number = 0;
  userName: string = '';
  phoneNumber: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  positionId: number = 0;
  courtCluster: number[] = [];

  constructor(data?: Partial<UpdateStaffDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}