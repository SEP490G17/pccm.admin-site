import {
  ScheduleComponent,
  Week,
  Inject,
  ViewsDirective,
  ViewDirective,
  EventFieldsMapping,
  ResourceDirective,
  ResourcesDirective,
} from '@syncfusion/ej2-react-schedule';
import BookingEditorTemplateComponent from './components/BookingEditorTemplateComponent';
import { useEffect, useRef } from 'react';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import BookingListComponent from './components/BookingListComponent';
import { Heading, useToast } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
interface IProps {
  courtClusterId: number;
}
const CourtClusterBookingTab = observer(({ courtClusterId }: IProps) => {
  const toast = useToast();
  const fields = {
    subject: {
      name: 'Subject',
      validation: { required: true, minLength: 10, number: true },
      default: '0865869202',
    },
    startTime: { name: 'StartTime', validation: { required: true } },
    endTime: { name: 'EndTime', validation: { required: true } },
    courtId: { name: 'courtId', validation: { required: true } },
  };
  const { courtClusterStore } = useStore();
  const { courtOfClusterArray, loadCourtOfCluster, loadingCourt } = courtClusterStore;
 
  const courts = [
    { courtId: 1, courtName: 'Sân 1' },
    { courtId: 2, courtName: 'Sân 2' },
    { courtId: 3, courtName: 'Sân 3' },
  ];
  useEffect(() => {
    loadCourtOfCluster(courtClusterId);
  },[courtClusterId]);


 
  const group = { resources: ['courts'] };
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
      console.log(args.data);

      if (schedule.current) {
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        const eventField: EventFieldsMapping = schedule.current.eventFields!;
        const startDate = eventData[eventField.startTime!];
        const endDate = eventData[eventField.endTime!];
        if (startDate < currentTime) {
          args.cancel = true; // Huỷ nếu thời gian bắt đầu nằm trong quá khứ
          toast({
            title: 'Đặt lịch thất bại',
            description: 'Không thể chỉnh sửa hoặc tạo sự kiện trong thời gian quá khứ',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
        if (!schedule.current.isSlotAvailable(startDate, endDate)) {
          args.cancel = true; // Huỷ nếu slot không khả dụng
          toast({
            title: 'Đặt lịch thất bại',
            description: 'Slot đã được đặt hoặc bị trùng với lịch trước đó',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
        const minEndDate = dayjs(startDate).add(1, 'hour');
        if (dayjs(endDate).isBefore(minEndDate)) {
          args.cancel = true;
          toast({
            title: 'Đặt lịch thất bại',
            description: 'Thời gian đặt lịch phải lơn hơn hoặc bằng 1 tiêng',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
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
  const handleEventRendered = (args: any) => {
    const paymentStatus = args.data.paymentStatus;

    // Apply color class based on paymentStatus
    if (paymentStatus === 'paid') {
      args.element.classList.add('paid-event');
    } else if (paymentStatus === 'pending') {
      args.element.classList.add('pending-event');
    } else if (paymentStatus === 'unpaid') {
      args.element.classList.add('unpaid-event');
    }
  };
  if(loadingCourt || !courtOfClusterArray){
    return <div>Loading...</div>
  }

  console.log('store',courtOfClusterArray);
  console.log('mock',courts);
  return (
    <>
      <Heading size={'lg'} className="my-4">
        Lịch đặt
      </Heading>
      <ScheduleComponent
        ref={schedule}
        group={group}
        timeFormat="HH:mm"
        timeScale={{ enable: true, interval: 60, slotCount: 1 }}
        workHours={{ highlight: true, start: '05:00', end: '22:00' }}
        startHour="05:00"
        endHour="23:00"
        timezone="Asia/Bangkok"
        editorTemplate={BookingEditorTemplateComponent}
        cssClass="schedule-cell-dimension"
        eventRendered={handleEventRendered}
        eventSettings={{
          fields: fields,
          dataSource: [
            {
              Subject: '0865869202',
              StartTime: '2024-11-07T01:00:00.000Z',
              EndTime: '2024-11-07T02:00:00.000Z',
              courtId: 1,
              courtClusterId: 1,
              RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;UNTIL=20241206T161902Z;',
              paymentStatus: 'pending',
            },
            {
              Subject: '0865869202',
              StartTime: '2024-11-07T02:00:00.000Z',
              EndTime: '2024-11-07T03:00:00.000Z',
              courtId: 1,
              RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;UNTIL=20250106T000649Z;',
              paymentStatus: 'paid',
            },
          ],
        }}
        rowAutoHeight={true}
        quickInfoOnSelectionEnd={true}
        actionBegin={handleActionBegin} // Đảm bảo hàm hành động
        renderCell={handleRenderCell}
        enableAdaptiveUI={true}
      >
        <ViewsDirective>
          <ViewDirective option="Week" dateFormat="dd-MMM-yyyy" />
        </ViewsDirective>
        <ResourcesDirective>
          <ResourceDirective
            field="courtId"
            title="Sân"
            name="courts"
            allowMultiple={true}
            dataSource={courtClusterStore.courtOfClusterArray
              
            }
            textField="courtName"
            idField="courtId"
          ></ResourceDirective>
        </ResourcesDirective>
        <Inject services={[Week]} />
      </ScheduleComponent>
      <BookingListComponent />
    </>
  );
});

export default CourtClusterBookingTab;
