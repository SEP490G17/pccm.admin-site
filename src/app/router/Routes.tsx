import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import TestErrors from '@/features/errors/TestError';
import NotFound from '@/features/errors/NotFound';
import ServerError from '@/features/errors/ServerError';
import MainLayout from '@/app/layout/MainLayout';
import LoginPage from '@/features/auth/login/LoginPage';
import BannerPage from '@/features/banner/BannerPage';
import NewsPage from '@/features/news/NewsPage';
import ProductPage from '@/features/product/ProductPage';
import ServicePage from '@/features/service/ServicePage';
import StaffPage from '@/features/staff/StaffPage';
import UserManagerPage from '@/features/user/UserManagerPage';
import StatisticPage from '@/features/statistic/StatisticPage';
import RevenuePage from '@/features/revenue/RevenuePage';
import BookingsPage from '@/features/booking/BookingsPage';
import BookingDetailsPage from '@/features/booking/BookingDetailsPage';
import CourtClusterPage from '@/features/court-cluster/List/CourtsClusterPage';
import CourtClusterDetailsPage from '@/features/court-cluster/Details/CourtClusterDetailsPage';
import CourtsManagerPage from '@/features/court-cluster/CourtsManager/CourtManagerPage';
import { RoleBasedRedirect } from './HomeRouterConfigPage';
import CourtClusterEditPage from '@/features/court-cluster/UpdateInfomation/CourtClusterEditPage';
import CourtClusterCreatePage from '@/features/court-cluster/Create/CourtClusterCreatePage';
import ForbiddenPage from '@/features/errors/Forbidden';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'cum-san',
        element: <CourtClusterPage />,
      },
      {
        path: 'cum-san/:id/chi-tiet',
        element: <CourtClusterDetailsPage />,
      },
      {
        path: 'cum-san/:id/chinh-sua',
        element: <CourtClusterEditPage />,
      },
      {
        path: 'cum-san/tao',
        element: <CourtClusterCreatePage />,
      },
      {
        path: 'cum-san/:id/quan-ly-san',
        element: <CourtsManagerPage />,
      },
      {
        path: 'tin-tuc',
        element: <NewsPage />,
      },
      {
        path: 'booking',
        element: <BookingsPage />,
      },
      {
        path: 'booking/chi-tiet/:id',
        element: <BookingDetailsPage />,
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
      {
        path: 'doanh-thu',
        element: <RevenuePage />,
      },
      {
        path: '',
        element: <RoleBasedRedirect />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage key="login" />,
  },
  {
    path: 'not-found',
    element: <NotFound key="not-found" />,
  },

  {
    path: 'forbidden',
    element: <ForbiddenPage key="forbidden" />,
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
