export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  linkUrl: string;
}

export enum BannerStatus {
  Hidden,
  Display,
}

export function getBannerStatus(status: BannerStatus): boolean {
  return status === BannerStatus.Hidden;
}
