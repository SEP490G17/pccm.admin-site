import { CheckIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Center,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const BookingAcceptedComponent = () => {
  return (
    <>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="px-4 py-2 bg-teal-400  rounded-t-lg cursor-pointer mb-2"
        style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
      >
        <GridItem colSpan={20} as={Link} to={'/booking/chi-tiet/1'}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(24,1fr)'} className="w-full">
              <GridItem colSpan={1}>STT</GridItem>
              <GridItem colSpan={4}>Họ và tên</GridItem>
              <GridItem colSpan={3}>Số điện thoại</GridItem>
              <GridItem colSpan={3}>Giờ chơi</GridItem>
              <GridItem colSpan={4}>Ngày chơi</GridItem>
              <GridItem colSpan={4}>Ngày tạo đơn</GridItem>
              <GridItem colSpan={3}>Thanh toán</GridItem>
              <GridItem colSpan={2} className="flex items-center ">
                Giá đơn
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4} className="pl-12">
          Hành động
        </GridItem>
      </Grid>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="p-4 rounded-lg cursor-pointer"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <GridItem colSpan={20} as={Link} to={'/booking/chi-tiet/1'}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(24,1fr)'} className="w-full">
              <GridItem colSpan={1}>1</GridItem>
              <GridItem colSpan={4}>Nguyễn Văn A</GridItem>
              <GridItem colSpan={3}>0865869202</GridItem>
              <GridItem colSpan={3}>07:00 - 08:00</GridItem>
              <GridItem colSpan={4}>Ngày 24/12/2024</GridItem>
              <GridItem colSpan={4}>Ngày 24/12/2024</GridItem>
              <GridItem colSpan={3}>
                <Badge fontSize="0.8em" colorScheme="green">
                  Đã thanh toán
                </Badge>
              </GridItem>

              <GridItem colSpan={2} className="flex items-center ">
                400 000 VND
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4} className="flex justify-end">
          <Center gap={2}>
            <Button colorScheme="teal">Hoàn thành</Button>
            <Button colorScheme="red">Huỷ lịch</Button>
          </Center>
        </GridItem>
      </Grid>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="p-4 rounded-lg cursor-pointer"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <GridItem colSpan={20} as={Link} to={'/booking/chi-tiet/1'}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(24,1fr)'} className="w-full">
              <GridItem colSpan={1}>2</GridItem>
              <GridItem colSpan={4}>Nguyễn Văn A</GridItem>
              <GridItem colSpan={3}>0865869202</GridItem>
              <GridItem colSpan={3}>07:00 - 08:00</GridItem>
              <GridItem colSpan={4}>Ngày 24/12/2024</GridItem>
              <GridItem colSpan={4}>Ngày 24/12/2024</GridItem>
              <GridItem colSpan={3}>
                <Badge fontSize="0.8em" colorScheme="blue">
                  Chờ thanh toán
                </Badge>
              </GridItem>

              <GridItem colSpan={2} className="flex items-center ">
                400 000 VND
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4} className="flex justify-end">
          <Center gap={2}>
            <Tooltip label="Ấn để xác nhận đã thanh toán" placement="top" hasArrow bg={'blue.500'}>
              <Button colorScheme="blue">Thanh toán</Button>
            </Tooltip>
            <Tooltip label="Ấn để huỷ lịch" placement="top" hasArrow bg={'red.500'}>
              <Button colorScheme="red">Huỷ lịch</Button>
            </Tooltip>
          </Center>
        </GridItem>
      </Grid>

      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="p-4 rounded-lg cursor-pointer"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <GridItem colSpan={20} as={Link} to={'/'}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(24,1fr)'} className="w-full">
              <GridItem colSpan={1}>3</GridItem>
              <GridItem colSpan={4}>Nguyễn Văn A</GridItem>
              <GridItem colSpan={3}>0865869202</GridItem>
              <GridItem colSpan={3}>07:00 - 08:00</GridItem>
              <GridItem colSpan={4}>Ngày 24/12/2024</GridItem>
              <GridItem colSpan={4}>Ngày 24/12/2024</GridItem>
              <GridItem colSpan={3}>
                <Badge fontSize="0.8em" colorScheme="green">
                  Đã thanh toán
                </Badge>
              </GridItem>

              <GridItem colSpan={2} className="flex items-center ">
                400 000 VND
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4} className="flex justify-end items-center pl-12">
          <Tag
            size={'lg'}
            className="w-full h-10 items-center flex justify-center"
            variant="subtle"
            colorScheme="green"
            gap={2}
          >
            <TagLabel>Đã hoàn thành</TagLabel>
            <TagLeftIcon boxSize="12px" as={CheckIcon} color={'green.800'} />
          </Tag>
        </GridItem>
      </Grid>
    </>
  );
};

export default BookingAcceptedComponent;
