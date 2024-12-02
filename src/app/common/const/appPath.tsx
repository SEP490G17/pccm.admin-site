import CourtClusterMenuIcon from '@/features/atoms/menuIcon/CourtClusterMenuIcon';
import BookingMenuIcon from '@/features/atoms/menuIcon/BookingMenuIcon';
import StaffMenuIcon from '@/features/atoms/menuIcon/StaffMenuIcon';
import ProductMenuIcon from '@/features/atoms/menuIcon/ProductMenuIcon';
import ServiceMenuIcon from '@/features/atoms/menuIcon/ServiceMenuIcon';
import NewsMenuIcon from '@/features/atoms/menuIcon/NewsMenuIcon';
import BannerMenuIcon from '@/features/atoms/menuIcon/BannerMenuIcon';
import StatisticMenuIcon from '@/features/atoms/menuIcon/StatisticMenuIcon';
import UsersManagerMenuIcon from '@/features/atoms/menuIcon/UsersManagerMenuIcon';

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
    icon: (isSelected: boolean) => (
      <StatisticMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Doanh thu',
    path: '/doanh-thu',
  },
  {
    key: 3,
    icon: (isSelected: boolean) => (
      <UsersManagerMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Người dùng',
    path: '/users',
  },
  {
    key: 4,
    icon: (isSelected: boolean) => (
      <CourtClusterMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Cụm sân',
    path: '/cum-san',
  },
  {
    key: 5,
    icon: (isSelected: boolean) => (
      <BookingMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Booking',
    path: '/booking',
  },
  {
    key: 6,
    icon: (isSelected: boolean) => (
      <StaffMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Nhân viên',
    path: '/nhan-vien',
  },
  {
    key: 7,
    icon: (isSelected: boolean) => (
      <ProductMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Hàng hóa',
    path: '/hang-hoa',
  },
  {
    key: 8,
    icon: (isSelected: boolean) => (
      <ServiceMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Dịch vụ',
    path: '/dich-vu',
  },
  {
    key: 9,
    icon: (isSelected: boolean) => (
      <BannerMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Banner',
    path: '/banner',
  },
  {
    key: 10,
    icon: (isSelected: boolean) => (
      <NewsMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Tin tức',
    path: '/tin-tuc',
  },
  {
    key: 1,
    icon: (isSelected: boolean) => (
      <StatisticMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Thống kê',
    path: '/',
  },
];

export const menuListAdmin: AppPath[] = [
  {
    key: 2,
    icon: (isSelected: boolean) => (
      <UsersManagerMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Người dùng',
    path: '/users',
  },
  {
    key: 3,
    icon: (isSelected: boolean) => (
      <StaffMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Nhân viên',
    path: '/nhan-vien',
  },
  {
    key: 4,
    icon: (isSelected: boolean) => (
      <ProductMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Hàng hóa',
    path: '/hang-hoa',
  },
  {
    key: 5,
    icon: (isSelected: boolean) => (
      <ServiceMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Dịch vụ',
    path: '/dich-vu',
  },
  {
    key: 6,
    icon: (isSelected: boolean) => (
      <BannerMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Banner',
    path: '/banner',
  },
  {
    key: 7,
    icon: (isSelected: boolean) => (
      <NewsMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
    ),
    label: 'Tin tức',
    path: '/tin-tuc',
  },
  {
    key: 1,
    icon: (isSelected: boolean) => (
      <CourtClusterMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Cụm sân',
    path: '/',
  },
];

export const getMenuList = (roles: string[]): AppPath[] => {
  if (roles.includes('Admin')) {
    return menuListAdmin;
  }
  if (roles.includes('Owner')) {
    return menuList;
  }

  const menuStaffList = [];

  if (roles.includes('ManagerCustomer')) {
    menuStaffList.push({
      key: menuStaffList.length + 2,
      icon: (isSelected: boolean) => (
        <UsersManagerMenuIcon
          width="1.5rem"
          height="1.5rem"
          color={isSelected ? '#00423D' : '#63748A'}
        />
      ),
      label: 'Người dùng',
      path: '/users',
    });
  }
  if (roles.includes('ManagerStaff')) {
    menuStaffList.push({
      key: menuStaffList.length + 2,
      icon: (isSelected: boolean) => (
        <StaffMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
      ),
      label: 'Nhân viên',
      path: '/nhan-vien',
    });
  }

  if (roles.includes('ManagerSupplies')) {
    menuStaffList.push({
      key: menuStaffList.length + 2,
      icon: (isSelected: boolean) => (
        <ProductMenuIcon
          width="1.5rem"
          height="1.5rem"
          color={isSelected ? '#00423D' : '#63748A'}
        />
      ),
      label: 'Hàng hóa',
      path: '/hang-hoa',
    });
    menuStaffList.push({
      key: menuStaffList.length + 2,
      icon: (isSelected: boolean) => (
        <ServiceMenuIcon
          width="1.5rem"
          height="1.5rem"
          color={isSelected ? '#00423D' : '#63748A'}
        />
      ),
      label: 'Dịch vụ',
      path: '/dich-vu',
    });
  }

  if (roles.includes('ManagerBanner')) {
    menuStaffList.push({
      key: menuStaffList.length + 2,
      icon: (isSelected: boolean) => (
        <BannerMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
      ),
      label: 'Banner',
      path: '/banner',
    });
  }

  if (roles.includes('ManagerNews')) {
    menuStaffList.push({
      key: menuStaffList.length + 2,
      icon: (isSelected: boolean) => (
        <NewsMenuIcon width="1.5rem" height="1.5rem" color={isSelected ? '#00423D' : '#63748A'} />
      ),
      label: 'Tin tức',
      path: '/tin-tuc',
    });
  }
  menuStaffList.push({
    key: 1,
    icon: (isSelected: boolean) => (
      <CourtClusterMenuIcon
        width="1.5rem"
        height="1.5rem"
        color={isSelected ? '#00423D' : '#63748A'}
      />
    ),
    label: 'Cụm sân',
    path: '/',
  });

  return menuStaffList;
};
