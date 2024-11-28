export interface Staff {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  roles: string[];
  courtCluster: string[];
}

export interface StaffEdit {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  position: string;
  courtCluster: number[];
}
