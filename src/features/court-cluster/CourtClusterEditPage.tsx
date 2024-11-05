import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms.tsx';
import { FastField, Form, Formik } from 'formik';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import ImageUpload from '@/app/common/input/ImageUpload.tsx';
import ReactQuillComponent from '@/app/common/input/ReactQuill.tsx';
import { useStore } from '@/app/stores/store.ts';
import { observer } from 'mobx-react';
import { TimePicker } from 'antd';
import '@reach/combobox/styles.css';
import { useState } from 'react';
import dayjs from 'dayjs';

export interface CourtPrice {
  price: number;
  startTime: string;
  endTime: string;
}

export interface CourtDetails {
  courtName: string;
  courtPrice: CourtPrice[];
  status: number;
}

export interface CourtClusterDetails {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  courtDetails: CourtDetails[];
}

// export interface CourtPriceSubmit {
//   price: number;
//   startTime: string;
//   endTime: string;
// }

// export interface CourtDetailsSubmit {
//   courtName: string;
//   courtPrice: CourtPrice[];
//   status: number;
// }

// export interface CourtClusterSubmit {
//   title: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   courtDetails: CourtDetails[];
// }

const CourtClusterEditPage = observer(() => {
  const { courtClusterStore } = useStore();
  const { getDetailsCourtCluster, selectedCourt, loadingInitialDetailsPage } = courtClusterStore;

  //const {id} = useParams();
  // useEffect(() => {
  //     if (id) {
  //         if (!selectedCourt || (selectedCourt && selectedCourt.id !== Number(id))) {
  //             getDetailsCourtCluster(id).finally();
  //         }
  //     }
  // }, [id, getDetailsCourtCluster])
  const [initial, setInitial] = useState<CourtClusterDetails>({
    title: '',
    description: '',
    startTime: '05:00',
    endTime: '22:00',
    courtDetails: [
      {
        courtPrice: [],
        status: 1,
        courtName: '',
      },
    ],
  });
  return (
    <Skeleton isLoaded={!loadingInitialDetailsPage}>
      <PageHeadingAtoms
        breadCrumb={[
          { title: 'Danh sách cụm sân', to: '/cum-san' },
          { title: `${selectedCourt?.title}`, to: `/cum-san/chi-tiet/${1}` },
          { title: 'Chỉnh sửa', to: `/cum-san/chinh-sua/${selectedCourt?.id}` },
        ]}
      />
      <Card>
        <CardBody>
          <Formik
            initialValues={initial}
            onSubmit={(values) => {
              // handleSubmit(values);
              console.log(values);
              // values.courtDetails.forEach((courtDetail) => {
              //   const courtPriceSubmit: CourtPriceSubmit[] = [];

              //   courtDetail.courtPrice.forEach((cp) => {
              //     courtPriceSubmit.push({
              //       price: cp.price,
              //       startTime: dayjs(cp.startTime).format('HH:mm'),
              //       endTime: dayjs(cp.endTime).format('HH:mm'),
              //     });
              //   });

              // });
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Grid templateColumns={'repeat(24,1fr)'} gap={5}>
                  <GridItem colSpan={12}>
                    <FormControl isRequired={true}>
                      <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                        <FormLabel className="title_label_court">Tên cụm sân</FormLabel>
                        <Input
                          placeholder="Nhập tiêu đề cho cụm sân"
                          type="text"
                          {...props.getFieldProps('title')}
                        />
                      </Grid>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={24}>
                    <FormControl isRequired={true}>
                      <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                        <FormLabel className="title_label_court">Thời gian</FormLabel>
                        <Flex className={'gap-3.5'}>
                          <Badge
                            colorScheme="green"
                            fontSize="1em"
                            borderRadius={'md'}
                            padding="8px 16px"
                          >
                            Giờ bắt đầu
                          </Badge>
                          <TimePicker
                            placeholder={'--:--'}
                            format={'HH:mm'}
                            // {...props.getFieldProps('startTime')}
                            size={'large'}
                            onBlur={() => props.getFieldHelpers('startTime').setTouched(true)} // Ensure you call handleBlur
                            defaultValue={dayjs(props.getFieldProps('startTime').value, 'HH:mm')}
                            onChange={(date) => {
                              props.setFieldValue('startTime', dayjs(date).format('HH:mm'));
                              console.log(dayjs(date).format('HH:mm'));
                            }}
                          />

                          <Badge
                            colorScheme="red"
                            fontSize="1em"
                            borderRadius={'md'}
                            padding="8px 16px"
                          >
                            Giờ kết thúc
                          </Badge>

                          <TimePicker
                            placeholder={'--:--'}
                            format={'HH:mm'}
                            // {...props.getFieldProps('endTime')}
                            size={'large'}
                            onBlur={() => props.getFieldHelpers('endTime').setTouched(true)} // Ensure you call handleBlur
                            defaultValue={dayjs(props.getFieldProps('endTime').value, 'HH:mm')}
                            onChange={(date) => {
                              props.setFieldValue('endTime', dayjs(date).format('HH:mm'));
                              console.log(dayjs(date).format('HH:mm'));
                            }}
                          />
                        </Flex>
                      </Grid>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={12}>
                    <FormControl isRequired={true}>
                      <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                        <FormLabel className="title_label_court">Địa chỉ</FormLabel>
                        <Input
                          placeholder="Nhập địa chỉ"
                          type="text"
                          {...props.getFieldProps('address')}
                        />
                      </Grid>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={24}>
                    <FormControl>
                      <Grid templateColumns="10rem 1fr" alignItems="center" gap={2} mt={2}>
                        <FormLabel className="title_label_court">Ảnh sân</FormLabel>
                        <ImageUpload limit={4} name="images" />
                      </Grid>
                    </FormControl>
                  </GridItem>
                  <GridItem key={'them-san'} colSpan={24}>
                    <Flex direction={'row'} gap={3} alignItems={'center'}>
                      <FormLabel className="title_label_court">Thông tin sân</FormLabel>
                      <Button
                        onClick={() => {
                          const newCourtDetails: CourtDetails = {
                            courtName: '',
                            courtPrice: [
                              {
                                price: 0,
                                endTime: '',
                                startTime: '',
                              },
                            ],
                            status: 1,
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
                          key={'court' + index}
                          templateColumns={'repeat(12,1fr)'}
                          gap={5}
                          className={'bg-white py-2  w-full'}
                        >
                          <GridItem colSpan={1}>{index + 1}</GridItem>
                          <GridItem colSpan={3}>
                            <FormControl>
                              <Input
                                {...props.getFieldProps(`courtDetails[${index}].courtName`)}
                              ></Input>
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={3}>
                            <Flex direction={'row'} gap={2}>
                              <TimePicker
                                placeholder={'Giờ mở cửa'}
                                size={'large'}
                                format={'HH:mm'}
                                defaultValue={
                                  props.getFieldProps(
                                    `courtDetails[${index}].courtPrice.[0].startTime`,
                                  ).value
                                    ? dayjs(
                                        props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[0].startTime`,
                                        ).value,
                                        'HH:mm',
                                      )
                                    : null
                                }
                                onChange={(date) => {
                                  props.setFieldValue(
                                    `courtDetails[${index}].courtPrice.[0].startTime`,
                                    dayjs(date).format('HH:mm'),
                                  );
                                  console.log(dayjs(date).format('HH:mm'));
                                }}
                                onBlur={() =>
                                  props
                                    .getFieldHelpers(
                                      `courtDetails[${index}].courtPrice.[0].startTime`,
                                    )
                                    .setTouched(true)
                                } // Ensure you call handleBlur
                              />
                              <TimePicker
                                placeholder={'Đóng cửa'}
                                size={'large'}
                                format={'HH:mm'}
                                defaultValue={
                                  props.getFieldProps(
                                    `courtDetails[${index}].courtPrice.[0].endTime`,
                                  ).value
                                    ? dayjs(
                                        props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[0].endTime`,
                                        ).value,
                                        'HH:mm',
                                      )
                                    : null
                                }
                                onChange={(date) => {
                                  props.setFieldValue(
                                    `courtDetails[${index}].courtPrice.[0].endTime`,
                                    dayjs(date).format('HH:mm'),
                                  );
                                  console.log(dayjs(date).format('HH:mm'));
                                }}
                                onBlur={() =>
                                  props
                                    .getFieldHelpers(
                                      `courtDetails[${index}].courtPrice.[0].endTime`,
                                    )
                                    .setTouched(true)
                                } // Ensure you call handleBlur
                              />
                            </Flex>
                          </GridItem>
                          <GridItem colSpan={2}>
                            <NumberInput>
                              <InputGroup>
                                <NumberInputField
                                  {...props.getFieldProps(
                                    `courtDetails[${index}].courtPrice.[0].price`,
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
                          <GridItem colSpan={3}>
                            <Center>
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
                              >
                                Xoá khung giờ
                              </Button>
                            </Center>
                          </GridItem>
                        </Grid>

                        {cd.courtPrice.map((_, no) => {
                          if (no > 0) {
                            return (
                              <Grid
                                key={'khoangia' + no}
                                templateColumns={'repeat(12,1fr)'}
                                gap={5}
                                className={'bg-white py-2 w-full'}
                              >
                                <GridItem colSpan={1}></GridItem>
                                <GridItem colSpan={3}></GridItem>
                                <GridItem colSpan={3}>
                                  <Flex direction={'row'} gap={2}>
                                    <TimePicker
                                      placeholder={'Giờ mở cửa'}
                                      size={'large'}
                                      format={'HH:mm'}
                                      defaultValue={
                                        props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[${no}].startTime`,
                                        ).value
                                          ? dayjs(
                                              props.getFieldProps(
                                                `courtDetails[${index}].courtPrice.[${no}].startTime`,
                                              ).value,
                                              'HH:mm',
                                            )
                                          : null
                                      }
                                      onChange={(date) => {
                                        props.setFieldValue(
                                          `courtDetails[${index}].courtPrice.[${no}].startTime`,
                                          dayjs(date).format('HH:mm'),
                                        );
                                        console.log(dayjs(date).format('HH:mm'));
                                      }}
                                      onBlur={() =>
                                        props
                                          .getFieldHelpers(
                                            `courtDetails[${index}].courtPrice.[${no}].startTime`,
                                          )
                                          .setTouched(true)
                                      } // Ensure you call handleBlur
                                    />
                                    <TimePicker
                                      placeholder={'Đóng cửa'}
                                      size={'large'}
                                      format={'HH:mm'}
                                      {...props.getFieldProps(
                                        `courtDetails[${index}].courtPrice.[${no}].endTime`,
                                      )}
                                      defaultValue={
                                        props.getFieldProps(
                                          `courtDetails[${index}].courtPrice.[${no}].endTime`,
                                        ).value
                                          ? dayjs(
                                              props.getFieldProps(
                                                `courtDetails[${index}].courtPrice.[${no}].endTime`,
                                              ).value,
                                              'HH:mm',
                                            )
                                          : null
                                      }
                                      onChange={(date) => {
                                        props.setFieldValue(
                                          `courtDetails[${index}].courtPrice.[${no}].endTime`,
                                          dayjs(date).format('HH:mm'),
                                        );
                                        console.log(dayjs(date).format('HH:mm'));
                                      }}
                                      onBlur={() =>
                                        props
                                          .getFieldHelpers(
                                            `courtDetails[${index}].courtPrice.[${no}].endTime`,
                                          )
                                          .setTouched(true)
                                      } // Ensure you call handleBlur
                                    />
                                  </Flex>
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <NumberInput>
                                    <InputGroup>
                                      <NumberInputField
                                        
                                        {...props.getFieldProps(                                          `courtDetails[${index}].courtPrice.[${no}].price`,
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
                              colorScheme={'orange'}
                              onClick={() => {
                                const newCourtPrice: CourtPrice = {
                                  price: 0,
                                  endTime: '',
                                  startTime: '',
                                };
                                cd.courtPrice.push(newCourtPrice);
                                const newCourtDetails = props.values.courtDetails;
                                setInitial({
                                  ...initial,
                                  courtDetails: newCourtDetails,
                                });
                              }}
                            >
                              Thêm mới
                            </Button>
                          </GridItem>
                          <GridItem colSpan={2}></GridItem>
                          <GridItem colSpan={3}></GridItem>
                        </Grid>
                      </>
                    ))}
                  </GridItem>
                </Grid>

                <FormControl mt="4.75rem" isRequired={true}>
                  <FormLabel className="title_label_court">Mô tả sân</FormLabel>
                  <Box>
                    <Box>
                      <ReactQuillComponent
                        content={props.values.description}
                        onChange={(value) => props.setFieldValue('description', value)}
                      />
                    </Box>
                    <Flex gap="0.78rem" justifyContent="flex-end">
                      <Button className="delete" isLoading={props.isSubmitting} type="button">
                        Xóa
                      </Button>
                      <Button className="save" isLoading={props.isSubmitting} type="submit">
                        Lưu
                      </Button>
                    </Flex>
                  </Box>
                </FormControl>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Skeleton>
  );
});
export default CourtClusterEditPage;
