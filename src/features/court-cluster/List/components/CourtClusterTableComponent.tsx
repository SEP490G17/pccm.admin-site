import { observer } from 'mobx-react-lite';
import {
  Box,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms.tsx';
import { useStore } from '@/app/stores/store.ts';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom.tsx';
import { CgFileDocument } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const CourtClusterTableComponent = observer(() => {
  const { courtClusterStore } = useStore();
  const { courtClusterArray, loading, loadingInitial, deleteCourtCluster, visibleToggle } =
    courtClusterStore;
  const toast = useToast();
  const handleDelete = async (id: number) => {
    await deleteCourtCluster(id, toast);
  };

  const handleVisible = async (id: number, isVisible: boolean) => {
    await visibleToggle(id, isVisible, toast);
  };
  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th w={'5rem'}>STT</Th>
              <Th w={'11rem'}>Ảnh</Th>
              <Th w={'8rem'}>Tên sân</Th>
              <Th w={'15rem'}>Địa chỉ</Th>
              <Th w={'10rem'}>Giờ mở cửa</Th>
              <Th w={'5rem'}>Số sân</Th>
              <Th w={'14rem'}>Trạng thái</Th>
              <Th w={'12rem'}>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && <SkeletonTableAtoms numOfColumn={7} pageSize={7} />}
            {courtClusterArray.map((courtCluster, index) => {
              const addressParts = [
                courtCluster.address,
                courtCluster.wardName,
                courtCluster.districtName,
                courtCluster.provinceName,
              ];

              const filteredParts = addressParts.filter((part) => part && part.trim() !== '');

              const fullAddress = filteredParts.join(', ');
              return (
                <Tr key={courtCluster.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <LazyImageAtom
                      src={courtCluster.images?.[0]}
                      alt={courtCluster.title}
                      width="10rem"
                      height="6rem"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Td>
                  <Td>{courtCluster.title}</Td>
                  <Td>{fullAddress}</Td>
                  <Td>
                    {courtCluster.openTime} - {courtCluster.closeTime}
                  </Td>

                  <Td>{courtCluster.numbOfCourts}</Td>
                  <Td>
                    <Tag
                      size="lg"
                      colorScheme={courtCluster.isVisible ? 'blue' : 'red'}
                      className="w-36"
                    >
                      <TagLabel className='text-center'>{courtCluster.isVisible ? 'Hiển thị' : 'Không hiển thị'}</TagLabel>
                    </Tag>
                  </Td>
                  <Td>
                    <Flex className={'items-center gap-2.5 flex-row'}>
                      <Tooltip
                        hasArrow
                        placement="top"
                        label={courtCluster.isVisible ? 'Tắt hiển thị' : 'Hiển thị'}
                        bg="gray.300"
                        color="black"
                      >
                        <IconButton
                          as={Link}
                          className="w-12"
                          icon={
                            courtCluster.isVisible ? (
                              <FaRegEyeSlash className="text-xl" />
                            ) : (
                              <FaRegEye className="text-xl" />
                            )
                          }
                          size={'md'}
                          colorScheme={courtCluster.isVisible ? 'gray' : 'teal'}
                          aria-label={'Details'}
                          onClick={() => handleVisible(courtCluster.id, courtCluster.isVisible)}
                        />
                      </Tooltip>

                      <Tooltip
                        hasArrow
                        placement="top"
                        label="Xem chi tiết"
                        bg="gray.300"
                        color="black"
                      >
                        <IconButton
                          as={Link}
                          className="w-12"
                          to={`/cum-san/${courtCluster.id}/chi-tiet`}
                          icon={<CgFileDocument className="text-white text-lg" />}
                          size={'md'}
                          colorScheme="blue"
                          aria-label={'Details'}
                        />
                      </Tooltip>
                      <DeleteButtonAtom
                        className="w-12"
                        buttonSize="md"
                        name={courtCluster.title}
                        header={'Cụm sân'}
                        loading={loading}
                        onDelete={async () => {
                          await handleDelete(courtCluster.id);
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {courtClusterArray.length === 0 && !loadingInitial && !loading && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách rỗng
        </Box>
      )}
    </>
  );
});

export default CourtClusterTableComponent;
