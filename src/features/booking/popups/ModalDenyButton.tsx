import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton, ModalBody, UnorderedList, ListItem, useToast } from '@chakra-ui/react';
import { BookingForList } from '@/app/models/booking.model';
import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react';
import { convertBookingStartAndEndUTCToG7 } from '@/app/helper/utils';

interface ModalDenyButtonProps {
    booking: BookingForList;
    isOpen: boolean;
    onClose: () => void;
}

const ModalDenyButton = ({ booking, isOpen, onClose }: ModalDenyButtonProps) => {
    const { bookingStore, bookingClusterStore } = useStore()
    const { denyBooking } = bookingClusterStore;
    const toast = useToast();


    const handleDenyBooking = async () => {
        await denyBooking(booking.id, toast).then((data) => {
            if (data.res) {
                bookingStore.bookingRegistry.set(data.res.id, convertBookingStartAndEndUTCToG7(data.res));
            }
        });
    };
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent overflowY={'visible'}>
                    <ModalHeader>TỪ CHỐI ĐƠN</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <UnorderedList className="px-2">
                            <ListItem color={'red'}>
                                Bạn đã chắc chắn từ chối đơn chưa ?
                            </ListItem>
                            <ListItem>
                                Nhấn nút xác nhận ở dưới để từ chối đơn.
                            </ListItem>
                        </UnorderedList>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Thoát
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={() => handleDenyBooking()}>
                            Xác nhận
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default observer(ModalDenyButton);
