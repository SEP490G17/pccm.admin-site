import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Spacer,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TfiReload } from 'react-icons/tfi';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';

const OrderActivity = observer(() => {
  const { statisticStore } = useStore();
  const { getBookingRecent, bookingRecent, loadingBookingRecent } = statisticStore;


  return (
    <Flex direction="column" gap={4} width={'100%'} position="relative" top={0}>
      <Flex align="center" justify="space-between" gap={8}>
        <Heading size="md" color="primary.500">
          Lượt đặt gần đây
        </Heading>
        <Tooltip label={'Tải lại'} placement="top">
          <IconButton bg={'transparent'} icon={<TfiReload />} aria-label="Tải lại" onClick={getBookingRecent} />
        </Tooltip>
      </Flex>
      <Skeleton isLoaded={!loadingBookingRecent}>
        <List spacing={4} mt={3}>
          {bookingRecent?.map((booking, index) => (
            <Box key={index}>
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={4}>
                    <Avatar src={booking.imageUrl} size="md" />
                    <Box>
                      <Text fontWeight="bold">{booking.fullName}</Text>
                      <Text color="gray.500">
                        Đã đặt {booking.courtName} {booking.courtClusterName}
                      </Text>
                    </Box>
                  </Flex>
                  {/* <Text color="gray.400">
                                    {Math.floor(Math.random() * (40 - 1) + 1)} phút trước
                                </Text> */}
                </Flex>
              </ListItem>
              <Divider my={2} />
            </Box>
          ))}
        </List>
      </Skeleton>
      <Spacer/>
      <Flex className="justify-end">
        <Button as={Link} to={'/booking'} variant="link" color="gray.500">
          Tất cả
        </Button>
      </Flex>
    </Flex>
  );
});
export default OrderActivity;
