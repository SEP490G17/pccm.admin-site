export interface CourtCluster {
  id: number;
  title: string;
  images: string[];
  address: string;
  openTime: string;
  closeTime: string;
  numbOfCourts: number;
  description: string;
  location?: string;
}

export interface ICourtCluster {
  id: number;
  name: string;
  image: string;
  manager: string;
  location: string;
  status: string;
  createdAt: string;
}

export interface CourtClusterListAll {
  id: number;
  courtClusterName: string;
}

export interface CourtPrice {
  price: number;
  fromTime: string;
  toTime: string;
}

export interface CourtDetails {
  id: number;
  courtName: string;
  courtPrice: CourtPrice[];
  status: number;
  actions: CourtAction;
}

export interface CourtClusterDetails {
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  courtDetails: CourtDetails[];
}

export enum CourtAction {
  NONE = 'NONE',
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}



export interface CourtClusterDetailsCreate{
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  courtDetails: CourtDetailsCreate[];
}


export interface CourtDetailsCreate {
  id: number;
  courtName: string;
  courtPrice: CourtPrice[];
  status: number;
}