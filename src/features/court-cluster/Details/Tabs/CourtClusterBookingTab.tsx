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
import { useEffect, useRef } from 'react';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { Heading, Skeleton, useToast } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
import { BookingCreate } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import BookingEditorTemplateComponent from '../components/BookingTab/BookingEditorTemplateComponent';
import BookingListComponent from '../components/BookingTab/BookingListComponent';
interface IProps {
  courtClusterId: number;
}
const CourtClusterBookingTab = observer(({ courtClusterId }: IProps) => {
  const toast = useToast();
  const fields = {
    phoneNumber: {
      name: 'phoneNumber',
      validation: { required: true, minLength: 10, number: true },
    },
    startTime: { name: 'startTime', validation: { required: true } },
    endTime: { name: 'endTime', validation: { required: true } },
    courtId: { name: 'courtId', validation: { required: true } },
    recurrence: { name: 'recurrence', validation: { required: true } },
    fullName: { name: 'fullName', validation: { required: true } },
  };
  const { courtClusterStore, bookingClusterStore: bookingStore } = useStore();
  const {
    courtOfClusterArray,
    loadCourtOfCluster,
    loadingInitialBookingPage,
    setLoadingInitialBookingPage,
  } = courtClusterStore;
  const {
    bookingScheduleArray: bookingArray,
    createBooking,
    courtPrice,
    clearBookingForSchedule,
  } = bookingStore;
  useEffect(() => {
    setLoadingInitialBookingPage(true);
    bookingStore.clearBookingForSchedule();
    Promise.all([
      bookingStore.loadCourtPrice(courtClusterId),
      loadCourtOfCluster(courtClusterId, toast),
      bookingStore.loadBookingForSchedule(toast),
    ]).then(() => setLoadingInitialBookingPage(false));
  }, [
    courtClusterId,
    bookingStore,
    loadCourtOfCluster,
    setLoadingInitialBookingPage,
    toast,
    clearBookingForSchedule,
  ]);

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
        if (args.data[0].recurrence) {
          switch (args.data[0].recurrence) {
            case 1: {
              const until = dayjs(endDate).add(1, 'month').format('YYYYMMDDTHHmmss[Z]');
              args.data[0].RecurrenceRule = `FREQ=DAILY;INTERVAL=1;UNTIL=${until.toString()};`;
              const untilSave = dayjs(endDate).add(1, 'month').format('YYYY-MM-DDTHH:mm:ss[Z]');
              args.data[0].untilTime = untilSave.toString();
              break;
            }
            case 2: {
              const until = dayjs(endDate).add(3, 'month').format('YYYYMMDDTHHmmss[Z]');
              args.data[0].RecurrenceRule = `FREQ=DAILY;INTERVAL=1;UNTIL=${until.toString()};`;
              const untilSave = dayjs(endDate).add(3, 'month').format('YYYY-MM-DDTHH:mm:ss[Z]');
              args.data[0].untilTime = untilSave.toString();
              break;
            }
            case 3: {
              const until = dayjs(endDate).add(12, 'month').format('YYYYMMDDTHHmmss[Z]');
              args.data[0].RecurrenceRule = `FREQ=DAILY;INTERVAL=1;UNTIL=${until.toString()};`;
              const untilSave = dayjs(endDate).add(12, 'month').format('YYYY-MM-DDTHH:mm:ss[Z]');
              args.data[0].untilTime = untilSave.toString();
              break;
            }
          }
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

        const pendingToast = toast({
          title: 'Đang sư lý',
          description: 'Đợi một chút',
          status: 'loading',
        });
        await createBooking(bookingPost)
          .then(() => {
            toast.close(pendingToast);
            toast({
              title: 'Đặt lịch thành công',
              description: 'Lịch đã được đặt thành công',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          })
          .catch(() => {
            toast({
              title: 'Đặt lịch thất bại',
              description: 'Đã xảy ra l��i khi đặt lịch',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            args.cancel = true;
          });
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
    <Skeleton isLoaded={!loadingInitialBookingPage} minHeight={'300rem'}>
      <Heading size={'lg'} className="my-4">
        Lịch đặt
      </Heading>

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
              prices={courtPrice}
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
      <BookingListComponent />
    </Skeleton>
  );
});

export default CourtClusterBookingTab;
