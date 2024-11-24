import { FastField, FieldArray, FormikProps } from 'formik';
import React, { FC } from 'react';
import { CourtClusterCreatePage2Formik, CourtCreateModel } from '../CourtClusterCreatePage';
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { CourtPriceModel } from '../../CourtsManager/popup/CourtCreatePopup';

interface CourtPriceArrayFieldProps {
  props: FormikProps<CourtClusterCreatePage2Formik>;
  name: string;
  court: CourtCreateModel;
  courtIndex: number;
}

const CourtPriceArrayField: FC<CourtPriceArrayFieldProps> = ({
  props,
  name,
  court,
  courtIndex,
}) => {
  return (
    <FieldArray name={name}>
      {({ remove, push }) => (
        <>
          {court.courtPrice.map((data, index) => {
            if (index > 0) {
              return (
                <Grid
                  key={`courtPrice${courtIndex}${index}`}
                  templateColumns={'repeat(12,1fr)'}
                  gap={5}
                  className={`bg-white py-2  w-full`}
                >
                  <GridItem colSpan={1}></GridItem>
                  <GridItem colSpan={3}></GridItem>
                  <GridItem colSpan={3}>
                    <Flex direction={'row'} gap={2}>
                      <FormControl
                        isInvalid={
                          !!props.errors.courtDetails?.[courtIndex]?.courtPrice?.[index]?.fromTime
                        }
                      >
                        <TimePicker
                          key={`from${index}`}
                          placeholder={'Từ'}
                          size={'large'}
                          format={'HH:mm'}
                          defaultValue={
                            props.getFieldProps(
                              `courtDetails[${courtIndex}].courtPrice.[${index}].fromTime`,
                            ).value
                              ? dayjs(
                                  props.getFieldProps(
                                    `courtDetails[${courtIndex}].courtPrice.[${index}].fromTime`,
                                  ).value,
                                  'HH:mm',
                                )
                              : null
                          }
                          onChange={(date) => {
                            props.setFieldValue(
                              `courtDetails[${courtIndex}].courtPrice.[${index}].fromTime`,
                              dayjs(date).format('HH:mm:ss'),
                            );
                          }}
                          onBlur={() =>
                            props
                              .getFieldHelpers(
                                `courtDetails[${courtIndex}].courtPrice.[${index}].fromTime`,
                              )
                              .setTouched(true)
                          } // Ensure you call handleBlur
                        />
                        <FormErrorMessage>
                          {props.errors.courtDetails?.[courtIndex]?.courtPrice?.[index]?.fromTime}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!props.errors.courtDetails?.[courtIndex]?.courtPrice?.[index]?.toTime
                        }
                      >
                        <TimePicker
                          key={`to${index}`}
                          placeholder={'Đến'}
                          size={'large'}
                          format={'HH:mm'}
                          defaultValue={
                            props.getFieldProps(
                              `courtDetails[${courtIndex}].courtPrice.[${index}].toTime`,
                            ).value
                              ? dayjs(
                                  props.getFieldProps(
                                    `courtDetails[${courtIndex}].courtPrice.[${index}].toTime`,
                                  ).value,
                                  'HH:mm',
                                )
                              : null
                          }
                          onChange={(date) => {
                            props.setFieldValue(
                              `courtDetails[${courtIndex}].courtPrice.[${index}].toTime`,
                              dayjs(date).format('HH:mm:ss'),
                            );
                          }}
                          onBlur={() =>
                            props
                              .getFieldHelpers(
                                `courtDetails[${courtIndex}].courtPrice.[${index}].toTime`,
                              )
                              .setTouched(true)
                          } // Ensure you call handleBlur
                        />

                        <FormErrorMessage>
                          {props.errors.courtDetails?.[courtIndex]?.courtPrice?.[index]?.toTime}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FastField name={`courtDetails[${courtIndex}].courtPrice[${index}].price`}>
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            !!form.errors.courtDetails?.[courtIndex]?.courtPrice?.[index].price
                          }
                        >
                          <NumberInput>
                            <InputGroup>
                              <NumberInputField {...field} />
                              <InputRightElement width="4.5rem">
                                <Text fontSize="sm" color="gray.500">
                                  VNĐ
                                </Text>
                              </InputRightElement>
                            </InputGroup>
                          </NumberInput>
                          <FormErrorMessage>
                            {form.errors.courtDetails?.[courtIndex]?.courtPrice?.[index].price}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </FastField>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Center gap={3}>
                      <Button colorScheme={'red'} onClick={() => remove(index)}>
                        Xoá khung giờ
                      </Button>
                    </Center>
                  </GridItem>
                </Grid>
              );
            }
          })}
          <Grid templateColumns={'repeat(12,1fr)'} gap={5} className={'bg-white py-2  text-white'}>
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={3}>
             
            </GridItem>
            <GridItem colSpan={3}>
              <Button
                size={'sm'}
                colorScheme={'teal'}
                onClick={() => {
                  const newCourtPrice: CourtPriceModel = {
                    price: 0,
                    toTime: '',
                    fromTime: '',
                  };
                  push(newCourtPrice);
                }}
              >
                Thêm khung giờ
              </Button>
            </GridItem>
            <GridItem colSpan={2}></GridItem>
            <GridItem colSpan={3}></GridItem>
          </Grid>
        </>
      )}
    </FieldArray>
  );
};

export default CourtPriceArrayField;
