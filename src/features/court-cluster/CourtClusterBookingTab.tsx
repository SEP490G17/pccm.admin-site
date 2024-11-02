import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Inject,
  ViewsDirective,
  ViewDirective,
  TimelineViews,
  EventFieldsMapping,
} from '@syncfusion/ej2-react-schedule';
import BookingEditorTemplateComponent from './components/BookingEditorTemplateComponent';
import { useRef } from 'react';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { toast } from 'react-toastify';
import BookingListComponent from './components/BookingListComponent';
import { Heading } from '@chakra-ui/react';

const CourtClusterBookingTab = () => {
  const fields = {
    subject: {
      name: 'Subject',
      validation: { required: true, minLength: 10, number: true },
      default: '0865869202',
    },
    startTime: { name: 'StartTime', validation: { required: true } },
    endTime: { name: 'EndTime', validation: { required: true } },
  };

  const schedule = useRef<ScheduleComponent>(null);
  L10n.load({
    'en-US': {
      schedule: {
        cancelButton: 'Close',
        deleteButton: 'Cancel Booking',
        newEvent: 'Create New Booking',
      },
    },
  });
  const handleActionBegin = (args: any) => {
    const currentTime = new Date();
    if (
      (args.requestType === 'eventCreate' || args.requestType === 'eventChange') &&
      args.data &&
      ((Array.isArray(args.data) && args.data.length > 0) || !isNullOrUndefined(args.data))
    ) {
      if (schedule.current) {
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        const eventField: EventFieldsMapping = schedule.current.eventFields!;
        const startDate = eventData[eventField.startTime!];
        const endDate = eventData[eventField.endTime!];
        if (startDate < currentTime) {
          args.cancel = true; // Huỷ nếu thời gian bắt đầu nằm trong quá khứ
          toast.error('Không thể chỉnh sửa hoặc tạo sự kiện trong thời gian quá khứ');
        }
        if (!schedule.current.isSlotAvailable(startDate, endDate)) {
          args.cancel = true; // Huỷ nếu slot không khả dụng
          toast.error('Slot đã được đặt hoặc bị trùng với lịch trước đó');
        }
      }
    }
  };
  const handleRenderCell = (args: any) => {
    const currentTime = new Date();

    if (args.elementType === 'workCells' || args.elementType === 'monthCells') {
      const cellStartTime = args.date;

      // Nếu thời gian ô là trong quá khứ, thay đổi màu nền và vô hiệu hóa click
      if (cellStartTime < currentTime) {
        args.element.classList.add('e-past-time-slot');
        args.element.style.pointerEvents = 'none';
      }
    }
  };
  return (
    <>
      <Heading size={'lg'} className='my-4'>Lịch đặt</Heading>
      <ScheduleComponent
        ref={schedule}
        timeFormat="HH:mm"
        timeScale={{ enable: true, interval: 60, slotCount: 1 }}
        workHours={{ highlight: true, start: '05:00', end: '22:00' }}
        startHour="05:00"
        endHour="23:00"
        timezone="Asia/Bangkok"
        editorTemplate={BookingEditorTemplateComponent}
        cssClass="schedule-cell-dimension"
        eventSettings={{ fields: fields }}
        rowAutoHeight={true}
        quickInfoOnSelectionEnd={true}
        actionBegin={handleActionBegin} // Đảm bảo hàm hành động
        renderCell={handleRenderCell}
      >
        <ViewsDirective>
          <ViewDirective option="Week" dateFormat="dd-MMM-yyyy" />
          <ViewDirective option="TimelineDay" />
        </ViewsDirective>
        <Inject services={[Day, TimelineViews, Week, WorkWeek]} />
      </ScheduleComponent>
      <BookingListComponent />
    </>
  );
};

export default CourtClusterBookingTab;
