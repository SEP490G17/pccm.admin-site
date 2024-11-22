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
import { FastField, FieldArray, FormikProps } from 'formik';
import { FC } from 'react';
import { CourtCreateFormik } from '../popup/CourtCreatePopup';
import dayjs from 'dayjs';
interface CourtPriceFieldComponentProps {
  props: FormikProps<CourtCreateFormik>;
}

const CourtPriceFieldComponent: FC<CourtPriceFieldComponentProps> = ({ props }) => {
  return (
    <FieldArray name="courtDetails.courtPrice">
      {({ remove, push }) => (
        <>
          {props.values.courtDetails?.courtPrice?.map((priceItem, priceIndex) => {
            if (priceIndex === 0) {
              return (
                <GridItem className="p-0" colSpan={9} key={priceIndex}>
                  <Grid templateColumns={'repeat(9,1fr)'} gap={5}>
                    <GridItem colSpan={4}>
                      <Flex direction={'row'} gap={2}>
                        <FormControl
                          isInvalid={
                            !!props.errors.courtDetails?.courtPrice?.[priceIndex]?.fromTime
                          }
                        >
                          <TimePicker
                            popupStyle={{ zIndex: 99999 }}
                            placeholder={'Từ'}
                            size={'large'}
                            format={'HH:mm'}
                            onChange={(date) => {
                              props.setFieldValue(
                                `courtDetails.courtPrice[${priceIndex}].fromTime`,
                                dayjs(date).format('HH:mm:ss'),
                              );
                            }}
                            onBlur={() =>
                              props
                                .getFieldHelpers(`courtDetails.courtPrice[${priceIndex}].fromTime`)
                                .setTouched(true)
                            } // Ensure you call handleBlur
                          />
                          <FormErrorMessage>
                            {props.errors.courtDetails?.courtPrice?.[priceIndex]?.fromTime}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!props.errors.courtDetails?.courtPrice?.[priceIndex]?.toTime}
                        >
                          <TimePicker
                            popupStyle={{ zIndex: 99999 }}
                            placeholder={'Đến'}
                            size={'large'}
                            format={'HH:mm'}
                            onChange={(date) => {
                              props.setFieldValue(
                                `courtDetails.courtPrice[${priceIndex}].toTime`,
                                dayjs(date).format('HH:mm:ss'),
                              );
                            }}
                            onBlur={() =>
                              props
                                .getFieldHelpers(`courtDetails.courtPrice[${priceIndex}].toTime`)
                                .setTouched(true)
                            } // Ensure you call handleBlur
                          />

                          <FormErrorMessage>
                            {props.errors.courtDetails?.courtPrice?.[priceIndex]?.toTime}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </GridItem>
                    <GridItem colSpan={3}>
                      <FastField name={`courtDetails.courtPrice[${priceIndex}].price`}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={!!form.errors.courtDetails?.courtPrice?.[priceIndex]?.price}
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
                              {props.errors.courtDetails?.courtPrice?.[priceIndex]?.price}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </FastField>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Button colorScheme="red" size={'sm'} onClick={() => remove(priceIndex)}>
                        Xoá
                      </Button>
                    </GridItem>
                  </Grid>
                </GridItem>
              );
            } else {
              return (
                <GridItem colSpan={12} key={priceIndex} className="p-0">
                  <Grid gap={5} templateColumns={'repeat(12,1fr)'}>
                    <GridItem colSpan={3}></GridItem>
                    <GridItem colSpan={4}>
                      <Flex direction={'row'} gap={2}>
                        <FormControl
                          isInvalid={
                            !!props.errors.courtDetails?.courtPrice?.[priceIndex]?.fromTime
                          }
                        >
                          <TimePicker
                            popupStyle={{ zIndex: 99999 }}
                            placeholder={'Từ'}
                            size={'large'}
                            format={'HH:mm'}
                            onChange={(date) => {
                              props.setFieldValue(
                                `courtDetails.courtPrice[${priceIndex}].fromTime`,
                                dayjs(date).format('HH:mm:ss'),
                              );
                            }}
                            onBlur={() =>
                              props
                                .getFieldHelpers(`courtDetails.courtPrice[${priceIndex}].fromTime`)
                                .setTouched(true)
                            } // Ensure you call handleBlur
                          />
                          <FormErrorMessage>
                            {props.errors.courtDetails?.courtPrice?.[priceIndex]?.fromTime}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!props.errors.courtDetails?.courtPrice?.[priceIndex]?.toTime}
                        >
                          <TimePicker
                            popupStyle={{ zIndex: 99999 }}
                            placeholder={'Đến'}
                            size={'large'}
                            format={'HH:mm'}
                            onChange={(date) => {
                              props.setFieldValue(
                                `courtDetails.courtPrice[${priceIndex}].toTime`,
                                dayjs(date).format('HH:mm:ss'),
                              );
                            }}
                            onBlur={() =>
                              props
                                .getFieldHelpers(`courtDetails.courtPrice[${priceIndex}].toTime`)
                                .setTouched(true)
                            } // Ensure you call handleBlur
                          />

                          <FormErrorMessage>
                            {props.errors.courtDetails?.courtPrice?.[priceIndex]?.toTime}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </GridItem>
                    <GridItem colSpan={3}>
                      <FastField name={`courtDetails.courtPrice[${priceIndex}].price`}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={!!form.errors.courtDetails?.courtPrice?.[priceIndex]?.price}
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
                              {form.errors.courtDetails?.courtPrice?.[priceIndex]?.price}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </FastField>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Button colorScheme="red" size={'sm'} onClick={() => remove(priceIndex)}>
                        Xoá
                      </Button>
                    </GridItem>
                  </Grid>
                </GridItem>
              );
            }
          })}
          <GridItem colSpan={12}>
            <Grid templateColumns={'repeat(12,1fr)'}>
              <GridItem colSpan={3}></GridItem>
              <GridItem colSpan={9}>
                <Center>
                  <Button onClick={() => push({ fromTime: '', toTime: '', price: 0 })}>
                    Thêm giá
                  </Button>
                </Center>
              </GridItem>
            </Grid>
          </GridItem>
        </>
      )}
    </FieldArray>
  );
};

export default CourtPriceFieldComponent;
