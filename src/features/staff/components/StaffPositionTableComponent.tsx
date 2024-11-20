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
import { useEffect, useState } from 'react';
import { StaffInputDTO } from '@/app/models/role.model';
import agent from '@/app/api/agent';
import { toast } from 'react-toastify';

function StaffPositionTableComponent() {
  const { staffPositionStore, staffStore } = useStore();
  const { staffRoles, StaffPositionArray, loading } = staffPositionStore;
  const { loadingInitial } = staffStore;
  const [checkedStates, setCheckedStates] = useState<boolean[][]>([]);

  useEffect(() => {
    if (StaffPositionArray.length > 0 && staffRoles.length > 0) {
      const initialState = StaffPositionArray.map((position) =>
        staffRoles.map((role) => position.defaultRoles.includes(role))
      );
      setCheckedStates(initialState);
    }
  }, [StaffPositionArray, staffRoles]);

  // Ensure checkedStates is initialized correctly when roles or positions are still loading
  const isCheckedStateReady = checkedStates.length === StaffPositionArray.length &&
    checkedStates.every((state) => state.length === staffRoles.length);

  if (loadingInitial) {
    return <Skeleton borderRadius={'md'} height="14rem" />;
  }

  const handleCheckboxChange = (positionIndex: number, roleIndex: number) => {
    setCheckedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[positionIndex][roleIndex] = !newStates[positionIndex][roleIndex];
      return newStates;
    });
  };

  const updateRoleStaff = async () => {
    const data = StaffPositionArray.map((position, positionIndex) => ({
      name: position.name,
      roles: staffRoles.filter((role, roleIndex) => checkedStates[positionIndex][roleIndex]),
    }));
    const inputDtos: StaffInputDTO[] = [];
    data.forEach(role => {
      const inputDto = new StaffInputDTO({
        name: role.name,
        defaultRoles: role.roles,
      });
      inputDtos.push(inputDto);
    });
    await agent.StaffPositions.update(inputDtos)
      .then(() => toast.success("Cập nhật thành công"))
      .catch(() => toast.error("Cập nhật thất bại"))
  };

  const applyToAll = async () => {
    await agent.StaffPositions.applyAll()
      .then(() => toast.success("Cập nhật thành công"))
      .catch(() => toast.error("Cập nhật thất bại"))
  };

  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0}>
        <Table className="app-table" variant="simple" padding={0}>
          <Thead>
            <Tr>
              <Th w={`${100 / (staffRoles.length + 1)}%`}> Chức vụ </Th>
              {staffRoles.map((role) => (
                <Th w={`${100 / (staffRoles.length + 1)}%`} key={role}>
                  {role}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {StaffPositionArray.map((position, positionIndex) => (
              <Tr key={position.name}>
                <Td>{position.name}</Td>

                {staffRoles.map((role, roleIndex) => (
                  <Td key={`${position.name}-${role}`}>
                    <Center>
                      {isCheckedStateReady && (
                        <Checkbox
                          defaultChecked={position.defaultRoles.includes(role)}
                          checked={checkedStates[positionIndex][roleIndex]}
                          onChange={() => handleCheckboxChange(positionIndex, roleIndex)}
                        />
                      )}
                    </Center>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justifyContent={'end'} gap={2} mt={4}>
        <ButtonPrimaryAtoms loading={loading} className="text-sm" handleOnClick={applyToAll}>
          Apply to All
        </ButtonPrimaryAtoms>
        <ButtonPrimaryAtoms loading={loading} className="text-sm" handleOnClick={updateRoleStaff}>
          Update Change
        </ButtonPrimaryAtoms>
      </Flex>
    </>
  );
}

export default observer(StaffPositionTableComponent);
