import { Avatar, Center, Divider, Flex, Image, Text } from "@chakra-ui/react";
import notificationIcon from "@/assets/notification.svg";
import defaultUserIcon from "@/assets/defaultUser.png";
import arrowDownIcon from "@/assets/arrow-down.svg";

function Header() {
  return (
    <Flex
      width={"100%"}
      height={"100%"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      pr={'5.375rem'}
    >
      
      <Flex flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={6}>
        <Flex
          display={"inline-flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"0.625rem"}
          borderRadius={"100%"}
          border={"1px solid #63748A"}
          padding={"0.5rem"}
        >
          <Image src={notificationIcon} width={"1.5rem"} height={"1.5rem"} />
        </Flex>
        <Center>
          <Divider  orientation="vertical" height={"3rem"} borderWidth={'0.15rem'}/>
        </Center>
        <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={3}>
            <Avatar src={defaultUserIcon} width={'3.25rem'} height={'3.25rem'}/>
            <Flex flexDirection={"column"}>
                <Text color={'#333'} fontSize={'1.05rem'} fontWeight={500}>Nguyen Trung Kien</Text>
                <Text color={'#777'} fontSize={'1.05rem'} fontWeight={400}>0865859202</Text>
            </Flex>
            <button>
                <Image src={arrowDownIcon} width={'1.5rem'} height={'1.5rem'}/>
            </button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Header;
