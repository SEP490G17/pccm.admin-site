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
import {  useRef } from 'react';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { useToast } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
import { BookingCreate } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import BookingEditorTemplateComponent from '../components/BookingTab/BookingEditorTemplateComponent';

const ScheduleCustomComponent = observer(() => {
  const toast = useToast();
  const fields = {
    phoneNumber: {
      name: 'phoneNumber',
      validation: { required: true, minLength: 10, number: true },
    },
    startTime: { name: 'startTime', validation: { required: true } },
    endTime: { name: 'endTime', validation: { required: true } },
    courtId: { name: 'courtId', validation: { required: true } },
    fullName: { name: 'fullName', validation: { required: true } },
  };
  const { courtClusterStore, bookingClusterStore: bookingStore } = useStore();
  const {
    courtOfClusterArray,
    loadingInitialBookingPage,
  } = courtClusterStore;
  const {
    bookingScheduleArray: bookingArray,
    createBooking,
  } = bookingStore;
 

  const group = { resources: ['courts'] };
  const schedule = useRef<ScheduleComponent>(null);
  L10n.load({
    'en-US': {
      schedule: {
        cancelButton: 'Đóng',
        deleteButton: 'Huỷ lịch',
        newEvent: 'Đặt lịch chơi',
        saveButton: 'Lưu',
      },
    },
  });
  const handleActionBegin = async (args: any) => {
    const currentTime = new Date();
    if (
      (args.requestType === 'eventCreate' || args.requestType === 'eventChange') &&
      args.data &&
      ((Array.isArray(args.data) && args.data.length > 0) || !isNullOrUndefined(args.data))
    ) {
      if (schedule.current) {
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        const eventField: EventFieldsMapping = schedule.current.eventFields;
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
        args.data[0].paymentStatus = 'pending';
        const bookingPost: BookingCreate = {
          FullName: eventData.fullName,
          CourtId: eventData.courtId,
          StartTime: eventData.startTime,
          EndTime: eventData.endTime,
          PhoneNumber: eventData.phoneNumber,
          RecurrenceRule: eventData.RecurrenceRule ?? '',
          UntilTime: eventData.untilTime ?? null,
        };

        args.cancel = true;

        await createBooking(bookingPost, toast);
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
    const isComplete = args.data.isSuccess;
    // Apply color class based on paymentStatus
    if (Number(paymentStatus) == PaymentStatus.Pending) {
      args.element.classList.add('pending-payment');
    }

    if (isComplete) {
      args.element.classList.add('booking-complete');
    }
  };

  const handleNavigation = async (args: any) => {
    if (args.action === 'date') {
      // Lấy ngày hiện tại trên lịch
      const selectedDate = args.currentDate;
      await bookingStore.loadBookingForSchedule(toast, selectedDate);
    }
  };

  return (
    <>
      {!loadingInitialBookingPage && (
        <ScheduleComponent
          ref={schedule}
          group={group}
          timeFormat="HH:mm"
          timeScale={{ enable: true, interval: 60, slotCount: 1 }}
          workHours={{ highlight: true, start: '05:00', end: '22:00' }}
          startHour="05:00"
          endHour="23:00"
          showQuickInfo={false}
          timezone="Asia/Bangkok"
          editorTemplate={(props: any) => (
            <BookingEditorTemplateComponent
              {...props}
              courtOfClusterArray={courtOfClusterArray} // Truyền dataSource vào editor template
            />
          )}
          cssClass="schedule-cell-dimension"
          eventRendered={handleEventRendered}
          eventSettings={{
            fields: fields,
            dataSource: bookingArray,
          }}
          rowAutoHeight={true}
          quickInfoOnSelectionEnd={true}
          actionBegin={async (prop: any) => await handleActionBegin(prop)} // Đảm bảo hàm hành động
          renderCell={handleRenderCell}
          enableAdaptiveUI={true}
          navigating={async (args: any) => await handleNavigation(args)}
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
              dataSource={courtClusterStore.courtOfClusterArray}
              textField="courtName"
              idField="courtId"
            ></ResourceDirective>
          </ResourcesDirective>
          <Inject services={[Week]} />
        </ScheduleComponent>
      )}
    </>
  );
});

export default ScheduleCustomComponent;
