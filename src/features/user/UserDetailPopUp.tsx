import {
    Flex,
    Avatar,
    Text,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Skeleton,
} from '@chakra-ui/react';
import './style/UserDetailPopUp.scss';
import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react-lite';

interface UserDetailPopUpProps {
    isOpen: boolean;
    onClose: () => void;
}

const renderStatus = (status: string) => {
    let color = '';
    switch (status) {
        case 'Hoạt động':
            color = 'var(--primary-color-600)';
            break;
        case 'Không hoạt động':
            color = 'red';
            break;
        case 'Tạm thời khóa':
            color = 'gray';
            break;
        default:
            color = 'black';
    }
    return <Box color={color}>{status}</Box>;
};

function UserDetailPopUp({ isOpen, onClose }: UserDetailPopUpProps) {
    const { userStore } = useStore();
    const { selectedUser } = userStore;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent className="modalContent" maxW="45%">
                <Skeleton isLoaded={!userStore.loadingDetail}>
                    <ModalHeader className="header">
                        <Box></Box>
                        <Text as="span" ml={2} className="status">
                            {renderStatus(selectedUser?.lockoutEnable ? 'Không hoạt động' : 'Hoạt động')}
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex className="avatarSection2">
                            {/* Sử dụng fallback image nếu không có imageUrl */}
                            <Avatar
                                size="2xl"
                                src={selectedUser?.imageUrl || '/path/to/default/avatar.jpg'} // Fallback image 
                                name={selectedUser?.fullName}
                                className="avatar"
                            />
                            <Flex direction="column" w="60%" pl={2}>
                                <Flex justify="space-between" mb={2} className="contactItem">
                                    <Text className="label">Họ và tên:</Text>
                                    <Text as="span">{selectedUser?.fullName || 'N/A'}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={2} className="contactItem">
                                    <Text className="label">SĐT:</Text>
                                    <Text as="span">{selectedUser?.phoneNumber || 'N/A'}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={2} className="contactItem">
                                <Text className="label">Email:</Text>
                                    <Text as="span">{selectedUser?.email || 'N/A'}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </ModalBody>
                </Skeleton>
            </ModalContent>
        </Modal>
    );
}

export default observer(UserDetailPopUp);
