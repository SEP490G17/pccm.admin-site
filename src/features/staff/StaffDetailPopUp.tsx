import {
    Flex,
    Avatar,
    Text,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Skeleton,
} from '@chakra-ui/react';
import './style/StaffDetailPopUp.scss';
import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react-lite';

interface StaffDetailPopUpProps {
    isOpen: boolean;
    onClose: () => void;
}

// const renderStatus = (status: string) => {
//     let color = '';
//     switch (status) {
//         case 'Hoạt động':
//             color = 'var(--primary-color-600)';
//             break;
//         case 'Không hoạt động':
//             color = 'red';
//             break;
//         case 'Tạm thời khóa':
//             color = 'gray';
//             break;
//         default:
//             color = 'black';
//     }
//     return <Box color={color}>{status}</Box>;
// };

function StaffDetailPopUp({ isOpen, onClose }: StaffDetailPopUpProps) {
    const { staffStore } = useStore();
    const { selectedStaff } = staffStore;
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent className="modalContent" maxW="45%">
                <Skeleton isLoaded={!staffStore.loading}>
                    <ModalHeader className="header">
                        <Flex justifyContent="space-between" width="100%">
                            {/* <Box />
                            <Text as="span" ml={2} className="status">
                                {renderStatus(selectedStaff?.roles.includes('Active') ? 'Hoạt động' : 'Không hoạt động')}
                            </Text> */}
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex className="avatarSection" gap="20px">
                            <Flex direction="column">
                                <Avatar size="2xl" name={selectedStaff?.fullName} className="avatar" />
                            </Flex>

                            <Flex direction="column" w="60%" pl={2}>
                                <Flex justify="space-between" mb={2}>
                                    <Text className="label">Họ và tên:</Text>
                                    <Text>{selectedStaff?.fullName}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={2}>
                                    <Text className="label">Cụm sân làm việc:</Text>
                                    <Text>{selectedStaff?.courtCluster.join(', ') || 'N/A'}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={2} className="contactItem">
                                    <Text className="label">Chức vụ:</Text>
                                    <Text as="span">{selectedStaff?.position || 'N/A'}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={2}>
                                    <Text className="label">Quyền Hạn:</Text>
                                    <Flex gap={2} className='role'>
                                        {selectedStaff?.roles.map((role) => (
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
                                <Flex justify="space-between" mb={2} className="contactItem">
                                    {/* <MdPhone height={15} width={15}/> */}
                                    <Text className="label">SĐT:</Text>
                                    <Text as="span">{selectedStaff?.phoneNumber || 'N/A'}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={2} className="contactItem">
                                    {/* <MdEmail height={15} width={15}/> */}
                                    <Text className="label">Email:</Text>
                                    <Text as="span">{selectedStaff?.email || 'N/A'}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </ModalBody>
                </Skeleton>
            </ModalContent>
        </Modal>
    );
}

export default observer(StaffDetailPopUp);
