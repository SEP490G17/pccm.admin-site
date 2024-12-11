import AddressSelectAtom from '@/app/common/form/AddressSelectAtom';
import ImageUpload from '@/app/common/input/ImageUpload';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  useToast,
} from '@chakra-ui/react';
import { TimePicker } from 'antd';
import { FastField, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import { CourtPriceModel } from '../CourtsManager/popup/CourtCreatePopup';
import CourtDetailsArrayField from './components/CourtDetailsArrayField';
import ReactQuillComponent from '@/app/common/input/ReactQuill';

import * as Yup from 'yup';
import { CommonMessage } from '@/app/common/toastMessage/commonMessage';
import agent from '@/app/api/agent';
import { router } from '@/app/router/Routes';

export interface CourtClusterCreatePage2Formik {
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  images: string[];
  courtDetails: CourtCreateModel[];
}
export interface CourtCreateModel {
  courtName: string;
  courtPrice: CourtPriceModel[];
}

const CourtClusterCreatePage = observer(() => {
  const initialValues: CourtClusterCreatePage2Formik = {
    title: '',
    description: '',
    openTime: '',
    closeTime: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    images: [],
    courtDetails: [
      {
        courtName: '',
        courtPrice: [
          {
            fromTime: '',
            toTime: '',
            price: 0,
          },
        ],
      },
    ],
  };
  const courtPriceSchema = Yup.object().shape({
    courtName: Yup.string().required('Không được bỏ trống'),
    courtPrice: Yup.array()
      .min(1, 'Cần có ít nhất 1 khoảng giá')
      .of(
        Yup.object().shape({
          fromTime: Yup.string().required('Không được bỏ trống'),
          toTime: Yup.string().required('Không được bỏ trống'),
          price: Yup.number()
            .min(10000, 'Giá tối thiểu là 10.000 VND')
            .required('Không được bỏ trống'),
        }),
      )
      .test(
        'times-are-contiguous',
        'Các khoảng thời gian phải nối tiếp nhau',
        (courtPriceArray) => {
          if (courtPriceArray) {
            for (let i = 0; i < courtPriceArray.length - 1; i++) {
              if (courtPriceArray[i].toTime !== courtPriceArray[i + 1].fromTime) {
                return false;
              }
            }
          }
          return true;
        },
      )
      .test(
        'first-last-time',
        'Thời gian của khung giờ phải tương ứng với thời gian mở/đóng sân',
        (courtPriceArray, context) => {
          if (courtPriceArray) {
            const { openTime, closeTime } = context.options.context; 
            const firstCourtPrice = courtPriceArray[0];
            const lastCourtPrice = courtPriceArray[courtPriceArray.length - 1];

            if (firstCourtPrice.fromTime !== openTime || lastCourtPrice.toTime !== closeTime) {
              return false;
            }
          }
          return true;
        },
      ),
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Không được bỏ trống'),
    description: Yup.string().required('Không được bỏ trống'),
    openTime: Yup.string()
      .required('Không được bỏ trống')
      .test(
        'closeTime-after-openTime',
        'Thời gian đóng cửa phải sau thời gian mở cửa',
        function (openTime) {
          const { closeTime } = this.parent;
          const firstFromTime = dayjs(openTime, 'HH:mm');
          const lastToTime = dayjs(closeTime, 'HH:mm');
          return firstFromTime.isBefore(lastToTime);
        },
      ),
    closeTime: Yup.string()
      .required('Không được bỏ trống')
      .test(
        'closeTime-after-openTime',
        'Thời gian đóng cửa phải sau thời gian mở cửa',
        function (closeTime) {
          const { openTime } = this.parent;
          const firstFromTime = dayjs(openTime, 'HH:mm');
          const lastToTime = dayjs(closeTime, 'HH:mm');
          return firstFromTime.isBefore(lastToTime);
        },
      ),
    province: Yup.string().required('Không được bỏ trống'),
    district: Yup.string().required('Không được bỏ trống'),
    ward: Yup.string().required('Không được bỏ trống'),
    address: Yup.string().required('Không được bỏ trống'),
    images: Yup.array()
      .min(2, 'Phải có ít nhất 2 ảnh')
      .max(4, 'Tối đa 4 ảnh')
      .required('Không được bỏ trống'),
    courtDetails: Yup.array().of(courtPriceSchema).required('Không được bỏ trống').min(1,'Cần có ít nhất 1 sân'),
  });
  const toast = useToast();
  return (
      <Card>
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { isSubmitting }: any) => {
              const pending = toast(CommonMessage.loadingMessage('Tạo cụm sân'));
              await agent.CourtClusterAgent.create(values)
                .then(() => {
                  toast.close(pending);
                  toast({
                    title: 'Tạo cụm sân',
                    description: 'Tạo cụm sân thành công',
                    duration: 3000,
                    status: 'success',
                    isClosable: true,
                  });
                  router.navigate('/cum-san');
                })
                .catch((err) => {
                  toast({
                    title: 'Tạo cụm sân',
                    description: err.message,
                    duration: 3000,
                    status: 'error',
                    isClosable: true,
                  });
                })
                .finally(() => {
                  isSubmitting(false);
                });
            }}
          >
            {(props: FormikProps<CourtClusterCreatePage2Formik>) => (
              <Form>
                <Grid templateColumns={'repeat(24,1fr)'} gap={5}>
                  <GridItem colSpan={12}>
                    <FastField name="title">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.title && form.touched.title}>
                          <Grid templateColumns="10rem 1fr" alignItems="center" columnGap={2}>
                            <FormLabel className="title_label_court">Tên cụm sân</FormLabel>
                            <Input placeholder="Nhập tiêu đề cho cụm sân" type="text" {...field} />
                            <div></div>
                            <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                          </Grid>
                        </FormControl>
                      )}
                    </FastField>
                  </GridItem>
                  <GridItem colSpan={12}></GridItem>
                  <GridItem colSpan={12}>
                    <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                      <FormLabel className="title_label_court">Thời gian</FormLabel>
                      <Grid templateColumns={'repeat(4,1fr)'} gap={3.5}>
                        <GridItem colSpan={1}>
                          <Badge
                            colorScheme="green"
                            fontSize="1em"
                            borderRadius={'md'}
                            padding="0.5rem 1rem "
                            className="flex items-center justify-center text-center w-full h-10"
                          >
                            Giờ mở cửa
                          </Badge>
                        </GridItem>
                        <GridItem colSpan={1}>
                          <FormControl
                            isInvalid={!!(props.errors.openTime && props.touched.openTime)}
                          >
                            <TimePicker
                              placeholder={'--:--'}
                              className="h-10"
                              format={'HH:mm'}
                              defaultValue={
                                props.values.openTime
                                  ? dayjs(props.values.openTime, 'HH:mm:ss')
                                  : null
                              }
                              onBlur={() => props.getFieldHelpers('openTime').setTouched(true)} // Ensure you call handleBlur
                              onChange={(date) => {
                                props.setFieldValue(
                                  'openTime',
                                  date ? dayjs(date).format('HH:mm:ss') : null,
                                );
                              }}
                            />
                            <FormErrorMessage>{props.errors.openTime}</FormErrorMessage>
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={1}>
                          <Badge
                            colorScheme="red"
                            fontSize="1em"
                            borderRadius={'md'}
                            padding="0.5rem 1rem "
                            className="flex items-center justify-center text-center w-full h-10"
                          >
                            Giờ đóng cửa
                          </Badge>
                        </GridItem>
                        <GridItem colSpan={1}>
                          <FormControl
                            isInvalid={!!(props.errors.closeTime && props.touched.closeTime)}
                          >
                            <TimePicker
                              placeholder={'--:--'}
                              className="h-10"
                              format={'HH:mm'}
                              onBlur={() => props.getFieldHelpers('closeTime').setTouched(true)} // Ensure you call handleBlur
                              defaultValue={
                                props.values.closeTime
                                  ? dayjs(props.values.closeTime, 'HH:mm')
                                  : null
                              }
                              onChange={(date) => {
                                props.setFieldValue(
                                  'closeTime',
                                  date ? dayjs(date).format('HH:mm:ss') : null,
                                );
                              }}
                            />
                            <FormErrorMessage>{props.errors.closeTime}</FormErrorMessage>
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Grid>
                  </GridItem>
                  <GridItem colSpan={12}></GridItem>
                  <GridItem colSpan={12}>
                    <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                      <FormLabel className="title_label_court">Địa chỉ</FormLabel>
                      <AddressSelectAtom
                        setFieldValue={props.setFieldValue}
                        values={props.values}
                        errors={props.errors}
                        touched={props.touched}
                      />
                    </Grid>
                  </GridItem>
                  <GridItem colSpan={24}>
                    <FormControl isInvalid={!!(props.errors.images && props.touched.images)}>
                      <Grid templateColumns="10rem 1fr" alignItems="center" gap={2} mt={2}>
                        <FormLabel className="title_label_court">Ảnh sân</FormLabel>
                        <GridItem>
                          <ImageUpload name="images" limit={4} />
                          <FormErrorMessage>{props.errors.images}</FormErrorMessage>
                        </GridItem>
                      </Grid>
                    </FormControl>
                  </GridItem>
                  {/* //#endregion */}

                  {/* #region field array */}
                  <CourtDetailsArrayField props={props} />
                  {/* #endregion */}
                </Grid>
                <FastField name="description">
                  {({
                    field,
                    form,
                  }: {
                    field: FieldInputProps<string>;
                    form: FormikProps<{ description: string }>;
                  }) => (
                    <FormControl
                      isInvalid={!!(form.errors.description && form.touched.description)}
                    >
                      <FormLabel className="title_label_court">Mô tả sân</FormLabel>
                      <ReactQuillComponent
                        content={field.value}
                        onChange={(value: string) => form.setFieldValue('description', value)}
                      />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </FastField>
                <Flex gap="0.78rem" justifyContent="flex-end">
                  <Button
                    disabled={props.isSubmitting}
                    className="save"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Lưu
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
  );
});

export default CourtClusterCreatePage;
