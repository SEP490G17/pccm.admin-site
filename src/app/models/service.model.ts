export interface Service {
  id: number;
  courtClusterId: number;
  serviceName: string;
  description: string;
  price: number;
  courtClusterName: string;
}

export class ServiceDTO {
  id: number = 0;
  courtClusterId: number[] = [];
  serviceName: string = '';
  description: string = '';
  price: number = 0;
  courtClusterName: string = '';

  constructor(data?: Partial<ServiceDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ServiceEditDTO {
  id: number = 0;
  courtClusterId: number = 0;
  serviceName: string = '';
  description: string = '';
  price: number = 0;
  courtClusterName: string = '';

  constructor(data?: Partial<ServiceEditDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
