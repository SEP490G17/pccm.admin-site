// src/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#00423D',
    primaryDark:'#173a1a',
    primaryLight:'#739072'
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'primary', // Sử dụng màu primary cho nút solid
          color: 'white',
          _hover: {
            bg: 'primaryDark', // Đổi màu khi hover
          },
        },
      },
    },
  },
});

export default theme;
