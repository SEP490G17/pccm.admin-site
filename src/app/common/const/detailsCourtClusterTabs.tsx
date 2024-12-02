import CourtClusterBookingTab from '@/features/court-cluster/Details/Tabs/CourtClusterBookingTab';
import CourtClusterProductsTab from '@/features/court-cluster/Details/Tabs/CourtClusterProductsTab';
import CourtClusterServicesTab from '@/features/court-cluster/Details/Tabs/CourtClusterServicesTab';

const tabs = [
  {
    label: 'Booking',
    component: <CourtClusterBookingTab />,
    roles: ['Owner', 'ManagerBooking', 'ManagerCourtCluster'],
  },
  {
    label: 'Sản phẩm',
    component: <CourtClusterProductsTab />,
    roles: ['All'],
  },
  {
    label: 'Dịch vụ',
    component: <CourtClusterServicesTab />,
    roles: ['All'],
  },
];

// Lọc tab dựa trên roles
export const accessibleTabs = (roles:string[]) => tabs.filter((tab) => tab.roles.some((role) => roles.includes(role)||tab.roles.includes('All')));
