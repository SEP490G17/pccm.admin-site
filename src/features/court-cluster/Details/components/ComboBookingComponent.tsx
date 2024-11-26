import { useStore } from '@/app/stores/store';
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { TimePicker } from 'antd';
import { FastField, Field, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { BookingWithCombo, IBookingWithCombo } from '@/app/models/booking.model';
import { CourtCluster } from '@/app/models/court.model';

interface IComboBookingProps {
  openTime: string;
  closeTime: string;
  selectedCourtCluster: CourtCluster;
}

const ComboBookingComponent = observer(
  ({ openTime, closeTime, selectedCourtCluster }: IComboBookingProps) => {
    const validationSchema = Yup.object({
      fullName: Yup.string().required('Họ và tên là bắt buộc'),
      phoneNumber: Yup.string().required('Số điện thoại là bắt buộc'),
      courtId: Yup.number().min(1, 'Chưa chọn sân'),
      fromDate: Yup.date()
        .min(dayjs().startOf('day').toDate(), 'Ngày bắt đầu phải là hôm nay hoặc sau hôm nay') // Kiểm tra ngày phải từ hôm nay trở đi
        .required('Ngày bắt đầu là bắt buộc'),
      comboId: Yup.number().min(1, 'Chưa chọn gói thuê'),
      fromTime: Yup.string()
        .required('Giờ bắt đầu là bắt buộc')
        .test(
          'is-before-toTime',
          'Giờ bắt đầu phải nhỏ hơn giờ kết thúc ít nhất 1 giờ',
          function (value) {
            const { toTime } = this.parent;
            if (!value || !toTime) return true;
            const fromTimeDate = new Date(`1970-01-01T${value}`);
            const toTimeDate = new Date(`1970-01-01T${toTime}`);
            return toTimeDate.getTime() - fromTimeDate.getTime() >= 60 * 60 * 1000; // 1 giờ = 60 * 60 * 1000 milliseconds
          },
        )
        .test(
          'is-after-openTime',
          'Giờ bắt đầu phải lớn hơn hoặc bằng giờ mở cửa',
          function (value) {
            if (!value || !openTime) return true;
            const fromTimeDate = new Date(`1970-01-01T${value}`);
            const openTimeDate = new Date(`1970-01-01T${openTime}`);
            return fromTimeDate.getTime() >= openTimeDate.getTime();
          },
        ),
      toTime: Yup.string()
        .required('Giờ kết thúc là bắt buộc')
        .test(
          'is-after-fromTime',
          'Giờ kết thúc phải lớn hơn giờ bắt đầu ít nhất 1 giờ',
          function (value) {
            const { fromTime } = this.parent;
            if (!value || !fromTime) return true;
            const fromTimeDate = new Date(`1970-01-01T${fromTime}`);
            const toTimeDate = new Date(`1970-01-01T${value}`);
            return toTimeDate.getTime() - fromTimeDate.getTime() >= 60 * 60 * 1000; // 1 giờ = 60 * 60 * 1000 milliseconds
          },
        )
        .test(
          'is-before-closeTime',
          'Giờ kết thúc phải nhỏ hơn hoặc bằng giờ đóng cửa',
          function (value) {
            if (!value || !closeTime) return true;
            const toTimeDate = new Date(`1970-01-01T${value}`);
            const closeTimeDate = new Date(`1970-01-01T${closeTime}`);
            return toTimeDate.getTime() <= closeTimeDate.getTime();
          },
        ),
    });
    const toast = useToast();
    const { courtClusterStore, bookingClusterStore } = useStore();
    return (
      <Card className="h-[640px] w-full">
        <CardBody>
          <Heading size={'lg'} className="mb-5">
            Đặt theo gói combo
          </Heading>
          <Formik
            onSubmit={async (value) => {
              const newCombo: IBookingWithCombo = {
                comboId: Number(value.comboId),
                courtId: Number(value.courtId),
                fromDate: value.fromDate,
                fromTime: value.fromTime,
                toTime: value.toTime,
                fullName: value.fullName,
                phoneNumber: value.phoneNumber,
              };
              await bookingClusterStore.bookingWithCombo(newCombo, toast);
              console.log('submit');
            }}
            initialValues={new BookingWithCombo()}
            validationSchema={validationSchema}
          >
            {({ setFieldValue, values }) => (
              <Form className="flex flex-col gap-3">
                <Grid gap={5}>
                  <FastField name="fullName">
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.fullName && form.touched.fullName}>
                        <Input placeholder="Họ và tên" type="text" {...field} />
                        <FormErrorMessage>{form.errors.fullName}</FormErrorMessage>
                      </FormControl>
                    )}
                  </FastField>
                  <FastField name="phoneNumber">
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.phoneNumber && form.touched.phoneNumber}>
                        <Input
                          placeholder="Số điện thoại"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            // Lấy giá trị từ input, đảm bảo là chuỗi
                            const parsedValue = e.target.value.toString();
                            // Cập nhật giá trị vào form
                            form.setFieldValue(field.name, parsedValue);
                          }}
                        />
                        <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                      </FormControl>
                    )}
                  </FastField>
                  <Field name="courtId">
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.courtId && form.touched.courtId}>
                        <Select
                          id="courtId"
                          placeholder="Chọn sân"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e); // Cập nhật Formik state
                          }}
                        >
                          {selectedCourtCluster.courts.map((combo) => (
                            <option key={combo.courtId} value={combo.courtId}>
                              {combo.courtName}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{form.errors.courtId}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="comboId">
                    {({ field, form }: any) => {
                      const selectCourt = selectedCourtCluster.courts.find(
                        (x) => x.courtId == Number(values.courtId),
                      );
                      if (selectCourt) {
                        const courtCombo = selectCourt.courtCombos;
                        return (
                          <FormControl isInvalid={form.errors.comboId && form.touched.comboId}>
                            <Select
                              id="comboId"
                              placeholder="Chọn combo"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e); // Cập nhật Formik state
                              }}
                            >
                              {courtCombo.map((combo) => (
                                <option key={combo.id} value={combo.id}>
                                  {combo.displayName}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.comboId}</FormErrorMessage>
                          </FormControl>
                        );
                      } else {
                        return (
                          <Text className="pl-1">
                            Sân không có combo để hiển thị {values.courtId}
                          </Text>
                        );
                      }
                    }}
                  </Field>
                  <FastField name="fromDate">
                    {({ field, form }: any) => {
                      const formattedDate = field.value
                        ? new Date(field.value).toISOString().split('T')[0]
                        : '';

                      return (
                        <FormControl isInvalid={form.errors.fromDate && form.touched.fromDate}>
                          <FormLabel>Thời gian bắt đầu:</FormLabel>
                          <Input
                            type="date"
                            value={formattedDate}
                            onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                          />
                          <FormErrorMessage>{form.errors.fromDate}</FormErrorMessage>
                        </FormControl>
                      );
                    }}
                  </FastField>
                  <Flex className="row justify-between">
                    <Field name="fromTime">
                      {({ field, form }: any) => (
                        <FormControl
                          className="flex-col flex items-start"
                          isInvalid={form.errors.fromTime && form.touched.fromTime}
                        >
                          <TimePicker
                            className="w-52 h-10"
                            placeholder="Từ"
                            format="HH:mm"
                            size="large"
                            onChange={(time) => {
                              setFieldValue(field.name, time.format('HH:mm:ss'));
                            }}
                            onBlur={() => {
                              form.setFieldTouched(field.name, true, true);
                              form.validateField(field.name);
                            }}
                          />
                          <FormErrorMessage className="pr-8">
                            {form.errors.fromTime}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="toTime">
                      {({ field, form }: any) => (
                        <FormControl
                          className="flex-col flex items-end"
                          isInvalid={form.errors.toTime && form.touched.toTime}
                        >
                          <TimePicker
                            className="w-52 h-10"
                            placeholder="Đến: "
                            size="large"
                            format={'HH:mm'}
                            onChange={(time) => {
                              setFieldValue(field.name, time.format('HH:mm:ss'));
                            }}
                            onBlur={() => {
                              form.setFieldTouched(field.name, true, true);
                              form.validateField(field.name);
                            }}
                          />
                          <FormErrorMessage className="pl-8">{form.errors.toTime}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
                  <Grid templateColumns={'10rem  1fr'}>
                    <GridItem>Giá trên 1h: </GridItem>
                    <GridItem>
                      {Number(values.comboId) !== 0 &&
                        Number(values.courtId) !== 0 &&
                        (() => {
                          const price =
                            selectedCourtCluster.courts
                              .find((x) => x.courtId == Number(values.courtId))
                              ?.courtCombos.find((x) => x.id == Number(values.comboId))
                              ?.totalPrice.toLocaleString('vn') ?? 0;

                          return price + ' VND';
                        })()}
                    </GridItem>
                    <GridItem>Tổng phải trả: </GridItem>
                    <GridItem>
                      {Number(values.comboId) !== 0 &&
                        Number(values.courtId) !== 0 &&
                        values.fromTime &&
                        values.toTime &&
                        (() => {
                          const from = dayjs(values.fromTime, 'HH:mm:ss');
                          const to = dayjs(values.toTime, 'HH:mm:ss');
                          const diffInMinutes = to.diff(from, 'minute');
                          const hours = (diffInMinutes / 60).toFixed(2);

                          const price =
                            selectedCourtCluster.courts
                              .find((x) => x.courtId == Number(values.courtId))
                              ?.courtCombos.find((x) => x.id == Number(values.comboId))
                              ?.totalPrice || 0;

                          const totalAmount = hours * price;
                          return totalAmount.toLocaleString('vn') + ' VND';
                        })()}
                    </GridItem>
                  </Grid>
                  <Button type="submit" variant="solid" colorScheme="teal">
                    Đặt combo
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    );
  },
);

export default ComboBookingComponent;
