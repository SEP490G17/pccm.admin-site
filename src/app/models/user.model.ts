export interface User {
  username: string;
  displayName: string;
  token: string;
  phoneNumber: string;
  roles: string[];
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
