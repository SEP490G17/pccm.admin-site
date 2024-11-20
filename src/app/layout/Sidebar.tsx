import { Flex, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import logo from '@/assets/pickerball-icon.png';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { AppPath, getMenuList } from '../common/const/appPath';
import SideMenuItem from './SideMenuItem';
import _ from 'lodash';
const Sidebar = observer(() => {
  const location = useLocation();

  const { commonStore } = useStore();
  const[menu,setMenu] = useState<AppPath[]>([]);
  useEffect(() => {
    const menuList = getMenuList(commonStore.getRoles());
    setMenu(menuList);
    commonStore.setSelectedMenuItem(
      menu.find((menu) => _.includes(location.pathname, menu.path))?.key ?? 1,
    );
  }, []);
  return (
    <Flex flexDirection={'column'}>
      <Flex
        width={'100%'}
        ps={'0.7rem'}
        alignItems={'center'}
        cursor={'pointer'}
        borderBottom={'1.4px solid #E7EDF3'}
        className="sidebar-logo"
      >
        <Image src={logo} width={'4rem'} height={'2.7rem'} />

        <Text
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          opacity={commonStore.isCollapsed ? 0 : 1}
          fontSize={'1.3rem'}
          fontWeight={400}
          className="font-rubik"
        >
          Pickleball
        </Text>
      </Flex>
      <Flex flexDirection={'column'} alignItems={'center'} pt={'2rem'} width={'100%'} gap={4}>
        {_.sortBy(menu, ['key']).map((item, index) => (
          <SideMenuItem item={item} key={index} />
        ))}
      </Flex>
    </Flex>
  );
});

export default Sidebar;
