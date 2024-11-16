import {
    Flex,
    Avatar,
    Text,
    Box,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@chakra-ui/react';
import { MdPhone, MdWork, MdHome } from 'react-icons/md';
import { Staff } from '@/app/models/staff.model';
import './style/StaffDetailPopUp.scss';

interface StaffDetailPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    staff: Staff;
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

function StaffDetailPopUp({ isOpen, onClose, staff }: StaffDetailPopUpProps) {
    if (!staff) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent className="modalContent" maxW="45%">
                <ModalHeader className="header">
                    {staff.fullName}
                    <Text as="span" ml={2} className="status">
                        {renderStatus(staff.roles.includes('Active') ? 'Hoạt động' : 'Không hoạt động')}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex className="avatarSection" gap="20px">
                        <Flex direction="column">
                            <Avatar size="2xl" name={staff.fullName} className="avatar" />
                        </Flex>

                        <Flex direction="column" w="60%" pl={2}>
                            <Flex justify="space-between" mb={2}>
                                <Text className="label">Cụm sân:</Text>
                                <Text>{staff.courtCluster.join(', ') || 'N/A'}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={2}>
                                <Text className="label">CCCD:</Text>
                                <Text>{staff.cccd || 'N/A'}</Text>
                            </Flex>
                            <Flex justify="space-between" mb={2}>
                                <Text className="label">Quyền Hạn:</Text>
                                <Flex gap={2} className='role'>
                                    {staff.roles.map((role) => (
                                        <Badge
                                            bg={'var(--secondary-color-600)'}
                                            p={1}
                                            borderRadius={'md'}
                                            color={'white'}
                                            key={role}
                                        >
                                            {role}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Flex>
                            <Flex justify="space-between" mb={2}>
                                <Text className="label">Ca làm:</Text>
                                <Text>{staff.shift}</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex direction="column" className="contactSection">
                        <Flex align="center" className="contactItem">
                            <MdPhone />
                            <Text as="span">{staff.phoneNumber || 'N/A'}</Text>
                        </Flex>
                        <Flex align="center" className="contactItem">
                            <MdWork />
                            <Text as="span">{staff.position || 'N/A'}</Text>
                        </Flex>
                        <Flex align="center" className="contactItem">
                            <MdHome />
                            <Text as="span">{staff.courtCluster.join(', ') || 'N/A'}</Text>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default StaffDetailPopUp;
