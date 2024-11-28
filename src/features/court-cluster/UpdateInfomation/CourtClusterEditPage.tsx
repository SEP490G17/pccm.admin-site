import AddressSelectAtom from '@/app/common/form/AddressSelectAtom';
import ImageUpload from '@/app/common/input/ImageUpload';
import { useStore } from '@/app/stores/store';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';
import {
  Badge,
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
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { TimePicker } from 'antd';
import { FastField, Field, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import ReactQuillComponent from '@/app/common/input/ReactQuill';
import * as Yup from 'yup';

const CourtClusterEditPage = observer(() => {
  // Định nghĩa schema cho CourtClusterDetails
  const CourtClusterDetailsSchema = Yup.object()
    .shape({
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
    })
    .test('open-time-before-close-time', 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa', function (values) {
      const { openTime, closeTime } = values;

      if (openTime && closeTime) {
        // Convert times to a comparable format (e.g., "HH:mm")
        const openTimeMoment = dayjs(openTime, 'HH:mm');
        const closeTimeMoment = dayjs(closeTime, 'HH:mm');

        // Check if openTime is before closeTime
        if (openTimeMoment.isAfter(closeTimeMoment)) {
          return this.createError({
            path: 'openTime',
            message: 'Giờ mở cửa phải nhỏ hơn giờ đóng cửa',
          });
        }
      }

      return true;
    });
  const { courtClusterStore } = useStore();
  const { getDetailsCourtCluster, selectedCourtCluster, loadingInitialDetailsPage } =
    courtClusterStore;
  const toast = useToast();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getDetailsCourtCluster(id, toast);
    }
  }, [getDetailsCourtCluster, id, toast]);

  if (!id || loadingInitialDetailsPage) {
    return (
      <Flex className="w-full  justify-center items-center bg-slate-200" h={'80vh'}>
        <Center>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      </Flex>
    );
  }
  return (
    <>
      <PageHeadingAtoms
        breadCrumb={[
          { title: 'Cụm sân', to: '/cum-san' },
          { title: 'Chỉnh sửa', to: `/cum-san/${id}/chinh-sua` },
        ]}
      />
      <Heading className="mb-4 mt-2">Chỉnh sửa cụm sân {selectedCourtCluster?.title}</Heading>
      {selectedCourtCluster && (
        <Card className="h-[100rem]">
          <CardBody>
            <Formik
              initialValues={selectedCourtCluster}
              onSubmit={async (value) => {
                await courtClusterStore.updateCourtCluster(Number(id), value, toast);
              }}
              validationSchema={CourtClusterDetailsSchema}
            >
              {({ values, errors, touched, setFieldValue, getFieldHelpers }) => (
                <Form>
                  <Grid templateColumns={'repeat(24,1fr)'} gap={5}>
                    <GridItem colSpan={12}>
                      <FastField name="title">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.title && form.touched.title}>
                            <Grid templateColumns="10rem 1fr" alignItems="center" columnGap={2}>
                              <FormLabel className="title_label_court">Tên cụm sân</FormLabel>
                              <Input
                                placeholder="Nhập tiêu đề cho cụm sân"
                                type="text"
                                {...field}
                              />
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
                            <FormControl isInvalid={!!(errors.openTime && touched.openTime)}>
                              <TimePicker
                                placeholder={'--:--'}
                                className="h-10"
                                format={'HH:mm'}
                                defaultValue={
                                  values.openTime ? dayjs(values.openTime, 'HH:mm:ss') : null
                                }
                                onBlur={() => getFieldHelpers('openTime').setTouched(true)} // Ensure you call handleBlur
                                onChange={(date) => {
                                  setFieldValue(
                                    'openTime',
                                    date ? dayjs(date).format('HH:mm:ss') : null,
                                  );
                                }}
                              />
                              <FormErrorMessage>{errors.openTime}</FormErrorMessage>
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
                            <FormControl isInvalid={!!(errors.closeTime && touched.closeTime)}>
                              <TimePicker
                                placeholder={'--:--'}
                                className="h-10"
                                format={'HH:mm'}
                                onBlur={() => getFieldHelpers('closeTime').setTouched(true)} // Ensure you call handleBlur
                                defaultValue={
                                  values.closeTime ? dayjs(values.closeTime, 'HH:mm') : null
                                }
                                onChange={(date) => {
                                  setFieldValue(
                                    'closeTime',
                                    date ? dayjs(date).format('HH:mm:ss') : null,
                                  );
                                }}
                              />
                              <FormErrorMessage>{errors.closeTime}</FormErrorMessage>
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
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          touched={touched}
                        />
                      </Grid>
                    </GridItem>
                    <GridItem colSpan={24}>
                      <FormControl isInvalid={!!(errors.images && touched.images)}>
                        <Grid templateColumns="10rem 1fr" alignItems="center" gap={2} mt={2}>
                          <FormLabel className="title_label_court">Ảnh sân</FormLabel>
                          {/* <ImageUpload limit={4} name="images" /> */}
                          <GridItem>
                            <Field name="images">
                              {({ form }: any) => (
                                <ImageUpload
                                  name="images"
                                  limit={4}
                                  initialFileList={form.values.images.map((x: any) => {
                                    return {
                                      url: x,
                                    };
                                  })}
                                />
                              )}
                            </Field>
                            <FormErrorMessage>{errors.images}</FormErrorMessage>
                          </GridItem>
                        </Grid>
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <FastField name="description">
                    {({
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
                          className="h-[50rem]"
                          content={form.values.description ?? ''}
                          onChange={(value: string) => form.setFieldValue('description', value)}
                        />
                        <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                      </FormControl>
                    )}
                  </FastField>
                  <GridItem colSpan={24}>
                    <Flex className="float-end">
                      <Button colorScheme={'teal'} type="submit">
                        Lưu thay đổi
                      </Button>
                    </Flex>
                  </GridItem>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      )}
    </>
  );
});
export default CourtClusterEditPage;
