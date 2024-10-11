import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import TestErrors from '@/features/errors/TestError';
import NotFound from '@/features/errors/NotFound';
import ServerError from '@/features/errors/ServerError';
import MainLayout from '@/app/layout/MainLayout';
import LoginPage from '@/features/login/LoginPage';
import ListCourtsComponent from "@/features/components/Court/ListCourtsComponent";
import CreateEventComponent from "@/features/components/EventNews/CreateEventComponent";
import CreateCourtComponent from "@/features/components/Court/CreateCourtComponent";
import CourtList from '@/features/court/CourtList';
import BannerList from '@/features/banner/BannerList';
import NewsList from '@/features/news/NewsList';

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
        path: "courts",
        element: <ListCourtsComponent/>,
      },
      {
        path: "events",
        element: <CreateEventComponent/>,
      },
      {
        path: "courts/create",
        element: <CreateCourtComponent/>,
      },
      {
        path: "News",
        element: <NewsList/>,
      },
      {
        path: "errors",
        element: <TestErrors key="errors" />,
      },
      {
        path: "court",
        element: <CourtList></CourtList>,
      },
      {
        path: "banner",
        element: <BannerList></BannerList>,
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
