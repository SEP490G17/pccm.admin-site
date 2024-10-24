export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  linkUrl: string;
  bannerType: BannerType;
  bannerInPage: BannerInPage;
}

export enum BannerStatus {
  Hidden,
  Display,
}

export function getBannerStatus(status: BannerStatus): boolean {
  return status === BannerStatus.Hidden;
}

export enum BannerType {
  Banner,
  Event,
}

export function getBannerType(type: BannerType): boolean {
  return type === BannerType.Banner;
}

export enum BannerInPage {
  HomePage,
  ProductPage,
}

export function getBannerInPage(InPage: BannerInPage): boolean {
  return InPage === BannerInPage.HomePage;
}

export class BannerDTO {
  id: number = 0;
  imageUrl: string = '';
  title: string = '';
  description: string = '';
  startDate: string = '';
  endDate: string = '';
  status: number = 0;
  linkUrl: string = '';
  bannerType: number = 0;
  bannerInPage: number = 0;

  constructor(data?: Partial<BannerDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
