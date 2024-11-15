import { PaginationModel } from './../models/pagination.model';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { toast } from 'react-toastify';
import { User, UserFormValues, UserManager } from '../models/user.model';
import { News, NewsDTO } from '../models/news.models';
import { Banner, BannerDTO } from '../models/banner.model';
import {
  Court,
  CourtCluster,
  CourtClusterDetailsCreate,
  CourtClusterListAll,
} from '../models/court.model';
import { sleep } from '../helper/utils';
import { Service, ServiceDTO, ServiceEditDTO } from '../models/service.model';
import { Product, ProductInput } from '../models/product.model';
import { StaffPosition } from '../models/role.model';
import { ImageUpload } from '../models/upload.model';
import { ICategory } from '../models/category.model';
import { Staff } from '../models/staff.model';
import {
  DataExpend,
  DataTop,
  DataTotal,
  FilterData,
  FilterDataDTO,
} from '../models/statistic.model';
import {
  CourtClusterStatisticDetails,
  ExpenseDetailsDTO,
  ExpenseDto,
  FilterCourtClusterStatisticDetailsDTO,
} from '../models/revenue.models';
import {
  BookingCreate,
  BookingDetails,
  BookingForList,
  BookingModel,
  BookingRecent,
} from '../models/booking.model';
import { PaymentType } from '../models/payment.model';
import { OrderModel, OrderOfBooking } from '../models/order.model';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep(500);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    console.group('check axios');

    switch (status) {
      case 400:
        if (config.method === 'get' && data.errors.hasOwnProperty.call(data.errors, 'id')) {
          router.navigate('/not-found');
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          console.log(modalStateErrors);
          throw modalStateErrors.flat();
        } else {
          toast.error(data);
        }
        break;
      case 401:
        toast.error('unauthorized');
        break;
      case 403:
        toast.error('forbidden');
        break;
      case 404:
        console.log('error 404');
        router.navigate('/not-found');
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate('/server-error');
        break;
    }
    console.groupEnd();
    return Promise.reject(error);
  },
);
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const NewsAgent = {
  list: (queryParams: string = ''): Promise<PaginationModel<News>> =>
    requests.get(`/news${queryParams}`),
  details: (id: number): Promise<News> => requests.get(`/news/${id}`),
  create: (news: NewsDTO): Promise<News> => requests.post(`/news`, news),
  update: (news: NewsDTO): Promise<News> => requests.put(`/news/${news.id}`, news),
  delete: (id: number): Promise<void> => requests.del(`/news/${id}`),
  changestatus: (newsId: number, status: number): Promise<News> =>
    requests.put(`/news/changestatus/${newsId}/${status}`, {}),
};
const Banners = {
  list: (queryParams: string = ''): Promise<PaginationModel<Banner>> =>
    requests.get(`/banner${queryParams}`),
  details: (id: number): Promise<Banner> => requests.get(`/banner/${id}`),
  create: (banner: BannerDTO): Promise<Banner> => requests.post(`/banner`, banner),
  update: (banner: BannerDTO): Promise<void> => requests.put(`/banner/${banner.id}`, banner),
  delete: (id: number): Promise<void> => requests.del(`/banner/${id}`),
  changestatus: (bannerId: number, status: number): Promise<Banner> =>
    requests.put(`/Banner?id=${bannerId}&status=${status}`, {}),
};
const Services = {
  list: (queryParams: string = ''): Promise<PaginationModel<Service>> =>
    requests.get(`/service${queryParams}`),
  details: (id: number): Promise<Service> => requests.get(`/service/${id}`),
  create: (service: ServiceDTO): Promise<Service> => requests.post(`/service`, service),
  update: (service: ServiceEditDTO): Promise<Service> =>
    requests.put(`/service/${service.id}`, service),
  delete: (id: number): Promise<void> => requests.del(`/service/${id}`),
};

const Statistic = {
  getincome: (filterData: FilterDataDTO): Promise<FilterData[]> =>
    requests.get(
      `/statistic/?Year=${filterData.year}&Month=${filterData.month}&CourtClusterId=${filterData.courtClusterId}`,
    ),
  years: (): Promise<number[]> => requests.get(`/statistic/years`),
  count: (): Promise<DataTotal> => requests.get(`/statistic/count`),
  expense: (filterData: FilterDataDTO): Promise<DataExpend> =>
    requests.get(`/statistic/ExpendStatistics?month=${filterData.month}&year=${filterData.year}`),
  top: (filterData: FilterDataDTO): Promise<DataTop> =>
    requests.get(`/statistic/TopStatistics?month=${filterData.month}&year=${filterData.year}`),
  bookingRecent: (): Promise<BookingRecent[]> => requests.get(`/statistic/BookingRecently`),
};

const Revenue = {
  getrevenue: (
    filterData: FilterCourtClusterStatisticDetailsDTO,
  ): Promise<CourtClusterStatisticDetails> =>
    requests.get(
      `/statistic/ClusterStatistics?date=${filterData.date}&clusterId=${filterData.courtClusterId}`,
    ),
  years: (): Promise<number[]> => requests.get(`/statistic/years`),
  count: (): Promise<DataTotal> => requests.get(`/statistic/count`),
  saveExpense: (data: ExpenseDetailsDTO): Promise<ExpenseDto> => requests.post(`/statistic`, data),
  exportExcel: (filterData: FilterCourtClusterStatisticDetailsDTO): Promise<any> =>
    requests.get(
      `/statistic/ExportExcel?date=${filterData.date}&clusterId=${filterData.courtClusterId}`,
    ),
};

const StaffPositions = {
  list: (): Promise<StaffPosition[]> => requests.get(`/staffPosition`),
};

const Roles = {
  list: (): Promise<string[]> => requests.get(`/role`),
};

const Categories = {
  list: (): Promise<ICategory[]> => requests.get(`/category`),
  create: (category: { categoryName: string }): Promise<ICategory> => requests.post(`/category`, category),
  update: (category: ICategory): Promise<ICategory> => requests.put(`/category/${category.id}`, category),
  delete: (id: number): Promise<void> => requests.del(`/category/${id}`),
};

const Products = {
  list: (queryParams: string = ''): Promise<PaginationModel<Product>> =>
    requests.get(`/product${queryParams}`),
  details: (id: number): Promise<ProductInput> => requests.get(`/product/${id}`),
  create: (product: ProductInput): Promise<Product> => requests.post(`/product`, product),
  delete: (id: number): Promise<void> => requests.del(`/product/${id}`),
  update: (product: ProductInput, productId: number): Promise<Product> =>
    requests.put(`/product/${productId}`, product),
};

const CourtClusterAgent = {
  listAll: (): Promise<CourtClusterListAll[]> => requests.get(`/courtCluster/list-all`),
  details: (id: string): Promise<CourtCluster> => requests.get(`/courtCluster/${id}`),
  create: (court: CourtClusterDetailsCreate): Promise<void> =>
    requests.post(`/courtCluster`, court),
  update: (court: CourtCluster): Promise<void> => requests.put(`/courtCluster/${court.id}`, court),
  delete: (id: number): Promise<void> => requests.del(`/courtCluster/${id}`),
  list: (): Promise<PaginationModel<CourtCluster>> => requests.get(`/courtCluster`),
};
const CourtAgent = {
  list: (id: number): Promise<Court[]> => requests.get(`/court/list?filter=${id}`),
};
const UploadAgent = {
  post: (file: FormData): Promise<ImageUpload> => requests.post(`/upload`, file),
};
const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};

const Users = {
  list: (queryParams: string = ''): Promise<PaginationModel<UserManager>> =>
    requests.get(`/user${queryParams}`),
  details: (userId: string): Promise<UserManager> => requests.get(`/user/details/${userId}`), 
};
const Staffs = {
  list: (): Promise<PaginationModel<Staff>> => requests.get('/staff'),
};

const BookingAgent = {
  create: (booking: BookingCreate) => requests.post<BookingModel>('/booking/v2', booking),
  getListForSchedule: (courtClusterId: number): Promise<BookingModel[]> =>
    requests.get('/booking/v1?courtClusterId=' + courtClusterId),
  getListV2: (queryParam: string = ''): Promise<PaginationModel<BookingForList>> =>
    requests.get(`/booking/v2${queryParam}`),
  getDetailsV1: (id: number): Promise<BookingDetails> => requests.get(`/booking/v1/${id}`),
  acceptedBooking: (id: number): Promise<BookingForList> =>
    requests.put(`/booking/accepted/${id}`, {}),
  completeBooking: (id: number): Promise<BookingForList> =>
    requests.put(`/booking/completed/${id}`, {}),
  cancelBooking: (id: number): Promise<BookingForList> => requests.put(`/booking/cancel/${id}`, {}),
  denyBooking: (id: number): Promise<BookingForList> => requests.put(`/booking/deny/${id}`, {}),

  // getCourtPrices: (id:courtClusterId): 
};

const PaymentAgent = {
  create: (type: PaymentType, id: number) =>
    requests.post<string>(`/payment/${type}/${id}/process-payment`, {}),
};

const OrderAgent = {
  create: (model: OrderModel) => requests.post<OrderOfBooking>(`/order/v1`, model),
  details: (id: number) => requests.get<OrderModel>(`/order/v1/${id}`),
  update: (model: OrderModel): Promise<OrderOfBooking> => requests.put(`/order/v1/edit`, model),
};
const agent = {
  requests,
  Account,
  NewsAgent,
  Banners,
  CourtClusterAgent,
  Services,
  Products,
  StaffPositions,
  Roles,
  Staffs,
  Users,
  UploadAgent,
  Categories,
  Statistic,
  Revenue,
  CourtAgent,
  BookingAgent,
  PaymentAgent,
  OrderAgent,
};

export default agent;
