import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import pickerballIcon from "@/assets/pickerball-icon.png";
import "./style.scss";
import LoginFormComponent from "./LoginFormComponent";
function LoginPage() {
  return (
    <Card
      borderRadius={{ base: 0, lg: "3.125rem" }}
      backgroundColor="white"
      width={{base:'100vw', lg:'44.6875rem'}}
      height={{ base: "100vh", lg: "50rem" }}
      paddingTop={"4.188rem"}
      paddingBottom={"4.563rem"}
      className="login-card"
    >
      <CardHeader
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        rowGap={"3.125rem"}
        className="login-card__header"
      >
        <Flex flexDirection={"row"} alignItems={"center"}>
          <Image src={pickerballIcon} width={"4.092rem"} height={"2.715rem"} />
          <Heading className="login-card__header--logo-text" size="md">
            Pickerball
          </Heading>
        </Flex>
        <Box width={"18.938rem"} height={"8.75rem"}>
          <Heading className="login-card__header--title">
            CHÀO MỪNG QUAY TRỞ LẠI
          </Heading>
        </Box>
      </CardHeader>

      <CardBody className="login-card__body">
        <LoginFormComponent />
      </CardBody>
    </Card>
  );
}

export default LoginPage;
