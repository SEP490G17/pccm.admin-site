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
      borderRadius={{ base: 0, md: "50px" }}
      backgroundColor="white"
      width={{base:'100vw', md:'600px', xl:'715px'}}
      height={{ base: "100vh", md: "720px", xl:'800px' }}
      paddingTop={"67px"}
      paddingBottom={"73px"}
      className="login-card"
    >
      <CardHeader
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        rowGap={"50px"}
        className="login-card__header"
      >
        <Flex flexDirection={"row"} alignItems={"center"}>
          <Image src={pickerballIcon} width={"65.468px"} height={"43.447px"} />
          <Heading className="login-card__header--logo-text" size="md">
            Pickerball
          </Heading>
        </Flex>
        <Box width={"303px"} height={"140px"}>
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
