import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms.tsx';
import { FastField, Field, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
} from '@chakra-ui/react';
import ImageUpload from '@/app/common/input/ImageUpload.tsx';
import ReactQuillComponent from '@/app/common/input/ReactQuill.tsx';
import { observer } from 'mobx-react';
import { TimePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import AddressSelectAtom from '@/app/common/form/AddressSelectAtom';
import * as Yup from 'yup';
import {
  CourtClusterDetailsCreate,
  CourtPrice,
  CourtDetailsCreate,
} from '@/app/models/court.model';
import agent from '@/app/api/agent';
import { CommonMessage } from '@/app/common/toastMessage';
import { router } from '@/app/router/Routes';

const CourtClusterCreatePage = observer(() => {
  const CourtPriceSchema = Yup.object().shape({
    price: Yup.number().min(1000, 'Giá phải lớn hơn hoặc bằng 1000').required('Giá là bắt buộc'),
    fromTime: Yup.string().required('Thời gian bắt đầu là bắt buộc'),
    toTime: Yup.string().required('Thời gian kết thúc là bắt buộc'),
  });

  // Định nghĩa schema cho CourtDetails
  const CourtDetailsSchema = Yup.object().shape({
    courtName: Yup.string().required('Tên sân là bắt buộc'),
    courtPrice: Yup.array()
      .of(CourtPriceSchema)
      .min(1, 'Phải có ít nhất một mức giá')
      .required('Giá là bắt buộc'),
    status: Yup.number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ')
      .required('Trạng thái là bắt buộc'),
  });

  // Định nghĩa schema cho CourtClusterDetails
  const CourtClusterDetailsSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề là bắt buộc'),
    description: Yup.string().required(),
    openTime: Yup.string().required('Giờ mở cửa là bắt buộc'),
    closeTime: Yup.string().required('Giờ đóng cửa là bắt buộc'),
    province: Yup.string().required('Tỉnh là bắt buộc'),
    district: Yup.string().required('Quận là bắt buộc'),
    ward: Yup.string().required('Phường là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    images: Yup.array()
      .of(Yup.string().url('URL không hợp lệ'))
      .min(4, 'Cần ít nhất 4 ảnh')
      .required('Ảnh là bắt buộc'),
    courtDetails: Yup.array()
      .of(CourtDetailsSchema)
      .min(1, 'Phải có ít nhất một sân')
      .required('Sân là bắt buộc'),
  });
  const toast = useToast();
  const [initial, setInitial] = useState<CourtClusterDetailsCreate>({
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
        id: 0,
        courtPrice: [
          {
            toTime: '',
            price: 0,
            fromTime: '',
          },
        ],
        status: 1,
        courtName: '',
      },
    ],
  });
  return (
    <>
      <PageHeadingAtoms
        breadCrumb={[
          { title: 'Cụm sân', to: '/cum-san' },
          { title: 'Tạo sân', to: `/cum-san/tao` },
        ]}
      />
      <Heading className="mb-4 mt-2">Tạo cụm sân</Heading>

      <Card>
        <CardBody>
          <Formik
            initialValues={initial}
            validationSchema={CourtClusterDetailsSchema}
            validateOnChange={false}
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
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
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
                                props.values.openTime ? dayjs(props.values.openTime, 'HH:mm:ss') : null
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
                        {/* <ImageUpload limit={4} name="images" /> */}
                        <GridItem>
                          <Field name="images">
                            {({ field, form }: any) => (
                              <ImageUpload name="images" limit={4} initialFileList={[]} />
                            )}
                          </Field>
                          <FormErrorMessage>{props.errors.images}</FormErrorMessage>
                        </GridItem>
                      </Grid>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={24}>
                    <Flex
                      direction={'row'}
                      gap={3}
                      alignItems={'center'}
                      className="justify-between"
                    >
                      <FormLabel className="title_label_court">Thông tin sân</FormLabel>
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          const newCourtDetails: CourtDetailsCreate = {
                            id: 0,
                            courtName: '',
                            courtPrice: [
                              {
                                price: 0,
                                toTime: '',
                                fromTime: '',
                              },
                            ],
                            status: 0,
                          };
                          props.values.courtDetails.push(newCourtDetails);
                          setInitial({
                            ...initial,
                            courtDetails: props.values.courtDetails,
                          });
                        }}
                      >
                        Thêm sân
                      </Button>
                    </Flex>

                    <Grid
                      templateColumns={'repeat(12,1fr)'}
                      gap={'1px'}
                      className={'rounded-t-md text-white w-full'}
                    >
                      <GridItem className={'rounded-tl-md bg-primary-700  px-4 py-2'} colSpan={1}>
                        #
                      </GridItem>
                      <GridItem className={'bg-primary-700  px-4 py-2'} colSpan={3}>
                        Tên sân
                      </GridItem>
                      <GridItem className={'bg-primary-700  px-4 py-2'} colSpan={3}>
                        Khung giờ
                      </GridItem>
                      <GridItem className={'bg-primary-700  px-4 py-2'} colSpan={2}>
                        Giá tiền
                      </GridItem>
                      <GridItem
                        className={'rounded-tr-md bg-primary-700  px-4 py-2'}
                        colSpan={3}
                      ></GridItem>
                    </Grid>
                    {props.values.courtDetails.map((cd, index) => (
                      <>
                        <Grid
                          key={`court${index * 2}`}
                          templateColumns={'repeat(12,1fr)'}
                          gap={5}
                          className={`bg-white py-2  w-full`}
                        >
                          <GridItem colSpan={1}>
                            <Center>{index + 1}</Center>
                          </GridItem>
                          <GridItem colSpan={3}>
                            <FastField name={`courtDetails[${index}].courtName`}>
                              {({ field, form }: any) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.courtDetails?.[index]?.courtName &&
                                    form.touched.courtDetails?.[index]?.courtName
                                  }
                                >
                                  <Input
                                    key={`ten-san${index}`}
                                    {...field}
                                    placeholder="Tên sân"
                                  ></Input>
                                  <FormErrorMessage>
                                    {form.errors.courtDetails?.[index]?.courtName}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </FastField>
                          </GridItem>
                          <GridItem colSpan={3}>
                            <Flex direction={'row'} gap={2}>
                              <FormControl
                                isInvalid={
                                  !!props.errors.courtDetails?.[index]?.courtPrice?.[0]?.fromTime
                                }
                              >
                                <TimePicker
                                  key={`from${index}`}
                                  placeholder={'Từ'}
                                  size={'large'}
                                  format={'HH:mm'}
                                  defaultValue={
                                    props.getFieldProps(
                                      `courtDetails[${index}].courtPrice.[0].fromTime`,
                                    ).value
                                      ? dayjs(
                                          props.getFieldProps(
                                            `courtDetails[${index}].courtPrice.[0].fromTime`,
                                          ).value,
                                          'HH:mm',
                                        )
                                      : null
                                  }
                                  onChange={(date) => {
                                    props.setFieldValue(
                                      `courtDetails[${index}].courtPrice.[0].fromTime`,
                                      dayjs(date).format('HH:mm:ss'),
                                    );
                                    console.log(dayjs(date).format('HH:mm'));
                                  }}
                                  onBlur={() =>
                                    props
                                      .getFieldHelpers(
                                        `courtDetails[${index}].courtPrice.[0].fromTime`,
                                      )
                                      .setTouched(true)
                                  } // Ensure you call handleBlur
                                />
                                <FormErrorMessage>
                                  {props.errors.courtDetails?.[index]?.courtPrice?.[0]?.fromTime}
                                </FormErrorMessage>
                              </FormControl>
                              <FormControl
                                isInvalid={
                                  !!props.errors.courtDetails?.[index]?.courtPrice?.[0]?.toTime
                                }
                              >
                                <TimePicker
                                  key={`to${index}`}
                                  placeholder={'Đến'}
                                  size={'large'}
                                  format={'HH:mm'}
                                  defaultValue={
                                    props.getFieldProps(
                                      `courtDetails[${index}].courtPrice.[0].toTime`,
                                    ).value
                                      ? dayjs(
                                          props.getFieldProps(
                                            `courtDetails[${index}].courtPrice.[0].toTime`,
                                          ).value,
                                          'HH:mm',
                                        )
                                      : null
                                  }
                                  onChange={(date) => {
                                    props.setFieldValue(
                                      `courtDetails[${index}].courtPrice.[0].toTime`,
                                      dayjs(date).format('HH:mm:ss'),
                                    );
                                  }}
                                  onBlur={() =>
                                    props
                                      .getFieldHelpers(
                                        `courtDetails[${index}].courtPrice.[0].toTime`,
                                      )
                                      .setTouched(true)
                                  } // Ensure you call handleBlur
                                />

                                <FormErrorMessage>
                                  {props.errors.courtDetails?.[index]?.courtPrice?.[0]?.toTime}
                                </FormErrorMessage>
                              </FormControl>
                            </Flex>
                          </GridItem>
                          <GridItem colSpan={2}>
                            <FastField name={`courtDetails[${index}].courtPrice[0].price`}>
                              {({ field, form }: any) => (
                                <FormControl
                                  isInvalid={!!form.errors.courtDetails?.[0]?.courtPrice?.[0].price}
                                >
                                  <NumberInput>
                                    <InputGroup>
                                      <NumberInputField key={`price${index}`} {...field} />
                                      <InputRightElement width="4.5rem">
                                        <Text fontSize="sm" color="gray.500">
                                          VNĐ
                                        </Text>
                                      </InputRightElement>
                                    </InputGroup>
                                  </NumberInput>
                                  <FormErrorMessage>
                                    {form.errors.courtDetails?.[index]?.courtPrice?.[0].price}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </FastField>
                          </GridItem>
                          <GridItem colSpan={3}>
                            <Center gap={3}>
                              <Button
                                onClick={() => {
                                  if (
                                    props.values.courtDetails &&
                                    props.values.courtDetails.length > 1
                                  ) {
                                    props.values.courtDetails = props.values.courtDetails.filter(
                                      (_, numIndex) => numIndex !== index,
                                    );

                                    setInitial({
                                      ...initial,
                                      courtDetails: props.values.courtDetails,
                                    });
                                  }
                                }}
                                colorScheme={'red'}
                              >
                                Xoá sân
                              </Button>
                              <Button
                                onClick={() => {
                                  if (cd.courtPrice.length > 1) {
                                    cd.courtPrice.pop();
                                    const newCourtDetails = props.values.courtDetails;
                                    setInitial({
                                      ...initial,
                                      courtDetails: newCourtDetails,
                                    });
                                  }
                                }}
                                colorScheme={'red'}
                              >
                                Xoá giờ
                              </Button>
                            </Center>
                          </GridItem>
                        </Grid>

                        {cd.courtPrice.map((_, no) => {
                          if (no > 0) {
                            return (
                              <Grid
                                key={`price-${no + 1}`}
                                templateColumns={'repeat(12,1fr)'}
                                gap={5}
                                className={'bg-white py-2 w-full'}
                              >
                                <GridItem colSpan={1}></GridItem>
                                <GridItem colSpan={3}></GridItem>
                                <GridItem colSpan={3}>
                                  <Flex direction={'row'} gap={2}>
                                    <TimePicker
                                      placeholder={'Từ'}
                                      size={'large'}
                                      format={'HH:mm'}
                                      defaultValue={
                                        props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[${no}].fromTime`,
                                        ).value
                                          ? dayjs(
                                              props.getFieldProps(
                                                `courtDetails[${index}].courtPrice.[${no}].fromTime`,
                                              ).value,
                                              'HH:mm',
                                            )
                                          : null
                                      }
                                      onChange={(date) => {
                                        props.setFieldValue(
                                          `courtDetails[${index}].courtPrice.[${no}].fromTime`,
                                          dayjs(date).format('HH:mm:ss'),
                                        );
                                        console.log(dayjs(date).format('HH:mm'));
                                      }}
                                      onBlur={() =>
                                        props
                                          .getFieldHelpers(
                                            `courtDetails[${index}].courtPrice.[${no}].fromTime`,
                                          )
                                          .setTouched(true)
                                      } // Ensure you call handleBlur
                                    />
                                    <TimePicker
                                      placeholder={'Đến'}
                                      size={'large'}
                                      format={'HH:mm'}
                                      {...props.getFieldProps(
                                        `courtDetails[${index}].courtPrice.[${no}].toTime`,
                                      )}
                                      defaultValue={
                                        props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[${no}].toTime`,
                                        ).value
                                          ? dayjs(
                                              props.getFieldProps(
                                                `courtDetails[${index}].courtPrice.[${no}].toTime`,
                                              ).value,
                                              'HH:mm',
                                            )
                                          : null
                                      }
                                      onChange={(date) => {
                                        props.setFieldValue(
                                          `courtDetails[${index}].courtPrice.[${no}].toTime`,
                                          dayjs(date).format('HH:mm:ss'),
                                        );
                                        console.log(dayjs(date).format('HH:mm'));
                                      }}
                                    />
                                  </Flex>
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <NumberInput>
                                    <InputGroup>
                                      <NumberInputField
                                        {...props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[${no}].price`,
                                        )}
                                      />
                                      <InputRightElement width="4.5rem">
                                        <Text fontSize="sm" color="gray.500">
                                          VNĐ
                                        </Text>
                                      </InputRightElement>
                                    </InputGroup>
                                  </NumberInput>
                                </GridItem>
                                <GridItem colSpan={3}></GridItem>
                              </Grid>
                            );
                          }
                        })}
                        <Grid
                          templateColumns={'repeat(12,1fr)'}
                          gap={5}
                          className={'bg-white py-2  text-white'}
                        >
                          <GridItem colSpan={1}></GridItem>
                          <GridItem colSpan={3}></GridItem>
                          <GridItem colSpan={3}>
                            <Button
                              size={'sm'}
                              colorScheme={'teal'}
                              onClick={() => {
                                const newCourtPrice: CourtPrice = {
                                  price: 0,
                                  toTime: '',
                                  fromTime: '',
                                };
                                cd.courtPrice.push(newCourtPrice);
                                const newCourtDetails = props.values.courtDetails;
                                setInitial({
                                  ...initial,
                                  courtDetails: newCourtDetails,
                                });
                              }}
                            >
                              Thêm khung giờ
                            </Button>
                          </GridItem>
                          <GridItem colSpan={2}></GridItem>
                          <GridItem colSpan={3}></GridItem>
                        </Grid>
                      </>
                    ))}
                  </GridItem>
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
                        content={form.values.description??''}
                        onChange={(value: string) => form.setFieldValue('description', value)}
                      />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </FastField>
                <Flex gap="0.78rem" justifyContent="flex-end">
                  {/* <Button
                    className="delete"
                    onClick={() => props.resetForm()}
                    isLoading={props.isSubmitting}
                    type="button"
                  >
                    Reset
                  </Button> */}
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
    </>
  );
});
export default CourtClusterCreatePage;
