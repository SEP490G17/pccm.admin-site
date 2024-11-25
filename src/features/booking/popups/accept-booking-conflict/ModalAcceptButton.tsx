import { useEffect } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton, ModalBody, Center, Grid, GridItem, Heading, UnorderedList, ListItem, useToast, Skeleton } from '@chakra-ui/react';
import { BookingConflict, BookingForList } from '@/app/models/booking.model';
import { useStore } from '@/app/stores/store';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import BookingConflictGridItem from './BookingConflictGridItem';
import { convertBookingStartAndEndUTCToG7 } from '@/app/helper/utils';

interface ModalAcceptButtonProps {
    booking: BookingForList;
    isOpen: boolean;
    onClose: () => void;
}

const ModalAcceptButton = ({ booking, isOpen, onClose }: ModalAcceptButtonProps) => {
    const { bookingStore, bookingClusterStore } = useStore()
    const { acceptedBooking, denyConflictBooking } = bookingClusterStore;
    const toast = useToast();
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && booking && booking.playTime) {
            const [startTime, endTime] = booking.playTime.split(' - ');
            const bookingConflict: BookingConflict = {
                BookingId: booking.id,
                CourtId: booking.courtId,
                FromDate: dayjs(booking.startDay, 'DD/MM/YYYY').toISOString(),
                FromTime: dayjs(startTime, 'HH:mm').format('HH:mm:ss'),
                ToTime: dayjs(endTime, 'HH:mm').format('HH:mm:ss'),
            };

            bookingStore.getBookingConflict(bookingConflict);
        }
    }, [isOpen, booking, bookingStore]);

    const handleAccepted = async () => {
        await acceptedBooking(booking.id, toast).then((data) => {
            if (data.res) {
                bookingStore.bookingRegistry.set(data.res.id, convertBookingStartAndEndUTCToG7(data.res));
            }
        });
    };

    const handleDenyBookingConflict = async (data: number[]) => {
        await denyConflictBooking(data, toast).then((data) => {
            if (data.res) {
                data.res.forEach(booking => bookingStore.bookingRegistry.set(booking.id, convertBookingStartAndEndUTCToG7(booking)))
            }
        });
    };
    const ids: number[] = [];
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="7xl">
                <ModalOverlay />
                <ModalContent overflowY={'visible'}>
                    <ModalHeader>XÁC THỰC</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Heading className='mb-4' size={'lg'}>Các đơn trùng lịch</Heading>
                        <Grid
                            templateColumns={'repeat(24, 1fr)'}
                            className="p-4 bg-teal-400 rounded-t-lg cursor-pointer mb-2"
                            style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                        >
                            <GridItem colSpan={22}>
                                <Center className="h-full">
                                    <Grid templateColumns={'repeat(23, 1fr)'} className="w-full">
                                        <GridItem colSpan={1}>STT</GridItem>
                                        <GridItem colSpan={2}>Sân</GridItem>
                                        <GridItem colSpan={3}>Họ và tên</GridItem>
                                        <GridItem colSpan={3}>Số điện thoại</GridItem>
                                        <GridItem colSpan={3}>Giờ chơi</GridItem>
                                        <GridItem colSpan={3}>Ngày bắt đầu</GridItem>
                                        <GridItem colSpan={3}>Ngày kết thúc</GridItem>
                                        <GridItem colSpan={2}>Thể loại</GridItem>
                                        <GridItem colSpan={2}>Giá đơn</GridItem>
                                    </Grid>
                                </Center>
                            </GridItem>
                            <GridItem colSpan={2}>Hành động</GridItem>
                        </Grid>
                        <Skeleton isLoaded={!bookingStore.loadingConflict}>
                            {bookingStore.bookingConflict.map((booking, index) => {
                                ids.push(booking.id);
                                return (
                                    <BookingConflictGridItem
                                        key={booking.id}
                                        bookingToday={booking}
                                        index={index}
                                    />
                                );
                            })}
                        </Skeleton>

                        <Heading size={'lg'} className="px-2 mt-6">Xác nhận đơn</Heading>
                        <UnorderedList className="px-2 mt-2">
                            <ListItem color={'red'}>
                                Để xác nhận đơn bạn cần phải từ chối các đơn trùng lịch ở trên.
                            </ListItem>
                            <ListItem>
                                Nhấn nút xác nhận ở dưới để từ chối tất cả các đơn đã trùng lịch ở trên và xác nhận đơn này.
                            </ListItem>
                        </UnorderedList>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Thoát
                        </Button>
                        <Button disabled={bookingStore.loadingConflict} colorScheme="blue" mr={3} onClick={() => {
                            handleAccepted();
                            if (ids.length > 0) {
                                handleDenyBookingConflict(ids)
                            }
                        }}>
                            Xác nhận
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    );
}

export default observer(ModalAcceptButton);
