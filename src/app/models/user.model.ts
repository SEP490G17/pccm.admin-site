export interface User {
  username: string;
  displayName: string;
  token: string;
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
  lockoutEnable: boolean;
  lockoutEnd: boolean;
  isDisabled: boolean;
}

