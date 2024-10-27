export interface CourtCluster {
  id: number;
  title: string;
  image: string[];
  address: string;
  openTime: string;
  closeTime: string;
  numbOfCourts: number;
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

export interface CourtClusterListAll{
  id: number;
  courtClusterName: string;
}
