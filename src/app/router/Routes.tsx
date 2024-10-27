import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import TestErrors from '@/features/errors/TestError';
import NotFound from '@/features/errors/NotFound';
import ServerError from '@/features/errors/ServerError';
import MainLayout from '@/app/layout/MainLayout';
import LoginPage from '@/features/login/LoginPage';
import CreateCourtPage from '@/features/court/CreateCourtPage';
import CourtsPage from '@/features/court/CourtsPage';
import BannerPage from '@/features/banner/BannerPage';
import NewsPage from '@/features/news/NewsPage';
import ProductPage from '@/features/product/ProductPage';
import ServicePage from '@/features/service/ServicePage';
import StaffPage from '@/features/staff/StaffPage';
import UserManagerPage from '@/features/user/UserManagerPage';
import StaffPositionPage from '@/features/staff/StaffPositionPage';
import StatisticPage from '@/features/statistic/StatisticPage';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage key="login" />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'cum-san',
        element: <CourtsPage />,
      },
      {
        path: 'cum-san/tao',
        element: <CreateCourtPage />,
      },
      {
        path: 'tin-tuc',
        element: <NewsPage />,
      },
      {
        path: 'errors',
        element: <TestErrors key="errors" />,
      },

      {
        path: 'banner',
        element: <BannerPage />,
      },
      {
        path: 'hang-hoa',
        element: <ProductPage />,
      },
      {
        path: 'dich-vu',
        element: <ServicePage />,
      },
      {
        path: 'nhan-vien',
        element: <StaffPage />,
      },
      {
        path: 'users',
        element: <UserManagerPage />,
      },
      {
        path: 'thong-ke',
        element: <StatisticPage />,
      },
    ],
  },
  {
    path: 'not-found',
    element: <NotFound key="not-found" />,
  },
  {
    path: 'server-error',
    element: <ServerError key="not-found" />,
  },
  {
    path: '*',
    element: <Navigate replace to="/not-found" />,
  },
];

export const router = createBrowserRouter(routes);
