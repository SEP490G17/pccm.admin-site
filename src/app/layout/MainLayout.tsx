import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import { Box, Button, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { AiOutlineLogout } from 'react-icons/ai';
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
 "ORg4AjUWIQA/Gnt2UlhhQlVMfV5DQmFAYVF2R2dJflx6dl1MY15BNQtUQF1hTX9TdUVjWn9XcHVRQ2lc"
);const App = () => {
  const { authStore, commonStore } = useStore();

  return (
    <>
      <ToastContainer position="top-right" hideProgressBar theme="colored" />
      <Box
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
          h="100%"
          zIndex={999}
        >
          <Sidebar />
          <Spacer />
          <Center mb={'3.25rem'}>
            <Button
              colorScheme="red"
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
                whiteSpace="pre-wrap"
                overflow="hidden"
                textOverflow="ellipsis"
                opacity={commonStore.isCollapsed ? 0 : 1}
                fontSize={commonStore.isCollapsed ? '0' : '1.25rem'}
              >
                Log Out
              </Text>
            </Button>
          </Center>
        </Flex>
        <Flex
          direction="column"
          px={8}
          as="main"
          className={`${commonStore.isCollapsed && 'collapsed'}`}
          pt={5}
        >
          <Outlet />
        </Flex>
      </Box>
    </>
  );
};

export default observer(App);
