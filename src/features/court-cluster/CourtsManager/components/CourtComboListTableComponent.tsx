import { CourtCombo } from '@/app/models/court.model';
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
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
import { FC } from 'react';
import { FieldArray, FormikProps } from 'formik';

interface CourtComboListTableProps {
  formikProps: FormikProps<CourtComboPopupProps>;
}
interface CourtComboPopupProps {
  courtCombos: CourtCombo[];
}
const CourtComboListTable: FC<CourtComboListTableProps> = ({ formikProps }) => {
  const { values, setFieldValue, errors, touched } = formikProps;
  return (
    <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
      <Table className="app-table" variant="simple" padding={0}>
        <Thead>
          <Tr>
            <Th w={'5rem'} py={'1rem'}>
              STT
            </Th>
            <Th w={'15rem'}>Tên hiển thị </Th>
            <Th w={'10rem'}>Thời lượng (tháng)</Th>
            <Th w={'15rem'}>Giá (theo số giờ thuê/tháng)</Th>
            <Th w={'5rem'}></Th>
          </Tr>
        </Thead>
        <Tbody>
          <FieldArray name="courtCombos">
            {({ remove, push }) => (
              <>
                {values.courtCombos.map((courtCombo, index) => (
                  <Tr key={`${index} `}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <FormControl
                        isInvalid={
                          errors.courtCombos?.[index]?.displayName &&
                          touched.courtCombos?.[index]?.displayName
                        }
                      >
                        <Input
                          value={values.courtCombos[index].displayName}
                          onChange={(e) =>
                            setFieldValue(`courtCombos[${index}].displayName`, e.target.value)
                          }
                          placeholder="Nhập tên hiển thị"
                        />
                        <FormErrorMessage>
                          {errors.courtCombos?.[index]?.displayName}
                        </FormErrorMessage>
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl
                        isInvalid={
                          errors.courtCombos?.[index]?.duration &&
                          touched.courtCombos?.[index]?.duration
                        }
                      >
                        <Flex direction={'column'}>
                          <NumberInput
                            value={courtCombo.duration}
                            onChange={(valueString) =>
                              setFieldValue(
                                `courtCombos[${index}].duration`,
                                valueString ? parseFloat(valueString) : '',
                              )
                            }
                          >
                            <InputGroup>
                              <NumberInputField />
                              <InputRightElement width="4.5rem">
                                <Text fontSize="sm" color="gray.500">
                                  Tháng
                                </Text>
                              </InputRightElement>
                            </InputGroup>
                          </NumberInput>
                          <FormErrorMessage>
                            {errors.courtCombos?.[index]?.duration}
                          </FormErrorMessage>
                        </Flex>
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl
                        isInvalid={
                          errors.courtCombos?.[index]?.totalPrice &&
                          touched.courtCombos?.[index]?.totalPrice
                        }
                      >
                        <Flex direction={'column'}>
                          <NumberInput
                        
                            value={courtCombo.totalPrice}
                            onChange={(valueString) =>
                              setFieldValue(
                                `courtCombos[${index}].totalPrice`,
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
                          <FormErrorMessage>{errors.courtCombos?.[index]?.totalPrice}</FormErrorMessage>
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
                      onClick={() => push({ displayName: '', duration: 1, totalPrice: 0 })}
                    >
                      Thêm combo
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

export default CourtComboListTable;
