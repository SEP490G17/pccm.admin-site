import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import defaultIcon from '@/assets/document.svg';

import { router } from '../router/Routes';
import logo from '@/assets/pickerball-icon.png';

function Sidebar() {
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
      path: '/orders',
    },
    {
      key: "3",
      icon: <Image src={defaultIcon} width={"1.5rem"} height={"1.5rem"} />,
      label: "Cụm sân",
      path: "/Court",
    },
    {
      key: '4',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Booking',
      path: '/courts',
    },

    {
      key: '5',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Nhân viên',
      path: '/settings',
    },
    {
      key: '6',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Hàng hóa',
      path: '/logout',
    },

    {
      key: '7',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Dịch vụ',
      path: '/logout',
    },
    {
<<<<<<< HEAD
      key: "8",
      icon: <Image src={defaultIcon} width={"1.5rem"} height={"1.5rem"} />,
      label: "Banner",
      path: "/Banner",
    },
    {
      key: "9",
      icon: <Image src={defaultIcon} width={"1.5rem"} height={"1.5rem"} />,
      label: "Tin tức",
      path: "/News",
=======
      key: '8',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Banner',
      path: '/logout',
    },
    {
      key: '9',
      icon: <Image src={defaultIcon} width={'1.5rem'} height={'1.5rem'} />,
      label: 'Tin tức',
      path: '/logout',
>>>>>>> 7a5b9f83a237d285e0ab4bd19772ebd551bd72e5
    },
  ];
  return (
    <Flex flexDirection={'column'}>
      <Flex
        width={'18rem'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'6.25rem'}
        cursor={'pointer'}
        border={'2px solid #E7EDF3;'}
      >
        <Image src={logo} width={'4.0345rem'} height={'2.677rem'} />
        <Text fontSize={'1.467rem'} fontWeight={400} className="font-rubik">
          Pickle ball
        </Text>
      </Flex>
      <Flex flexDirection={'column'} pt={'2rem'}>
        {menuList.map((item) => (
          <Button
            onClick={() => {
              router.navigate(item.path);
              setSelectedKey(item.key);
            }}
            bg={'white'}
            className={selectedKey === item.key ? 'link-active' : ''}
            color={'black'}
            justifyContent={'start'}
            h={'3.75rem'}
            gap={2}
            boxSizing="border-box"
            borderRadius={0}
            pl={'5rem'}
            py={'1.125rem'}
          >
            {item.icon}{' '}
            <Text className="link-text" color={'#63748A'} fontSize={'1.25rem'} fontWeight={500}>
              {item.label}
            </Text>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}

export default Sidebar;
