import {
  Box,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
import { CourtPriceBooking } from '@/app/models/booking.model';
import { useState } from 'react';

const BookingEditorTemplateComponent = observer((props: any) => {
  const { courtClusterStore } = useStore();

  const court = courtClusterStore.courtOfClusterArray.map((c) => {
    return {
      courtId: c.courtId,
      courtName: c.courtName,
    };
  });

  const [selectedCourtId, setSelectedCourtId] = useState(court[0].courtId);

  const filteredPrices = props.prices.filter(
    (price: CourtPriceBooking) => price.courtId === selectedCourtId,
  );

  const recurrence = [
    {
      value: 0,
      label: 'Không',
    },
    {
      value: 1,
      label: 'Gói 1 tháng',
    },
    {
      value: 2,
      label: 'Gói 1 quý',
    },
    {
      value: 3,
      label: 'Gói 1 năm',
    },
  ];
  return (
    <>
      <Grid templateColumns={'repeat(8,1fr)'} columnGap={5} rowGap={8} className="mt-4">
        <GridItem colSpan={4} className="w-full">
          <label>Họ và tên:</label>
          <input
            name="fullName"
            id="fullName"
            className=" e-field w-full e-input "
            data-name="fullName"
            required
          />
        </GridItem>
        <GridItem colSpan={4} className="w-full">
          <label>Số điện thoại:</label>
          <input
            name="phoneNumber" // Phải khớp với fields.phoneNumber.name
            id="phoneNumber"
            className="e-field e-input w-full" // Phải có class "e-field"
            data-name="phoneNumber"
            type="number"
            min={0}
            minLength={10}
            required
            pattern="[0-9]*"
          />
        </GridItem>

        <GridItem colSpan={4}>
          <label id="label_StartTime" htmlFor="StartTime">
            Từ:
          </label>
          <DateTimePickerComponent
            id="startTime"
            format="dd/MM/yy hh:mm a"
            name="startTime"
            className="e-start e-field e-control e-datetimepicker e-lib e-keyboard"
            aria-labelledby="label_StartTime"
            step={30}
          ></DateTimePickerComponent>
        </GridItem>

        <GridItem colSpan={4}>
          <label id="label_EndTime" htmlFor="EndTime">
            Đến:
          </label>
          <DateTimePickerComponent
            id="endTime"
            format="dd/MM/yy hh:mm a"
            name="endTime"
            className=" e-field e-end"
            aria-labelledby="label_EndTime"
            step={30}
          ></DateTimePickerComponent>
        </GridItem>
        {props.courtId && (
          <GridItem colSpan={4}>
            <label>Chọn sân</label>
            <DropDownListComponent
              id="courtId"
              name="courtId"
              value={props.courtId}
              dataSource={court}
              fields={{ text: 'courtName', value: 'courtId' }}
              placeholder="Chọn Sân"
              className="e-field"
              onChange={(e: any) => setSelectedCourtId(e.value)}
            />
          </GridItem>
        )}
        <GridItem colSpan={4}>
          <label>Gói combo: </label>
          <DropDownListComponent
            id="recurrence"
            name="recurrence"
            value={0}
            dataSource={recurrence}
            fields={{ text: 'label', value: 'value' }}
            placeholder="Chọn gói combo"
            className="e-field"
          />
        </GridItem>
      </Grid>
      <Box mt={4}>
        <Box mt={4}>
          <label>Giá tiền: </label>
          <TableContainer height="130px" maxHeight="130px" overflowY="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th width={'50%'}>Khung giờ</Th>
                  <Th width={'50%'}>Giá tiền</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPrices &&
                  filteredPrices.map((price: CourtPriceBooking) => (
                    <Tr key={`${price.courtId}-${price.time}`}>
                      <Td>{price.time}</Td>
                      <Td>
                        {price.price.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
});

export default BookingEditorTemplateComponent;
