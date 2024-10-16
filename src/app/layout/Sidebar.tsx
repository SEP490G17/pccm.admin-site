import { Button, Flex, Image, Spacer, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import defaultIcon from '@/assets/document.svg';

import { router } from '../router/Routes';
import logo from '@/assets/pickerball-icon.png';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import logoutIcon from '@/assets/logout.svg';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const menuList = [
    {
      key: '1',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Thống kê',
      path: '/',
    },
    {
      key: '2',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Quản lý Users',
      path: '/users',
    },
    {
      key: '3',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Cụm sân',
      path: '/cum-san',
    },
    {
      key: '4',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Booking',
      path: '/booking',
    },

    {
      key: '5',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Nhân viên',
      path: '/nhan-vien',
    },
    {
      key: '6',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Hàng hóa',
      path: '/hang-hoa',
    },

    {
      key: '7',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Dịch vụ',
      path: '/dich-vu',
    },
    {
      key: '8',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Banner',
      path: '/banner',
    },
    {
      key: '9',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Tin tức',
      path: '/tin-tuc',
    },
  ];
  const location = useLocation();
  useEffect(() => {
    setSelectedKey(menuList.find((menu) => menu.path === location.pathname)?.key ?? '1');
  }, []);
  
  const { authStore, commonStore } = useStore();

  return (
    <Flex direction="column" h="100vh" 
    width={commonStore.isCollapsed? '8rem':'18rem'} > 
      <Flex flexDirection={'column'}>
        <Flex
          width={'100%'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'6.25rem'}
          cursor={'pointer'}
          border={'2px solid #E7EDF3;'}
          borderRight={'0'}

        >
          <Image src={logo} width={'4.0345rem'} height={'2.677rem'} />

          <Text
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            opacity={commonStore.isCollapsed ? 0 : 1}
            fontSize={commonStore.isCollapsed ? '0.1rem' : '1.467rem'}
            fontWeight={400}
            className="font-rubik"
            transition="font-size 0.3s ease"
          >
            Pickle ball
          </Text>
        </Flex>
        <Flex flexDirection={'column'} pt={'2rem'} width={'100%'}>
          {menuList.map((item) => (
            <Button
              key={item.path}
              onClick={() => {
                setSelectedKey(item.key);
                router.navigate(item.path);
              }}
              bg={'white'}
              borderLeft={'0.1875rem solid transparent'}
              className={selectedKey === item.key ? 'link-active' : ''}
              color={'black'}
              justifyContent={commonStore.isCollapsed ? 'center' : 'start'}
              h={'3.75rem'}
              gap={2}
              boxSizing="border-box"
              borderRadius={0}
              pl={commonStore.isCollapsed ? '0' : '5rem'}
              py={'1.125rem'}
              width={'100%'}
              pr={'0'}
            >
              {item.icon}

              <Text
                className="link-text"
                color={'#63748A'}
                fontWeight={500}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                opacity={commonStore.isCollapsed ? 0 : 1}
                fontSize={commonStore.isCollapsed ? '0rem' : '1.25rem'}
              >
                {item.label}
              </Text>
            </Button>
          ))}
        </Flex>
      </Flex>
      <Spacer />
      <Button
        mb={'3.25rem'}
        width={'100%'}
        h={'3.75rem'}
        bg={'transparent'}
        justifyContent={commonStore.isCollapsed ? 'center' : 'start'}
        pl={commonStore.isCollapsed ? '0' : '5rem'}
        pr={'0'}
        py={'1.125rem'}
        borderRadius={0}
        boxSizing="border-box"
        _hover={{ background: 'transparent' }}
        gap={2}
        color={'#63748A'}
        fontSize={'1.25rem'}
        fontWeight={500}
        fontStyle={'normal'}
        onClick={() => {
          authStore.logout();
        }}
      >
        <Image src={logoutIcon} width={'2rem'} height={'2rem'} fontFamily={'Roboto'} />

        <Text
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          opacity={commonStore.isCollapsed ? 0 : 1}
          fontSize={commonStore.isCollapsed ? '0.1rem' : '1.25rem'}
          transition="font-size 0.3s ease"
        >
          Log Out
        </Text>
      </Button>
    </Flex>
  );
};

export default observer(Sidebar);
