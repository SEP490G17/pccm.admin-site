import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Flex,
  IconButton,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { CgFileDocument } from 'react-icons/cg';
import { useDisclosure } from '@chakra-ui/react';
import UserDetailPopUp from '@/features/user/UserDetailPopUp';
import ResetPasswordDialog from './ResetPasswordDialog';
import { ResetPasswordDTO } from '@/app/models/user.model';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

function UserTableComponents() {
  const { userStore, authStore } = useStore();
  const { userArray, userPageParams, loadingInitial } = userStore;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [localStatuses, setLocalStatuses] = useState<LocalStatuses>({});
  interface LocalStatuses {
    [key: string]: boolean;
  }

  useEffect(() => {
    setLocalStatuses(prevStatuses => {
      const userStatuses = { ...prevStatuses };
      for (const user of userArray) {
        if (!(user.username in prevStatuses)) {
          userStatuses[user.username] = user.lockoutEnabled;
        }
      }
      return userStatuses;
    });
  }, [userArray]);

  const handleChangeStatus = async (id: string, currentStatus: boolean) => {
    const userStatus = currentStatus === true ? false : true;
    setLocalStatuses(prevStatuses => ({ ...prevStatuses, [id]: userStatus }));

    try {
      await userStore.changeStatus(id, userStatus);
    } catch {
      setLocalStatuses(prevStatuses => ({ ...prevStatuses, [id]: currentStatus }));
    }
  };

  // const renderStatus = (status: string) => {
  //   let color = '';
  //   switch (status) {
  //     case 'Hoạt động':
  //       color = 'var(--primary-color-600)';
  //       break;
  //     case 'Không hoạt động':
  //       color = 'red';
  //       break;
  //     case 'Tạm thời khóa':
  //       color = 'gray';
  //       break;
  //     default:
  //       color = 'black';
  //   }
  //   return <Box color={color}>{status}</Box>;
  // };
  const handleViewDetails = (userId: string) => {
    onOpen();
    userStore.loadUserDetails(userId);
  };

  const handleResetPassword = (email: string) => {
    const data = new ResetPasswordDTO({
      email: email
    });
    authStore.resetPassword(data);
  };

  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th w={'5rem'}>STT</Th>
              <Th w={'10rem'}>Tên đăng kí</Th>
              <Th w={'15rem'}>Email</Th>
              <Th w={'10rem'}>Số điện thoại</Th>
              <Th w={'10rem'}>Ngày mở khóa</Th>
              <Th w={'10rem'}>Trạng thái</Th>
              <Th w={'10rem'}>Khóa người dùng</Th>
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={userPageParams.pageSize} />
            ) : (
              userArray.map((user, index) => (
                <Tr key={user.email}>
                  <Td>{index + 1}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                  <Td>{user.lockoutEnd ? dayjs(user.lockoutEnd).format('DD/MM/YYYY') : ''}</Td>
                  <Td>
                    <Box color={user.isDisabled ? 'red' : 'var(--primary-color-600)'}>
                      {user.isDisabled ? 'Không hoạt động' : 'Hoạt động'}
                    </Box>
                  </Td>
                  <Td>
                    <Switch
                      isChecked={localStatuses[user.username] === true}
                      isDisabled={userStore.isLoading(user.username)}
                      onChange={() => {
                        const previousStatus = localStatuses[user.username];
                        handleChangeStatus(user.username, localStatuses[user.username])
                          .catch(() => {
                            setLocalStatuses((prevStatuses) => {
                              const updatedStatuses = { ...prevStatuses };
                              updatedStatuses[user.username] = previousStatus;
                              return updatedStatuses;
                            });
                          });
                      }}
                    />
                  </Td>
                  <Td>
                    <Flex direction={'row'} gap={'3'}>
                      <Tooltip hasArrow placement='top' label="Xem chi tiết" bg="gray.300" color="black">
                        <IconButton
                          icon={<CgFileDocument className="text-white text-lg" />}
                          size={'sm'}
                          colorScheme="blue"
                          aria-label={'Details'}
                          onClick={() => handleViewDetails(user.username)}
                        />
                      </Tooltip>
                      <ResetPasswordDialog
                        email={user.email}
                        name={user.fullName}
                        onReset={async () => {
                          await handleResetPassword(user.email);
                        }}
                      ></ResetPasswordDialog>
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <UserDetailPopUp isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default observer(UserTableComponents);
