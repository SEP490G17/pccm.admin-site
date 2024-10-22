import { observer } from 'mobx-react-lite';
import {
  Badge,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useStore } from '@/app/stores/store';

function StaffTableComponent() {
  const { staffStore } = useStore();
  const { loading, StaffArray, staffPageParams } = staffStore;
  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th w={'5rem'}>STT</Th>
              <Th w={'15rem'}>Tên nhân viên</Th>
              <Th w={'10rem'}>CMND</Th>
              <Th w={'10rem'}>Số điện thoại</Th>
              <Th w={'10rem'}>Chức vụ</Th>
              <Th w={'20rem'}>Quyền hạn</Th>
              <Th w={'10rem'}>Ca làm</Th>
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading && <SkeletonTableAtoms numOfColumn={7} pageSize={staffPageParams.pageSize} />}
            {StaffArray.map((staff, index) => (
              <Tr key={staff.id}>
                <Td>{index + 1}</Td>
                <Td>{staff.fullName}</Td>
                <Td>{staff.cccd}</Td>
                <Td>{staff.phoneNumber}</Td>
                <Td>{staff.position}</Td>
                <Td ><Flex gap={2} className='text-wrap w-full flex-wrap'>
                  {staff.roles.map(role => <Badge bg={'var(--secondary-color-600)'} p={1} borderRadius={'md'} color={'white'} key={role}>{role}</Badge>)}</Flex></Td>
                <Td>{staff.shift}</Td>
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    aria-label="Edit"
                    colorScheme="teal"
                    size="sm"
                    mr={2}
                  />
                  <IconButton icon={<FaTrash />} aria-label="Delete" colorScheme="red" size="sm" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default observer(StaffTableComponent);
