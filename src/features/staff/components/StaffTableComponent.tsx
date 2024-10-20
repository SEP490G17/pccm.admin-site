import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useStore } from '@/app/stores/store';

function StaffTableComponent() {
  const { staffStore } = useStore();
  const { loading, staffArray, staffPageParams } = staffStore;
  return (
    <>
      <TableContainer
        bg={'white'}
        borderRadius={'md'}
        padding={0}
        border={'1px solid #000'}
        mb="1.5rem"
      >
        <Table variant="simple" padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Tên nhân viên
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                CMND
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Số điện thoại
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Chức vụ
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Quyền hạn
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ca làm
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={staffPageParams.pageSize} />
            ) : (
              staffArray.map((staff, index) => (
                <Tr key={staff.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {staff.name}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {staff.identityCard}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {staff.phoneNumber}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {staff.position}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {staff.permission}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {staff.shift}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} display={'flex'} gap={'0.5rem'}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Edit"
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      colorScheme="red"
                      size="sm"
                    />
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

export default observer(StaffTableComponent);
