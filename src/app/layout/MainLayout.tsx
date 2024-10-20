import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import { Box, Button, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { AiOutlineLogout } from 'react-icons/ai';

const App = () => {
  const { authStore, commonStore } = useStore();

  return (
    <>
      <ToastContainer position="top-right" hideProgressBar theme="colored" />
      <Box
        minH={'100vh'}
        color="blackAlpha.700"
        p={0}
        m={0}
        fontWeight="bold"
        className="main-layout"
      >
        <Flex
          as={'header'}
          justifyContent={'space-between'}
          className={`${commonStore.isCollapsed && 'collapsed'}`}
          alignItems={'center'}
          pr={'5.375rem'}
          pl={'1rem'}
          position={'fixed'}
          top={0}
          zIndex={20}
          minWidth={'960px'}
        >
          <Header />
        </Flex>

        <Flex
          className={`sidebar ${commonStore.isCollapsed && 'collapsed'}`}
          as="nav"
          position="fixed"
          top={0}
          left={0}
          bottom={0}
          m={0}
          p={0}
          direction="column"
          bg="#FFF"
          boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}
          h="100vh"
          zIndex={999}
        >
          <Sidebar />
          <Spacer />
          <Center mb={'3.25rem'}>
            <Button
              colorScheme="gray"
              gap={2}
              fontSize={'1.25rem'}
              boxSizing="border-box"
              fontWeight={500}
              size={'lg'}
              width={'80%'}
              fontStyle={'normal'}
              onClick={() => {
                authStore.logout();
              }}
              alignItems={'center'}
              p={0}
            >
              <AiOutlineLogout />
              <Text
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                opacity={commonStore.isCollapsed ? 0 : 1}
                fontSize={commonStore.isCollapsed ?'0':'1.25rem'}
              >
                Log Out
              </Text>
            </Button>
          </Center>
        </Flex>
        <Box as="main" className={`${commonStore.isCollapsed && 'collapsed'}`} minWidth={'960px'} overflowX={'scroll'}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default observer(App);
