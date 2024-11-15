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
} from '@chakra-ui/react';
import { MdEmail, MdPhone, MdHome } from 'react-icons/md';
import { UserManager } from '@/app/models/user.model';
import './style/UserDetailPopUp.scss';

interface UserDetailPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserManager | null; // đảm bảo user có thể là null
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

function UserDetailPopUp({ isOpen, onClose, user }: UserDetailPopUpProps) {
    if (!user) return null; // nếu không có user, không hiển thị modal

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent className="modalContent">
                <ModalHeader className="header">
                    {user.fullName}
                    <Text as="span" ml={2} className="status">
                        {renderStatus(user.lockoutEnable ? 'Không hoạt động' : 'Hoạt động')}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex className="avatarSection2">
                        {/* Sử dụng fallback image nếu không có imageUrl */}
                        <Avatar
                            size="2xl"
                            src={user.imageUrl || '/path/to/default/avatar.jpg'} // Fallback image 
                            name={user.fullName}
                            className="avatar"
                        />
                        <Flex direction="column" className="infoSection">
                            <Text className="label">Citizen Identification</Text>
                            <Text>{user.citizenIdentification || 'N/A'}</Text>
                        </Flex>
                    </Flex>

                    <Flex direction="column" className="contactSection">
                        <Flex align="center" className="contactItem">
                            <MdPhone />
                            <Text as="span">{user.phoneNumber || 'N/A'}</Text>
                        </Flex>
                        <Flex align="center" className="contactItem">
                            <MdEmail />
                            <Text as="span">{user.email || 'N/A'}</Text>
                        </Flex>
                        <Flex align="center" className="contactItem">
                            <MdHome />
                            {/* Uncomment this if address is available */}
                            {/* <Text as="span">{user.address || 'N/A'}</Text> */}
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default UserDetailPopUp;
