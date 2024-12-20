import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { store, StoreContext } from './app/stores/store.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.tsx';
import theme from './app/common/theme/chakraThemeCustom.ts';
import '@/index.scss';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </StoreContext.Provider>
  </StrictMode>,
);
