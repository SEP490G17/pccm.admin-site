import { BookingRecent } from "@/app/models/booking.model";
import { Avatar, Box, Button, Divider, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";

interface IProps {
    data?: BookingRecent[]
}

export default function OrderActivity({ data }: IProps) {
    return (
        <Flex direction="column" gap={4} width={'100%'} position="relative" top={0}>
            <Flex align="center" justify="space-between" gap={8}>
                <Heading size="md" color="primary.500">
                    Lượt đặt gần đây
                </Heading>
                <Button variant="link" color="gray.500">
                    Tất cả
                </Button>
            </Flex>
            <List spacing={4}>
                {data?.map((booking, index) => (
                    <Box key={index}>
                        <Divider my={2} />
                        <ListItem>
                            <Flex align="center" justify="space-between">
                                <Flex align="center" gap={4}>
                                    <Avatar
                                        src={booking.imageUrl}
                                        size="md"
                                    />
                                    <Box>
                                        <Text fontWeight="bold">{booking.fullName}</Text>
                                        <Text color="gray.500">
                                            Đã đặt {booking.courtName} {booking.courtClusterName}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Text color="gray.400">
                                    {Math.floor(Math.random() * (40 - 1) + 1)} phút trước
                                </Text>
                            </Flex>
                        </ListItem>
                        {index < data.length - 1 && <Divider my={2} />}
                    </Box>
                ))}
            </List>
        </Flex>
    );
}
