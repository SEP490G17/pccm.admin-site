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
  