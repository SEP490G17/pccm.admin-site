import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { store, StoreContext } from "./app/stores/store.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import "react-toastify/dist/ReactToastify.min.css";
import theme from "./app/common/theme/chakraThemeCustom.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </StoreContext.Provider>
  </StrictMode>
);
