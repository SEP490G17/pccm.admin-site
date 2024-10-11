<<<<<<< HEAD
import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { User, UserFormValues } from "../models/user.model";
import { News } from "../models/news.models";
import { Banner} from "../models/banner.model";
import { Court } from "../models/court.model";
=======
import axios, { AxiosError, AxiosResponse } from 'axios';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { toast } from 'react-toastify';
import { User, UserFormValues } from '../models/user.model';
>>>>>>> 7a5b9f83a237d285e0ab4bd19772ebd551bd72e5

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

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
 list: (): Promise<News[]> => requests.get(`/news`),
  create: (news: News): Promise<void> => requests.post(`/news`, news),
  update: (news: News): Promise<void> => requests.put(`/news/${news.id}`, news),
  delete: (id: number): Promise<void> => requests.del(`/news/${id}`),
};
const BannerAgent = {
  list: (): Promise<Banner[]> => requests.get(`/banner`),
  create: (banner: Banner): Promise<void> => requests.post(`/banner`, banner),
  update: (banner: Banner): Promise<void> => requests.put(`/banner/${banner.id}`, banner),
  delete: (id: number): Promise<void> => requests.del(`/banner/${id}`),
};
const CourtAgent = {
  list: (): Promise<Court[]> => requests.get(`/courts`),
  details: (id: number): Promise<Court> => requests.get(`/courts/${id}`),
  create: (court: Court): Promise<void> => requests.post(`/courts`, court),
  update: (court: Court): Promise<void> => requests.put(`/courts/${court.id}`, court),
  delete: (id: number): Promise<void> => requests.del(`/courts/${id}`),
};

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};
const agent = { requests, Account, News: NewsAgent , Banner : BannerAgent, Court : CourtAgent};

export default agent;
