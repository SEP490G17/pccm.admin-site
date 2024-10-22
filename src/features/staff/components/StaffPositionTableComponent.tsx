import { useStore } from '@/app/stores/store';
import {
  Center,
  Checkbox,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';

function StaffPositionTableComponent() {
  const { staffPositionStore, staffStore } = useStore();
  const { staffRoles, StaffPositionArray, loading } = staffPositionStore;
  const { loadingInitial } = staffStore;
  if(loadingInitial){
    return <Skeleton borderRadius={'md'} height="14rem" />
  }
  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} >
          <Table className="app-table" variant="simple" padding={0}>
            <Thead>
              <Th w={`${100 / (staffRoles.length + 1)}%`}> Chức vụ </Th>
              {staffRoles.map((role) => (
                <Th w={`${100 / (staffRoles.length + 1)}%`} key={role}>
                  {role}
                </Th>
              ))}
            </Thead>
            <Tbody>
              {StaffPositionArray.map((position) => (
                <Tr key={position.name}>
                  <Td>{position.name}</Td>
                  {staffRoles.map((role) => (
                    <Td key={`${position.name}-${role}`}>
                      <Center>
                        <Checkbox isChecked={position.defaultRoles.includes(role)} />
                      </Center>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
      </TableContainer>
      <Flex justifyContent={'end'} gap={2} mt={4}>
            <ButtonPrimaryAtoms loading={loading} className='text-sm'>Apply to All</ButtonPrimaryAtoms>
            <ButtonPrimaryAtoms loading={loading} className='text-sm'>Update Change</ButtonPrimaryAtoms>
      </Flex>
    </>
  );
}

export default observer(StaffPositionTableComponent);
