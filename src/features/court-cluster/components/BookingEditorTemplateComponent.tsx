import { Grid, GridItem } from '@chakra-ui/react';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
interface Court {
  courtId: number;
  courtName: string;
}



const BookingEditorTemplateComponent = (props:any) => {
  const courts: { courtId: number; courtName: string }[] = [
    { courtId: 1, courtName: 'Sân 1' },
    { courtId: 2, courtName: 'Sân 2' },
    { courtId: 3, courtName: 'Sân 3' },
  ];
  console.log(props);
  return (
    <>
      <Grid templateColumns={'repeat(8,1fr)'} columnGap={5} rowGap={8} className="mt-4">
        <GridItem colSpan={8} className="relative w-full">
          <TextBoxComponent
            name="Subject" // Khớp với trường trong fields
            id="Subject"
            className="e-subject e-field w-full"
            aria-labelledby="label_Subject"
          />
          <label
            className="e-float-text relative "
            style={{ top: '-1.8rem' }}
            htmlFor="Subject"
            id="label_Subject"
          >
            Phone Number
          </label>
        </GridItem>

        <GridItem colSpan={4} className="relative">
          <DateTimePickerComponent
            id="StartTime"
            format="dd/MM/yy hh:mm a"
            name="StartTime"
            className="e-start e-field e-control e-datetimepicker e-lib e-keyboard"
            aria-labelledby="label_StartTime"
            step={30}
          ></DateTimePickerComponent>
          <label
            className="e-float-text relative e-label-top"
            id="label_StartTime"
            htmlFor="StartTime"
            style={{ top: '-1.8rem' }}
          >
            Start Time
          </label>
        </GridItem>

        <GridItem colSpan={4} className="relative">
          <DateTimePickerComponent
            id="EndTime"
            format="dd/MM/yy hh:mm a"
            name="EndTime"
            className=" e-field e-end"
            aria-labelledby="label_EndTime"
            step={30}
          ></DateTimePickerComponent>
          <label
            className="e-float-text relative e-label-top"
            id="label_EndTime"
            htmlFor="EndTime"
            style={{ top: '-1.8rem' }}
          >
            End Time
          </label>
        </GridItem>
        {props.courtId && (
          <GridItem colSpan={8} className="relative">
            <DropDownListComponent
              id="courtId"
              name="courtId"
              value={props.courtId}
              dataSource={courts}
              fields={{ text: 'courtName', value: 'courtId' }}
              placeholder="Chọn Sân"
              className="e-field"
            />
            <label
              className="e-float-text relative"
              style={{ top: '-1.8rem' }}
              htmlFor="courtId"
              id="label_courtId"
            >
              Court
            </label>
          </GridItem>
        )}
        <GridItem colSpan={8}>
          <RecurrenceEditorComponent />
        </GridItem>
      </Grid>
    </>
  );
};

export default BookingEditorTemplateComponent;
