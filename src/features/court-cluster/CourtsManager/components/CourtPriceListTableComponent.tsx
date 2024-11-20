import { CourtPriceResponse } from '@/app/models/court.model';
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { TimePicker } from 'antd';
import { FC } from 'react';
import dayjs from 'dayjs';
import { FieldArray, FormikProps } from 'formik';

interface CourtPriceListTableProps {
  formikProps: FormikProps<CourtPricePopupProps>;
}
interface CourtPricePopupProps {
  courtPrices: CourtPriceResponse[];
}
const CourtPriceListTable: FC<CourtPriceListTableProps> = ({ formikProps }) => {
  const { values, setFieldValue, errors, touched } = formikProps;
  return (
    <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
      <Table className="app-table" variant="simple" padding={0}>
        <Thead>
          <Tr>
            <Th w={'5rem'} py={'1rem'}>
              STT
            </Th>
            <Th w={'10rem'}>Từ </Th>
            <Th w={'10rem'}>Đến</Th>
            <Th w={'15rem'}>Giá</Th>
            <Th w={'10rem'}></Th>
          </Tr>
        </Thead>
        <Tbody>
          <FieldArray name="courtPrices">
            {({ remove, push }) => (
              <>
                {values.courtPrices.map((courtPrice, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>

                    {/* From Time */}
                    <Td>
                      <FormControl
                        isInvalid={
                          errors.courtPrices?.[index]?.fromTime &&
                          touched.courtPrices?.[index]?.fromTime
                        }
                      >
                        <Flex direction={'column'}>
                          <TimePicker
                            placeholder="Select Time"
                            format="HH:mm"
                            className="h-10"
                            popupStyle={{ zIndex: 999999 }}
                            value={courtPrice.fromTime ? dayjs(courtPrice.fromTime, 'HH:mm') : null}
                            onChange={(time) =>
                              setFieldValue(
                                `courtPrices[${index}].fromTime`,
                                time ? time.format('HH:mm:ss') : '',
                              )
                            }
                          />
                          <FormErrorMessage>
                            {errors.courtPrices?.[index]?.fromTime}
                          </FormErrorMessage>
                        </Flex>
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl
                        isInvalid={
                          errors.courtPrices?.[index]?.toTime &&
                          touched.courtPrices?.[index]?.toTime
                        }
                      >
                        <Flex direction={'column'}>
                          <TimePicker
                            placeholder="Select Time"
                            format="HH:mm"
                            className="h-10"
                            popupStyle={{ zIndex: 999999 }}
                            value={courtPrice.toTime ? dayjs(courtPrice.toTime, 'HH:mm') : null}
                            onChange={(time) =>
                              setFieldValue(
                                `courtPrices[${index}].toTime`,
                                time ? time.format('HH:mm:ss') : '',
                              )
                            }
                          />
                          <FormErrorMessage>{errors.courtPrices?.[index]?.toTime}</FormErrorMessage>
                        </Flex>
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl
                        isInvalid={
                          errors.courtPrices?.[index]?.toTime &&
                          touched.courtPrices?.[index]?.toTime
                        }
                      >
                        <Flex direction={'column'}>
                          <NumberInput
                            value={courtPrice.price.toLocaleString('vn')}
                            onChange={(valueString) =>
                              setFieldValue(
                                `courtPrices[${index}].price`,
                                valueString ? parseFloat(valueString) : '',
                              )
                            }
                          >
                            <InputGroup>
                              <NumberInputField />
                              <InputRightElement width="4.5rem">
                                <Text fontSize="sm" color="gray.500">
                                  VNĐ
                                </Text>
                              </InputRightElement>
                            </InputGroup>
                          </NumberInput>
                          <FormErrorMessage>{errors.courtPrices?.[index]?.price}</FormErrorMessage>
                        </Flex>
                      </FormControl>
                    </Td>

                    {/* Delete Row */}
                    <Td>
                      <Center>
                        <Button colorScheme="red" onClick={() => remove(index)}>
                          Xoá
                        </Button>
                      </Center>
                    </Td>
                  </Tr>
                  
                ))}

                {/* Add New Price */}
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    <Button
                      colorScheme="teal"
                      onClick={() => push({ fromTime: '', toTime: '', price: '' })}
                    >
                      Thêm giá mới
                    </Button>
                  </Td>
                </Tr>
               
              </>
            )}
          </FieldArray>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CourtPriceListTable;
