import { observer } from 'mobx-react';
import {Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms.tsx';
import { useStore } from '@/app/stores/store.ts';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import DeleteButtonAtom from "@/app/common/form/DeleteButtonAtom.tsx";
import {CgFileDocument} from "react-icons/cg";
import {Link} from "react-router-dom";

const CourtClusterTableComponent = observer(() => {
  const { courtStore } = useStore();
  const { courtArray, loading, loadingInitial } = courtStore;
  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th>STT</Th>
              <Th>Ảnh</Th>
              <Th>Tên sân</Th>
              <Th>Địa chỉ</Th>
              <Th>Giờ mở cửa</Th>
              <Th>Số sân</Th>
              <Th>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && <SkeletonTableAtoms numOfColumn={6} pageSize={7} />}
            {courtArray.map((court, index) => (
              <Tr key={court.id}>
                <Td>{index + 1}</Td>
                <Td>
                  <LazyImageAtom
                    src={court.image?.[0]}
                    alt={court.title}
                    width="10rem"
                    height="8rem"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Td>
                <Td>{court.title}</Td>
                <Td>{court.address}</Td>
                <Td>
                  {court.openTime} - {court.closeTime}
                </Td>
                <Td>{court.numbOfCourts}</Td>
                <Td>
                  <Flex className={'items-center gap-2.5 flex-row'}>
                      <Tooltip hasArrow placement='top' label="Xem chi tiết" bg="gray.300" color="black">
                        <IconButton
                            as={Link}
                            to={`/cum-san/chi-tiet/${court.id}`}
                            icon={<CgFileDocument className="text-white text-lg" />}
                            size={'sm'}
                            colorScheme="blue"
                            aria-label={'Details'}
                        />
                      </Tooltip>
                      <DeleteButtonAtom name={court.title} header={"Cụm sân"}  loading={loading} onDelete={ async () =>{}} />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {courtArray.length === 0 && !loadingInitial && !loading && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách rỗng
        </Box>
      )}
    </>
  );
});

export default CourtClusterTableComponent;
