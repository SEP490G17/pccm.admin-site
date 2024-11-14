import { Grid, GridItem} from '@chakra-ui/react';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';

const BookingEditorTemplateComponent = observer((props: any) => {
  const { courtClusterStore } = useStore();
  const court = courtClusterStore.courtOfClusterArray.map((c) => {
    return {
      courtId: c.courtId,
      courtName: c.courtName,
    };
  });

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
          <TextBoxComponent
            name="fullName" // Khớp với trường trong fields
            id="fullName"
            className=" e-field w-full "
          />
        </GridItem>
        <GridItem colSpan={4} className="w-full">
          <label>Số điện thoại:</label>
          <TextBoxComponent
            name="phoneNumber" // Khớp với trường trong fields
            id="phoneNumber"
            className="e-field w-full e-phoneNumber"
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
            />
          </GridItem>
        )}
        <GridItem colSpan={4}>
          <label>Gói combo: </label>
          <div defaultValue="0" className="flex flex-row mt-2 gap-5">
            <DropDownListComponent
              id="recurrence"
              name="recurrence"
              value={0}
              dataSource={recurrence}
              fields={{ text: 'label', value: 'value' }}
              placeholder="Chọn gói combo"
              className="e-field"
            />
          </div>
        </GridItem>
      </Grid>
    </>
  );
});

export default BookingEditorTemplateComponent;