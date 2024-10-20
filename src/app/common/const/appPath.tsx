import { Image } from '@chakra-ui/react';
import defaultIcon from '@/assets/document.svg';

export interface AppPath {
  key: number;
  icon: any;
  label: string;
  path: string;
  subPath?: AppPath[];
}

export const menuList: AppPath[] = [
 
  {
    key: 2,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Quản lý Users',
    path: '/users',
  },
  {
    key: 3,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Cụm sân',
    path: '/cum-san',
  },
  {
    key: 4,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Booking',
    path: '/booking',
  },

  {
    key: 5,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Nhân viên',
    path: '/nhan-vien',
  },
  {
    key: 6,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Hàng hóa',
    path: '/hang-hoa',
  },

  {
    key: 7,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Dịch vụ',
    path: '/dich-vu',
  },
  {
    key: 8,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Banner',
    path: '/banner',
  },
  {
    key: 9,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Tin tức',
    path: '/tin-tuc',
  },
  {
    key: 10,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Cài đặt',
    path: '/cai-dat',
    subPath: [
      {
        key: 10,
        icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
        label: 'Thể loại',
        path: '/cai-dat/the-loai',
      },
      {
        key: 10,
        icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
        label: 'Chức vụ',
        path: '/cai-dat/chuc-vu',
      }
    ],
  },
  {
    key: 1,
    icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
    label: 'Thống kê',
    path: '/',
  },
];
