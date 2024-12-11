import React, { useState } from 'react';
import { Text ,Modal, Button, FormControl, FormLabel, Input, useToast, Heading, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { router } from '@/app/router/Routes';
import agent from '../../../app/api/agent';

interface ForgotPopUpProps {
    token: string;
}

const ForgotPopUp: React.FC<ForgotPopUpProps> = ({ token }) => {
    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
    const toast = useToast();

    const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
        setErrors({});

        if (!values.newPassword) {
            setErrors(prev => ({ ...prev, newPassword: 'Vui lòng nhập mật khẩu!' }));
            return;
        }
        if (values.newPassword.length < 6) {
            setErrors(prev => ({ ...prev, newPassword: 'Mật khẩu phải có ít nhất 6 ký tự!' }));
            return;
        }
        if (!values.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Vui lòng xác nhận mật khẩu!' }));
            return;
        }
        if (values.newPassword !== values.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp!' }));
            return;
        }

        setLoading(true);
        try {
            await agent.Account.confirmForgotPassword({
                token,
                newPassword: values.newPassword,
            });
            toast({
                title: 'Mật khẩu đã được đặt lại thành công!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setFormData({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast({
                title: error?.response?.data?.message || 'Có lỗi xảy ra!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
            router.navigate('/');
        }
    };

    return (
        <Modal isOpen={true} onClose={() => { }} isCentered>
            <ModalContent>
                <ModalHeader>
                    <Heading as="h4" size="md">Đặt lại mật khẩu</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mt={4} isInvalid={!!errors.newPassword}>
                        <FormLabel htmlFor="newPassword">Mật khẩu mới</FormLabel>
                        <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder="Nhập mật khẩu mới"
                        />
                        {errors.newPassword && <Text color="red.500" mt={2}>{errors.newPassword}</Text>}
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!errors.confirmPassword}>
                        <FormLabel htmlFor="confirmPassword">Xác nhận mật khẩu mới</FormLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                        {errors.confirmPassword && <Text color="red.500" mt={2}>{errors.confirmPassword}</Text>}
                    </FormControl>

                    <Button
                        colorScheme="teal"
                        width="full"
                        mt={4}
                        isLoading={loading}
                        onClick={() => handleSubmit(formData)}
                    >
                        Đặt lại mật khẩu
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ForgotPopUp;
