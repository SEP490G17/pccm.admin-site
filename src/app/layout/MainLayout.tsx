import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

const App = () => {
  const { commonStore } = useStore();

  return (
    <>
      <ToastContainer position="top-right" hideProgressBar theme="colored" />

      <Grid
        templateAreas={`"nav header"
                         "nav main"`}
        gridTemplateRows={'6.25rem 1fr'}
        gridTemplateColumns={commonStore.isCollapsed ? '8rem 1fr' : '18rem 1fr'}
        h="200px"
        color="blackAlpha.700"
        fontWeight="bold"
        minHeight="100vh"
        transition="all 0.3s ease"

      >
        <GridItem
          bg="white"
          area={'header'}
          marginLeft={commonStore.isCollapsed ? '8rem' : '18rem'}
          width={commonStore.isCollapsed ? 'calc(100vw - 8rem)' : 'calc(100vw - 18rem)'}
          height={'6.25rem'}
          position={'fixed'}
        >
          <Header />
        </GridItem>
        <GridItem
          bg="linear-gradient(180deg, #FFF 74.26%, #43E5A0 172.04%)"
          boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}
          area={'nav'}
          h="100vh"
          width={commonStore.isCollapsed ? '8rem' : '18rem'}
          transition="all 0.3s ease"
          position={'fixed'}
        >
          <Sidebar />
        </GridItem>
        <GridItem area={'main'} bg={'#F5F6F7'}>
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
};

export default observer(App);
