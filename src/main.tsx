import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { store, StoreContext } from './app/stores/store.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.tsx';
import 'react-toastify/dist/ReactToastify.min.css';
import theme from './app/common/theme/chakraThemeCustom.ts';
import '@/index.scss';
import { L10n } from '@syncfusion/ej2-base';

L10n.load({
    'vi': {
        'recurrenceeditor': {
            'none': 'Không',
            'daily': 'Hằng ngày',
            'weekly': 'Hằng tuần',
            'monthly': 'Hằng tháng',
            'yearly': 'Hằng năm',
            'until': 'Cho đến khi',
            'count': 'Số lần',
            // Thêm các văn bản khác mà bạn muốn tùy chỉnh
        }
    }
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </StoreContext.Provider>
  </StrictMode>,
);
