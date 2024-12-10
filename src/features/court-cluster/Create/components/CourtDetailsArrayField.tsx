import { FastField, FieldArray, FormikProps } from 'formik';
import { CourtClusterCreatePage2Formik, CourtCreateModel } from '../CourtClusterCreatePage';
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { TimePicker } from 'antd';
import CourtPriceArrayField from './CourtPriceArrayField';
interface ICourtDetailsArrayFormik {
  props: FormikProps<CourtClusterCreatePage2Formik>;
}
const CourtDetailsArrayField = ({ props }: ICourtDetailsArrayFormik) => {
  return (
    <FieldArray name="courtDetails">
      {({ remove, push }) => (
        <GridItem colSpan={24}>
          <Flex direction={'row'} gap={3} alignItems={'center'} className="justify-between">
            <FormLabel className="title_label_court">Thông tin sân</FormLabel>
            <Button
              colorScheme="teal"
              onClick={() => {
                const newCourtDetails: CourtCreateModel = {
                  courtName: '',
                  courtPrice: [
                    {
                      price: 0,
                      toTime: '',
                      fromTime: '',
                    },
                  ],
                };
                push(newCourtDetails);
              }}
            >
              Thêm sân
            </Button>
          </Flex>
          {typeof props.errors.courtDetails === 'string' && (
            <p className="text-red-500">{props.errors.courtDetails}</p>
          )}
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
            <GridItem className={'rounded-tr-md bg-primary-700  px-4 py-2'} colSpan={3}></GridItem>
          </Grid>
        
          {props.values.courtDetails.map((data, index) => {
            return (
              <Grid
                templateColumns={'repeat(12,1fr)'}
                gap={5}
                className={`bg-white py-2  w-full`}
                key={index}
              >
                {props.errors.courtDetails?.[index]?.courtPrice &&
                  typeof props.errors.courtDetails?.[index]?.courtPrice === 'string' && (
                    <GridItem colSpan={12}>
                      <Grid templateColumns={'repeat(12,1fr)'}>
                        <GridItem colSpan={1}></GridItem>
                        <GridItem colSpan={11}>
                          <div className="text-red-500">
                            *Lưu ý: {props.errors.courtDetails?.[index]?.courtPrice}
                          </div>
                        </GridItem>
                      </Grid>
                    </GridItem>
                  )}
                <GridItem colSpan={1}>
                  <Center className="items-center justify-center h-full">{index + 1}</Center>
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
                        <Input {...field} placeholder="Tên sân"></Input>
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
                      isInvalid={!!props.errors.courtDetails?.[index]?.courtPrice?.[0]?.fromTime}
                    >
                      <TimePicker
                        key={`from${index}`}
                        placeholder={'Từ'}
                        size={'large'}
                        format={'HH:mm'}
                        defaultValue={
                          props.getFieldProps(`courtDetails[${index}].courtPrice.[0].fromTime`)
                            .value
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
                        }}
                        onBlur={() =>
                          props
                            .getFieldHelpers(`courtDetails[${index}].courtPrice.[0].fromTime`)
                            .setTouched(true)
                        } // Ensure you call handleBlur
                      />
                      <FormErrorMessage>
                        {props.errors.courtDetails?.[index]?.courtPrice?.[0]?.fromTime}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!props.errors.courtDetails?.[index]?.courtPrice?.[0]?.toTime}
                    >
                      <TimePicker
                        key={`to${index}`}
                        placeholder={'Đến'}
                        size={'large'}
                        format={'HH:mm'}
                        defaultValue={
                          props.getFieldProps(`courtDetails[${index}].courtPrice.[0].toTime`).value
                            ? dayjs(
                                props.getFieldProps(`courtDetails[${index}].courtPrice.[0].toTime`)
                                  .value,
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
                            .getFieldHelpers(`courtDetails[${index}].courtPrice.[0].toTime`)
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
                    <Button colorScheme={'red'} onClick={() => remove(index)}>
                      Xoá sân
                    </Button>
                  </Center>
                </GridItem>
                <GridItem colSpan={12}>
                  <CourtPriceArrayField
                    court={data}
                    courtIndex={index}
                    name={`courtDetails[${index}].courtPrice`}
                    props={props}
                  />
                </GridItem>
              </Grid>
            );
          })}
        </GridItem>
      )}
    </FieldArray>
  );
};

export default CourtDetailsArrayField;
