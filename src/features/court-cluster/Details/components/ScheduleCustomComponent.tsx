import {
  ScheduleComponent,
  Week,
  Inject,
  ViewsDirective,
  ViewDirective,
  ResourceDirective,
  ResourcesDirective,
} from '@syncfusion/ej2-react-schedule';
import { useRef, useState } from 'react';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { useToast } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';
import { BookingByDay } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import BookingEditorTemplateComponent from '../components/BookingTab/BookingEditorTemplateComponent';
import { CourtCluster } from '@/app/models/court.model';
import { router } from '@/app/router/Routes';

interface IProps {
  courtClusterId: number;
  selectedCourtCluster: CourtCluster;
}
const ScheduleCustomComponent = observer(({ selectedCourtCluster }: IProps) => {
  const toast = useToast();
  const fields = {
    phoneNumber: {
      name: 'phoneNumber',
    },
    startTime: { name: 'startTime', validation: { required: true } },
    endTime: { name: 'endTime', validation: { required: true } },
    courtId: { name: 'courtId', validation: { required: true } },
    fullName: { name: 'fullName', validation: { required: true } },
    selectedDate: { name: 'selectedDate', validation: { required: true } },
    playStart: { name: 'playStart', validation: { required: true } },
    playEnd: { name: 'playEnd', validation: { required: true } },
  };
  const { courtClusterStore, bookingClusterStore } = useStore();
  const { loadingInitialBookingPage } = courtClusterStore;
  const { bookingScheduleArray, createBooking } = bookingClusterStore;

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
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [playStart, setPlayStart] = useState<any>(null);
  const [playEnd, setPlayEnd] = useState<any>(null);

  const handleActionBegin = async (args: any) => {
    const currentTime = new Date();
    if (
      (args.requestType === 'eventCreate' || args.requestType === 'eventChange') &&
      args.data &&
      ((Array.isArray(args.data) && args.data.length > 0) || !isNullOrUndefined(args.data))
    ) {
      if (schedule.current) {
        const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
        const selectedDate = eventData.selectedDate;
        const playEnd = eventData.playEnd;
        const playStart = eventData.playStart;
        const minEndDate = dayjs(playStart).add(1, 'hour');
        if (dayjs(`${selectedDate} ${playStart}`).isBefore(dayjs(currentTime))) {
          toast({
            title: 'Đặt lịch thất bại',
            description: 'Không thể đặt lịch của ngày trước đó',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (dayjs(playEnd).isBefore(minEndDate) && !dayjs(playEnd).isSame(minEndDate)) {
          toast({
            title: 'Đặt lịch thất bại',
            description: 'Thời gian đặt lịch phải lơn hơn hoặc bằng 1 tiêng',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        const bookingPost: BookingByDay = {
          fullName: eventData.fullName,
          courtId: eventData.courtId,
          fromDate: eventData.selectedDate,
          fromTime: eventData.playStart + ':00',
          toTime: eventData.playEnd + ':00',
          phoneNumber: eventData.phoneNumber,
        };

        args.cancel = true;
        await createBooking(bookingPost, toast);
      }
    }
    if (args.requestType === 'eventRemove') {
      const elementId = args.data[0].id;
      await bookingClusterStore.cancelBooking(elementId, toast);
    }
  };

  const handleOnCellClick = (args: any) => {
    const { startTime, endTime } = args;
    setSelectedDate(dayjs(startTime).format('YYYY-MM-DD'));
    setPlayStart(dayjs(startTime).format('HH:mm'));
    setPlayEnd(dayjs(endTime).format('HH:mm'));
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
    if(paymentStatus == PaymentStatus.Success && !isComplete){
      args.element.classList.add('success-payment');
    }

    if (isComplete) {
      args.element.classList.add('booking-complete');
    }
  };

  const handleNavigation = async (args: any) => {
    if (args.action === 'date') {
      // Lấy ngày hiện tại trên lịch
      const selectedDate = args.currentDate;
      await bookingClusterStore.loadBookingForSchedule(toast, selectedDate);
    }
  };
  const onPopupOpen = (args: any) => {
    if (args.type === 'Editor') {
      setTimeout(() => {
        const saveButton = args.element.querySelector('.e-event-save');
        const isEditing = args.data.id; // Sửa theo field id bạn dùng
        if (isEditing) {
          if (saveButton) saveButton.setAttribute('disabled', '');
        } else {
          if (saveButton) saveButton.removeAttribute('disabled');
          args.element.querySelector('#selectedDate').value = selectedDate;
          args.element.querySelector('#playStart').value = playStart;
          args.element.querySelector('#playEnd').value = playEnd;
        }
      }, 100);
    }
    if (args.type === 'DeleteAlert') {
      const dialog = args.element;
      const deleteHeader = dialog.querySelector('.e-dlg-header');
      const deleteContent = dialog.querySelector('.e-dlg-content');
      // Tìm tất cả các nút trong footer của popup
      const deleteButton = dialog.querySelector('.e-quick-dialog-delete');
      const cancelButton = dialog.querySelector('.e-quick-dialog-cancel');
      deleteContent.innerText = 'Bạn có chắc muốn hủy lịch này';
      deleteHeader.innerText = 'Hủy lịch';
      deleteButton.innerText = 'Xác nhận';
      cancelButton.innerText = 'Hủy';
    }
  };
  const handleEventClick = (args: any) => {
    args.cancel = true; // Ngừng hành vi mặc định (mở popup chỉnh sửa)

    const eventId = args.event.id;  // Lấy ID của sự kiện được click
    // Chuyển hướng đến trang chi tiết của sự kiện
    router.navigate(`/booking/chi-tiet/${eventId}`);
  };

  const eventTemplate = (props:any) => {
    return (
      <div className="template-wrap">
        <div>
          {props.fullName}
        </div>
        <div>
          {props.phoneNumber}
        </div>
        <div className="time flex ">
          {dayjs(props.startTime).format('HH:mm')} - {dayjs(props.endTime).format('HH:mm')}
        </div>
      </div>
    );
  };

  return (
    <>
      {!loadingInitialBookingPage && (
        <ScheduleComponent
          ref={schedule}
          group={group}
          timeFormat="HH:mm"
          timeScale={{ enable: true, interval: 60, slotCount: 1 }}
          workHours={{ highlight: true, start: selectedCourtCluster.openTime.substring(0,5), end: selectedCourtCluster.closeTime.substring(0,5) }}
          startHour={selectedCourtCluster.openTime.substring(0, 5)}
          endHour={selectedCourtCluster.closeTime.substring(0, 5)}
          showQuickInfo={false}
          timezone="Asia/Bangkok"
          cellClick={handleOnCellClick}
          editorTemplate={(props: any) => (
            <BookingEditorTemplateComponent
              {...props}
              courtOfClusterArray={selectedCourtCluster.courts} // Truyền dataSource vào editor template
              playStart={playStart}
              playEnd={playEnd}
            />
          )}
          cssClass="schedule-cell-dimension"
          eventRendered={handleEventRendered}
          eventSettings={{
            fields: fields,
            dataSource: bookingScheduleArray,
          }}
          rowAutoHeight={true}
          quickInfoOnSelectionEnd={true}
          actionBegin={async (prop: any) => await handleActionBegin(prop)} // Đảm bảo hàm hành động
          renderCell={handleRenderCell}
          enableAdaptiveUI={true}
          navigating={async (args: any) => await handleNavigation(args)}
          popupOpen={onPopupOpen}
          eventClick={handleEventClick}
        >
          <ViewsDirective>
            <ViewDirective option="Week" dateFormat="dd-MMM-yyyy"  eventTemplate={eventTemplate}/>
          </ViewsDirective>
          <ResourcesDirective>
            <ResourceDirective
              field="courtId"
              title="Sân"
              name="courts"
              allowMultiple={true}
              dataSource={selectedCourtCluster.courts}
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
