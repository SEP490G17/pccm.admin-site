export interface CourtCluster {
  id: number;
  name: string;
  image: string;
  address: string;
  openHours: string;
  courts: number;
  services: string[];
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
