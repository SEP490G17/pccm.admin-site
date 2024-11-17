import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import TestErrors from '@/features/errors/TestError';
import NotFound from '@/features/errors/NotFound';
import ServerError from '@/features/errors/ServerError';
import MainLayout from '@/app/layout/MainLayout';
import LoginPage from '@/features/auth/login/LoginPage';
import CourtsPage from '@/features/court-cluster/CourtsClusterPage.tsx';
import BannerPage from '@/features/banner/BannerPage';
import NewsPage from '@/features/news/NewsPage';
import ProductPage from '@/features/product/ProductPage';
import ServicePage from '@/features/service/ServicePage';
import StaffPage from '@/features/staff/StaffPage';
import UserManagerPage from '@/features/user/UserManagerPage';
import CourtClusterDetailsPage from "@/features/court-cluster/CourtClusterDetailsPage.tsx";
import StatisticPage from '@/features/statistic/StatisticPage';
import RevenuePage from '@/features/revenue/RevenuePage';
import CourtClusterCreatePage from "@/features/court-cluster/CourtClusterCreatePage.tsx";
import CourtClusterEditPage from "@/features/court-cluster/CourtClusterEditPage.tsx";
import BookingsPage from '@/features/booking/BookingsPage';
import BookingDetailsPage from '@/features/booking/BookingDetailsPage';

export const routes: RouteObject[] = [
 
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <StatisticPage />,
      },
      {
        path: 'cum-san',
        element: <CourtsPage />,
      },
      {
        path: 'cum-san/chi-tiet/:id',
        element: <CourtClusterDetailsPage />,
      },
      {
        path: 'cum-san/chinh-sua/:id',
        element: <CourtClusterEditPage />,
      },
      {
        path: 'cum-san/tao',
        element: <CourtClusterCreatePage />,
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
    path: 'server-error',
    element: <ServerError key="not-found" />,
  },
  {
    path: '*',
    element: <Navigate replace to="/not-found" />,
  },
];

export const router = createBrowserRouter(routes);
