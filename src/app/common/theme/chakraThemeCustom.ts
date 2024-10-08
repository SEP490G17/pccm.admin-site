// src/theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#00423D",
    primaryDark: "#173a1a",
    primaryLight: "#739072",
  },
  components: {
    Button: {
      variants: {
        solid: (props:any) => ({
          bg: props.colorScheme === "primary" ? "primary" : undefined,
          color: props.colorScheme === "primary" ? "white" : undefined,
          _hover: {
            bg: props.colorScheme === "primary" ? "primaryDark" : undefined,
          },
        }),
      },
    },
  },
});

export default theme;
