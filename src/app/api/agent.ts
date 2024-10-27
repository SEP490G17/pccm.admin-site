import { PaginationModel } from './../models/pagination.model';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { toast } from 'react-toastify';
import { User, UserFormValues, UserManager } from '../models/user.model';
import { News, NewsDTO } from '../models/news.models';
import { Banner, BannerDTO } from '../models/banner.model';
import { CourtCluster, CourtClusterListAll } from '../models/court.model';
import { sleep } from '../helper/utils';
import { Service, ServiceDTO } from '../models/service.model';
import { Product, ProductInput } from '../models/product.model';
import { StaffPosition } from '../models/role.model';
import { ImageUpload } from '../models/upload.model';
import { ICategory } from '../models/category.model';
import { Staff } from '../models/staff.model';

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
};
const Banners = {
  list: (queryParams: string = ''): Promise<PaginationModel<Banner>> =>
    requests.get(`/banner${queryParams}`),
  details: (id: number): Promise<Banner> => requests.get(`/banner/${id}`),
  create: (banner: BannerDTO): Promise<Banner> => requests.post(`/banner`, banner),
  update: (banner: BannerDTO): Promise<void> => requests.put(`/banner/${banner.id}`, banner),
  delete: (id: number): Promise<void> => requests.del(`/banner/${id}`),
};
const Services = {
  list: (queryParams: string = ''): Promise<PaginationModel<Service>> =>
    requests.get(`/service${queryParams}`),
  details: (id: number): Promise<Service> => requests.get(`/service/${id}`),
  create: (service: ServiceDTO): Promise<Service> => requests.post(`/service`, service),
  update: (service: Service): Promise<void> => requests.put(`/service/${service.id}`, service),
  delete: (id: number): Promise<void> => requests.del(`/service/${id}`),
};
const StaffPositions = {
  list: (): Promise<StaffPosition[]> => requests.get(`/staffPosition`),
};

const Roles = {
  list: (): Promise<string[]> => requests.get(`/role`),
};

const Categories = {
  list: (): Promise<ICategory[]> => requests.get(`/category`),
};

const Products = {
  list: (queryParams: string = ''): Promise<PaginationModel<Product>> =>
    requests.get(`/product${queryParams}`),
  details: (id:number):Promise<ProductInput> => requests.get(`/product/${id}`),
  create: (product: ProductInput): Promise<Product> =>
    requests.post(`/product`, product),
  delete: (id: number): Promise<void> => requests.del(`/product/${id}`),
  update: (product: ProductInput, productId: number): Promise<Product> => requests.put(`/product/${productId}`, product)
};

const CourtClusterAgent = {
  listAll: (): Promise<CourtClusterListAll[]> => requests.get(`/courtCluster/list-all`),
  details: (id: number): Promise<CourtCluster> => requests.get(`/courtCluster/${id}`),
  create: (court: CourtCluster): Promise<void> => requests.post(`/courtCluster`, court),
  update: (court: CourtCluster): Promise<void> => requests.put(`/courtCluster/${court.id}`, court),
  delete: (id: number): Promise<void> => requests.del(`/courtCluster/${id}`),
  list: (): Promise<PaginationModel<CourtCluster>> => requests.get(`/courtCluster`),
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
};
const Staffs = {
  list: (): Promise<PaginationModel<Staff>> => requests.get('/staff'),
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
};

export default agent;
