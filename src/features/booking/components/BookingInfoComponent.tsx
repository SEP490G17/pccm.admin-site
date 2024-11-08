import {
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { FC } from 'react';

interface BookingInfoComponentProps {}

const BookingInfoComponent: FC<BookingInfoComponentProps> = ({}) => {
  return (
    <>
      <Grid templateColumns={'repeat(24, 1fr)'} className='min-h-[30rem]' gap={2}>
        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Họ và tên:</Text>
        </GridItem>

        <GridItem colSpan={21} className="text-start">
          <Text fontSize={'xl'} fontWeight={'thin'}>
            Nguyễn Văn A
          </Text>
        </GridItem>

        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Số điện thoại:</Text>
        </GridItem>

        <GridItem colSpan={21} className="text-start">
          <Text fontSize={'xl'} fontWeight={'thin'}>
            0865869202
          </Text>
        </GridItem>

        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Giờ thuê:</Text>
        </GridItem>

        <GridItem colSpan={21} className="text-start">
          <Text fontSize={'xl'} fontWeight={'thin'}>
            07h-09h
          </Text>
        </GridItem>

        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Ngày thuê:</Text>
        </GridItem>

        <GridItem colSpan={21} className="text-start">
          <Text fontSize={'xl'} fontWeight={'thin'}>
            Ngày 14/04/2024
          </Text>
        </GridItem>

        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Trạng thái:</Text>
        </GridItem>

        <GridItem colSpan={21} className="text-start">
          <Text fontSize={'xl'} fontWeight={'thin'}>
            <Badge colorScheme="red" fontSize={'1rem'}>
              Đang chờ thanh toán
            </Badge>
          </Text>
        </GridItem>

        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Danh sách Order: </Text>
        </GridItem>
        <GridItem colSpan={21}>
            <Button colorScheme="teal">Tạo Order</Button>
        </GridItem>
        <GridItem colSpan={24}>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>STT</Th>
                  <Th>Ngày tạo</Th>
                  <Th>Trạng thái</Th>
                  <Th>Tổng giá</Th>
                  <Th>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr className='cursor-pointer'>
                  <Td>1</Td>
                  <Td>07:00, Ngày 14/04/2024</Td>
                  <Td>
                    <Badge colorScheme="red">Chưa thanh toán</Badge>
                  </Td>
                  <Td>200 000 VND</Td>
                  <Td>
                    <Flex gap={4}>
                      <Button colorScheme="blue">Chi tiết</Button>
                      <Button colorScheme="red">Hủy đơn</Button>
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
        <GridItem colSpan={24} className='mt-10'>
          <Flex gap={4} className="float-end">
            <Button colorScheme="blue">Thanh toán</Button>
            <Button colorScheme="red">Hủy lịch</Button>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default BookingInfoComponent;
