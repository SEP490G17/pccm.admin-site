import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import TestErrors from '@/features/errors/TestError';
import NotFound from '@/features/errors/NotFound';
import ServerError from '@/features/errors/ServerError';
import MainLayout from '@/app/layout/MainLayout';
import LoginPage from '@/features/login/LoginPage';

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
        path: 'errors',
        element: <TestErrors key="errors" />,
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
    ],
  },
];

export const router = createBrowserRouter(routes);
