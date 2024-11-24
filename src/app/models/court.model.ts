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
  minPrice: number;
  maxPrice: number;
  province: string; //Tỉnh thành
  provinceName: string;
  district: string; // Thành phố, quận
  districtName: string;
  ward: string; // Phường
  wardName: string;
  isVisible: boolean;
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

export interface CourtPriceResponse {
  price: number;
  fromTime: string;
  toTime: string;
}
export interface CourtDetails {
  id: number;
  courtName: string;
  courtPrice: CourtPriceResponse[];
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

export interface CourtClusterDetailsCreate {
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  courtDetails: CourtDetailsCreate[];
  images: string[];
}

export interface CourtDetailsCreate {
  courtName: string;
  courtPrice: CourtPrice[];
  status: number;
}

export interface Court {
  courtId: number;
  courtName: string;
  courtPrices: CourtPriceResponse[];
  courtCombos: CourtCombo[];
}

export interface CourtForTable {
  courtId: number;
  courtName: string;
  minPrice: number;
  maxPrice: number;
  status: CourtStatus;
  courtPrices: CourtPriceResponse[];
  courtCombos: CourtCombo[];
}

export interface CourtManagerResponse {
  courtClusterName: string;
  courtForTable: CourtForTable[];
  openTime:string;
  closeTime:string;
}

export interface CourtCombo {
  id?:number;
  totalPrice: number;
  displayName: string;
  duration: number;
}

export enum CourtStatus {
  Available,
  Closed,
}

export enum CourtAction {
  NONE = 'NONE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface CourtClusterDetailsEdit {
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  images: string[];
}
