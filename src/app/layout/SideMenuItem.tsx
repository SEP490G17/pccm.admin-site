import { Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { router } from '../router/Routes';
import { AppPath } from '../common/const/appPath';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';
import _ from 'lodash';
interface IProp {
  item: AppPath;
}

function SideMenuItem({ item }: IProp) {
  const { commonStore } = useStore();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const location = useLocation();

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
    console.log(location.pathname);
  };
  return (
    <>
      {item.subPath ? (
        <Flex w={'90%'} flexDirection={'column'}>
          <Button
            key={item.path}
            onClick={toggleSubMenu}
            className={commonStore.selectedMenuItem === item.key ? 'link-active' : ''}
            color={'black'}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={2}
            boxSizing="border-box"
            pr={'0.5rem'}
            width={'100%'}
            size={'md'}
            colorScheme="gray"
            variant={'ghost'}
            pl={'1.7rem'}
          >
            <Flex direction={'row'} gap={4} alignItems={'center'}>
              {item.icon(commonStore.selectedMenuItem === item.key)}

              <Text
                color={'#63748A'}
                className="link-text"
                fontWeight={500}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontSize={'1.25rem'}
                opacity={commonStore.isCollapsed ? 0 : 1}
              >
                {item.label}
              </Text>
            </Flex>
            <Flex
              opacity={commonStore.isCollapsed ? 0 : 1}
              transform={subMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="transform 0.2s ease-in-out"
              alignItems={'center'}
              justifyContent={'center'}
            >
              <IoMdArrowDropdown size={18} />
            </Flex>
          </Button>
          {subMenuOpen && (
            <Flex
              w={'100%'}
              py={2}
              direction={'column'}
              gap={3}
              pl={'4rem'}
              opacity={commonStore.isCollapsed ? 0 : 1}
            >
              {item.subPath?.map((subItem, idx) => {
                return (
                  <Button
                    key={idx}
                    onClick={() => {
                      commonStore.setSelectedMenuItem(item.key);
                      router.navigate(subItem.path);
                    }}
                    color={'black'}
                    justifyContent={'space-between'}
                    gap={2}
                    boxSizing="border-box"
                    pr={'0.5rem'}
                    size={'sm'}
                    colorScheme="gray"
                    variant={'link'}
                  >
                    <Text
                      className="link-text"
                      color={'#63748A'}
                      fontWeight={`${_.includes(location.pathname, subItem.path) ? 600 : 500}`}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontSize={'1rem'}
                    >
                      <span>{subItem.label}</span>
                    </Text>
                  </Button>
                );
              })}
            </Flex>
          )}
        </Flex>
      ) : (
        <>
          <Button
            key={item.path}
            onClick={() => {
              commonStore.setSelectedMenuItem(item.key);
              router.navigate(item.path);
            }}
            className={`${commonStore.selectedMenuItem === item.key ? 'link-active' : ''} group`}
            color={'black'}
            justifyContent={'start'}
            gap={4}
            boxSizing="border-box"
            pr={0}
            width={'90%'}
            size={'md'}
            colorScheme="gray"
            variant={'ghost'}
            pl={'1.7rem'}
            position={'relative'}
          >
            {item.icon(commonStore.selectedMenuItem === item.key)}

            <Text
              className="link-text"
              color={'#63748A'}
              fontWeight={500}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontSize={'1.25rem'}
              opacity={commonStore.isCollapsed ? 0 : 1}
            >
              {item.label}
            </Text>
            {commonStore.isCollapsed && (
              <h2
                className={`absolute invisible top-0  items-center flex left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-4 py-2 group-hover:visible group-hover:left-24 group-hover:duration-300`}
              >
                {item.label}
              </h2>
            )}
          </Button>
        </>
      )}
    </>
  );
}

export default observer(SideMenuItem);
