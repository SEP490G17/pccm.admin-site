import { Avatar, Button, Center, Divider, Flex, Image, Text } from '@chakra-ui/react';
import notificationIcon from '@/assets/notification.svg';
import defaultUserIcon from '@/assets/defaultUser.png';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { useEffect } from 'react';
const Header = () => {
  const { commonStore, authStore } = useStore();
  useEffect(() =>{
    authStore.getUser();
  } , []);
  return (
    <>
      <Button
        p={0}
        _hover={{ backgroundColor: 'transparent' }}
        onClick={() => commonStore.toggleSidebar()}
        bgColor={'transparent'}
      >
        {commonStore.isCollapsed ? (
          <AiOutlineMenuUnfold fontSize={'1.5rem'} />
        ) : (
          <AiOutlineMenuFold fontSize={'1.5rem'} />
        )}
      </Button>
      <Flex flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={6}>
        <Flex
          display={'inline-flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={'0.625rem'}
          borderRadius={'100%'}
          border={'1px solid #63748A'}
          padding={'0.5rem'}
        >
          <Image src={notificationIcon} width={'1.5rem'} height={'1.5rem'} />
        </Flex>
        <Center>
          <Divider orientation="vertical" height={'2rem'} borderWidth={'0.15rem'} />
        </Center>
        <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={3}>
          <Avatar src={defaultUserIcon} size={'md'} />
          <Flex flexDirection={'column'}>
            <Text color={'#333'} fontSize={'1rem'} fontWeight={500}>
              {authStore.userApp?.displayName}
            </Text>
            <Text color={'#777'} fontSize={'1rem'} fontWeight={400}>
              0865859202
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default observer(Header);
