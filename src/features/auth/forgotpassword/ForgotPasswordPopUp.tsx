import React, { useState } from 'react';
import { Modal, Button, FormControl, FormLabel, Input, Text, useToast, Icon, ModalContent, ModalHeader, ModalCloseButton , ModalBody } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store'; // Đảm bảo rằng store có thể truy cập

interface ForgotPasswordPopUpProps {
    visible: boolean;
    onClose: () => void;
}

const ForgotPasswordPopUp: React.FC<ForgotPasswordPopUpProps> = ({ visible, onClose }) => {
    const [formData, setFormData] = useState({ email: '' });
    const { accountStore } = useStore(); // Dùng store để truy cập accountStore
    const { loadingForgotPassword } = accountStore; // Lấy trạng thái loading từ store
    const [error, setError] = useState<any>(null);
    const toast = useToast();

    const onFinish = (values: { email: string }) => {
        accountStore.forgotPassword(values.email)
            .then((value) => {
                if (value.err) {
                    setError(value.err.response.data);
                    toast({
                        title: 'Error',
                        description: value.err.response.data,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });             
                }
                if (value.res) {
                    setError(null);
                    setFormData({ email: '' });
                    toast({
                        title: 'Success',
                        description: 'Đã gửi liên kết đặt lại mật khẩu vào email của bạn.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose();
                }
            })
            .catch(() => {
                toast({
                    title: 'Error',
                    description: 'Đã có lỗi',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    return (
        <Modal isOpen={visible} onClose={() => { onClose(); setError(null); }} isCentered>
            <ModalContent>
                <ModalHeader>Quên mật khẩu</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div style={{ textAlign: 'center' }}>
                        <Icon as={LockIcon} boxSize={12} color="#115363" />
                    </div>
                    <Text mt={4}>Nhập email của bạn để nhận mã xác nhận:</Text>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ email: e.target.value })}
                            placeholder="Nhập email của bạn"
                        />
                    </FormControl>
                    {error && <Text color="red.500" mt={2}>{error}</Text>}
                    <Button
                        colorScheme="teal"
                        width="full"
                        mt={4}
                        isLoading={loadingForgotPassword}
                        onClick={() => onFinish({ email: formData.email })}
                    >
                        Gửi mã xác nhận
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default observer(ForgotPasswordPopUp);
