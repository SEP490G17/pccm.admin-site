import { Grid, GridItem } from '@chakra-ui/react';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

const BookingEditorTemplateComponent = () => {
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

        <GridItem colSpan={8}>
          <RecurrenceEditorComponent  />
        </GridItem>
      </Grid>
    </>
  );
};

export default BookingEditorTemplateComponent;
