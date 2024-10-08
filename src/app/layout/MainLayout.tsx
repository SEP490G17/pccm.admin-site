import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import logoutIcon from "@/assets/logout.svg";
import { useStore } from "../stores/store";
import { router } from "../router/Routes";

function App() {
  const {authStore} = useStore();
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />

      <Grid
        templateAreas={`"nav header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={"6.25rem 1fr 30px"}
        gridTemplateColumns={"18rem 1fr"}
        h="200px"
        color="blackAlpha.700"
        fontWeight="bold"
        minHeight="100vh"
      >
        <GridItem bg="white" area={"header"} zIndex={1}>
          <Header />
        </GridItem>
        <GridItem
          bg="linear-gradient(180deg, #FFF 74.26%, #43E5A0 172.04%)"
          boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
          borderRight={"2px solid #E7EDF3"}
          area={"nav"}
          zIndex={2}
        >
          <Flex direction="column" h="100%">
            <Sidebar />
            <Spacer />
            <Button
              mb={"3.25rem"}
              width={"100%"}
              h={"3.75rem"}
              bg={"transparent"}
              justifyContent={"start"}
              pl={"5rem"}
              py={"1.125rem"}
              borderRadius={0}
              boxSizing="border-box"
              _hover={{ background: "transparent" }}
              gap={2}
              color={"#63748A"} fontSize={"1.25rem"} fontWeight={500} fontStyle={'normal'}
              onClick={() =>{
                authStore.logout();
                router.navigate("/auth/login");
              }}
            >
              <Image src={logoutIcon} width={"1.5rem"} height={"1.5rem"} fontFamily={'Roboto'} />
              <Text>
                Log Out
              </Text>
            </Button>
          </Flex>
        </GridItem>
        <GridItem area={"main"} bg={"#F5F6F7"}>
          <Outlet />
        </GridItem>
        <GridItem bg="white" area={"footer"}>
          Footer
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
