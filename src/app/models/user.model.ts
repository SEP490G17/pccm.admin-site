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
  id: number;
  username: string;
  email: string;
  role: string;
  createdDate: string;
  lastLoginDate: string;
  status: string;
  isActivated: boolean;
  actions?: string[];
}