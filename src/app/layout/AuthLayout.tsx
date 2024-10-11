import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import './authStyle.scss';
import { Flex } from '@chakra-ui/react';
function AuthLayout() {
  return (
    <>
      <ToastContainer position="top-right" hideProgressBar theme="colored" />
      <Flex
        align="center"
        justifyContent="flex-end"
        pr={{ base: 0, lg: '5rem' }}
        className="auth-background"
      >
        <Outlet />
      </Flex>
    </>
  );
}

export default AuthLayout;
