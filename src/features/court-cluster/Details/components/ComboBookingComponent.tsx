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
  Heading,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { TimePicker } from 'antd';
import { FastField, Field, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import * as Yup from 'yup';
import { BookingWithCombo, IBookingWithCombo } from '@/app/models/booking.model';
const ComboBookingComponent = observer(() => {
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
      ),
  });

  const { courtClusterStore, bookingClusterStore } = useStore();
  const [selectedCourt, setSelectedCourt] = useState(0);
  return (
    <Card className="h-[640px]">
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
            await bookingClusterStore.bookingWithCombo(newCombo);
          }}
          initialValues={new BookingWithCombo()}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => (
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
                      <Input placeholder="Số điện thoại" type="text" {...field} />
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
                          const selectedId = e.target.value;
                          field.onChange(e); // Cập nhật Formik state
                          setSelectedCourt(Number(selectedId)); // Cập nhật React state
                        }}
                      >
                        {courtClusterStore.courtOfClusterArray.map((combo) => (
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
                    const selectCourt = courtClusterStore.courtOfClusterRegistry.get(selectedCourt);
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
                      return <Text className="pl-1">Sân không có combo để hiển thị</Text>;
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
                        />
                        <FormErrorMessage className="pr-8">{form.errors.fromTime}</FormErrorMessage>
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
                        />
                        <FormErrorMessage className="pl-8">{form.errors.toTime}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
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
});

export default ComboBookingComponent;
