export interface Court {
  id: number;
  name: string;
  image: string;
  address: string;
  openHours: string;
  courts: number;
  services: string[];
}

export interface ICourt {
  id: number;
  name: string;
  image: string;
  manager: string;
  location: string;
  status: string;
  createdAt: string;
}
