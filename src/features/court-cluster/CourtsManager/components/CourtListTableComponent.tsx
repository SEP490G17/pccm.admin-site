import { CourtForTable, CourtStatus } from '@/app/models/court.model';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
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
  useToast,
} from '@chakra-ui/react';
import { FC } from 'react';
import { MdDelete } from 'react-icons/md';
import CourtPricePopup from '../popup/CourtPricePopup';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';
import CourtComboPopup from '../popup/CourtComboPopup';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';

interface CourtListTableComponentProps {
  courtList: CourtForTable[];
  loadingInitial: boolean;
  pageSize: number;
  openTime: string;
  closeTime: string;
}

const CourtListTableComponent: FC<CourtListTableComponentProps> = observer(
  ({ courtList, loadingInitial, pageSize }) => {
    const { courtManagerStore } = useStore();
    const { removeCourt, toggleCourtStatus, closeTime, openTime } = courtManagerStore;
    const toast = useToast();
    const handleDeleteCourt = async (courtId: number) => {
      await removeCourt(courtId, toast);
    };
    const handleToggleCourt = async (courtId: number) => {
      await toggleCourtStatus(courtId, toast);
    };
    return (
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'15rem'}>Tên sân</Th>
              <Th w={'15rem'}>Giá nhỏ nhất</Th>
              <Th w={'15rem'}>Giá lớn nhất</Th>
              <Th w={'15rem'}>Trạng thái</Th>
              <Th w={'10rem'}>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && <SkeletonTableAtoms numOfColumn={5} pageSize={pageSize} />}

            {!loadingInitial &&
              courtList.map((court, index) => (
                <Tr key={court.courtId}>
                  <Td>{index + 1}</Td>

                  <Td>{court.courtName}</Td>

                  <Td>
                    {court.minPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Td>

                  <Td>
                    {court.maxPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Td>

                  <Td>
                    <Switch
                      isChecked={court.status === CourtStatus.Available}
                      onChange={async () => await handleToggleCourt(court.courtId)}
                    />
                  </Td>

                  <Td>
                    <Flex gap={2}>
                      <CourtPricePopup
                        closeTime={closeTime}
                        openTime={openTime}
                        courtId={court.courtId}
                        courtPrices={court.courtPrices}
                      />
                      <CourtComboPopup courtId={court.courtId} courtCombos={court.courtCombos} />

                      <DeleteButtonAtom
                        buttonSize="sm"
                        name={`${court.courtName}`}
                        onDelete={async () => await handleDeleteCourt(court.courtId)}
                      ></DeleteButtonAtom>
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  },
);

export default CourtListTableComponent;
