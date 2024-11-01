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
import { MdLockReset } from 'react-icons/md';

function UserTableComponents() {
  const { userStore } = useStore();
  const { userArray, loading, userPageParams } = userStore;
  const renderStatus = (status: string) => {
    let color = '';
    switch (status) {
      case 'Hoạt động':
        color = 'var(--primary-color-600)';
        break;
      case 'Không hoạt động':
        color = 'red';
        break;
      case 'Tạm thời khóa':
        color = 'gray';
        break;
      default:
        color = 'black';
    }
    return <Box color={color}>{status}</Box>;
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
              <Th w={'10rem'}>Kích hoạt</Th>
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={userPageParams.pageSize} />
            ) : (
              userArray.map((user, index) => (
                <Tr key={user.email}>
                  <Td>{index + 1}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                  <Td>{user.lockoutEnd}</Td>
                  <Td>{renderStatus(user.lockoutEnable ? 'Không hoạt động' : 'Hoạt động')}</Td>
                  <Td>
                    <Switch isChecked={!user.isDisabled} colorScheme={'blue'} />
                  </Td>
                  <Td>
                    <Flex direction={'row'} gap={'3'}>
                      <Tooltip hasArrow placement='top' label="Xem chi tiết" bg="gray.300" color="black">
                        <IconButton
                          icon={<CgFileDocument className="text-white text-lg" />}
                          size={'sm'}
                          colorScheme="blue"
                          aria-label={'Details'}
                        />
                      </Tooltip>
                      <Tooltip hasArrow placement='top' label="Reset mật khẩu" bg="gray.300" color="black">
                        <IconButton
                          icon={<MdLockReset className="text-lg" />}
                          aria-label="Edit"
                          colorScheme="red"
                          size="sm"
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default observer(UserTableComponents);
