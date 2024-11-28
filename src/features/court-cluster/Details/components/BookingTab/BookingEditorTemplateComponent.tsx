import {
  Box,
  Grid,
  GridItem,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { CourtPrice } from '@/app/models/court.model';
import dayjs from 'dayjs';

const BookingEditorTemplateComponent = observer((props: any) => {
  if(props.courtOfClusterArray !== undefined && props.courtOfClusterArray?.[0] !== undefined  ) {

    const court = props.courtOfClusterArray.map((c) => {
      return {
        courtId: c.courtId,
        courtName: c.courtName,
      };
    });
    const [selectedCourtId, setSelectedCourtId] = useState(props.courtOfClusterArray?.[0].courtId || 0);
  
    const filteredPrices =
      props.courtOfClusterArray.find((c) => c.courtId == selectedCourtId)?.courtPrices ?? [];
    const [selectedStart, setSelectedStart] = useState(props.playStart);
    const [selectedEnd, setSelectedEnd] = useState(props.playEnd);
  
    const calculatePrice = (): number => {
      const start = dayjs(`1970-01-01T${selectedStart}:00`);
      const end = dayjs(`1970-01-01T${selectedEnd}:00`);
  
      let totalPrice = 0;
      if (!filteredPrices) return 0;
      filteredPrices.forEach(({ fromTime, toTime, price }: any) => {
        const priceStart = dayjs(`1970-01-01T${fromTime}`);
        const priceEnd = dayjs(`1970-01-01T${toTime}`);
  
        // Tìm thời điểm giao nhau
        const overlapStart = start.isAfter(priceStart) ? start : priceStart;
        const overlapEnd = end.isBefore(priceEnd) ? end : priceEnd;
  
        if (overlapStart.isBefore(overlapEnd)) {
          const overlapDuration = overlapEnd.diff(overlapStart, 'minute') / 60; // Số giờ giao nhau
          totalPrice += overlapDuration * price;
        }
      });
  
      return Math.ceil(totalPrice);
    };
    return (
      <>
        <Grid templateColumns={'repeat(8,1fr)'} columnGap={5} rowGap={8} className="mt-4">
          <GridItem colSpan={4} className="w-full">
            <label id="label_fullName" htmlFor="fullName">
              Họ và tên:
            </label>
  
            <Input
              name="fullName"
              id="fullName"
              variant="unstyled"
              className=" e-field w-full e-input "
              data-name="fullName"
              required
            />
          </GridItem>
          <GridItem colSpan={4} className="w-full">
            <label id="label_phoneNumber" htmlFor="phoneNumber">
              Số điện thoại:
            </label>
            <Input
              variant={'unstyled'}
              name="phoneNumber"
              id="phoneNumber"
              type="number"
              className="e-field e-input w-full"
              data-name="phoneNumber"
              minLength={10}
            />
          </GridItem>
          {props.courtId && (
            <GridItem colSpan={8}>
              <label id="label_courtId" htmlFor="courtId">
                Chọn sân
              </label>
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
  
          <GridItem colSpan={8}>
            <label id="label_SelectedDate" htmlFor="selectedDate">
              Ngày
            </label>
            <Input
              required={true}
              size="sm"
              type="date"
              variant="unstyled"
              id="selectedDate"
              name="selectedDate"
              className=" e-field e-control e-lib e-keyboard e-input"
            />
          </GridItem>
          <GridItem colSpan={4}>
            <Text>Từ:</Text>
  
            <Input
              required={true}
              type="time"
              size={'sm'}
              id="playStart"
              variant="unstyled"
              name="playStart"
              className="e-field e-control e-lib e-keyboard e-input"
              aria-labelledby="label_playStart"
              onChange={(e) => {
                setSelectedStart(e.target.value);
              }}
            />
          </GridItem>
  
          <GridItem colSpan={4}>
            <label id="label_playEnd" htmlFor="playEnd">
              Đến:
            </label>
            <Input
              required={true}
              type="time"
              id="playEnd"
              size={'sm'}
              variant="unstyled"
              name="playEnd"
              className="e-field e-control e-lib e-keyboard e-input"
              aria-labelledby="label_playEnd"
              onChange={(e) => {
                setSelectedEnd(e.target.value);
              }}
            />
          </GridItem>
  
          <GridItem colSpan={8} className="hidden">
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
                  {filteredPrices?.map((price: CourtPrice) => (
                    <Tr key={`${price.toTime}`}>
                      <Td>
                        {price.fromTime.slice(0, 5)} - {price.toTime.slice(0, 5)}
                      </Td>
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
          <GridItem colSpan={8}>
            <Heading gap={1} size={'sm'}>
              Tổng giá: {calculatePrice().toLocaleString('vn')} VND
            </Heading>
          </GridItem>
        </Box>
      </>
    );
  }
});

export default BookingEditorTemplateComponent;
