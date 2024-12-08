import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
// import notificationIcon from '@/assets/notification.svg';
// import defaultUserIcon from '@/assets/defaultUser.png';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { Divider, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChangePasswordPopUp from '@/features/profile/ChangePasswordPopUp';
const Header = observer(() => {
  const navigate = useNavigate();
  const { commonStore, authStore } = useStore();
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);

  useEffect(() => {
    if (commonStore.token) {
      authStore.getUser();
    }
  }, [authStore, commonStore]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'viewProfile') {
      if (authStore.userApp) {
        navigate('/thongtin');
      }
    } else if (key === 'changePassword') {
      setChangePasswordModalVisible(true);
    } else if (key === 'logout') {
      authStore.logout();
    }
  };
  const menu = (
    <Menu className="menu" onClick={handleMenuClick}>
      <Menu.Item key="viewProfile" >
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="changePassword" >
        Đổi mật khẩu
      </Menu.Item>
      <Divider style={{ margin: '4px 0' }} />
      {(
        <Menu.Item key="logout" >
          Đăng xuất
        </Menu.Item>
      )}
    </Menu>
  );
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
        {/* <Flex
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
        </Center> */}
        <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={3}>
          <Avatar src={authStore.userApp?.image} size={'md'} />

          <Dropdown
            className="dropdown"
            overlay={menu}
            trigger={['hover']}
            overlayStyle={{ marginTop: '2rem' }} // Điều chỉnh vị trí dropdown
          >
            <div style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
              <Flex flexDirection={'column'}>
                <Text color={'#333'} fontSize={'1rem'} fontWeight={500}>
                  {authStore.userApp?.displayName}
                </Text>
                <Text color={'#777'} fontSize={'1rem'} fontWeight={400}>
                  {authStore.userApp?.phoneNumber}
                </Text>
              </Flex>
            </div>
          </Dropdown>
        </Flex>
      </Flex>
      <ChangePasswordPopUp
        visible={isChangePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />
    </>
  );
});

export default Header;
