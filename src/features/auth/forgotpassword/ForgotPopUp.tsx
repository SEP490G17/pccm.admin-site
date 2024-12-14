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

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Clear error as soon as the user starts typing
        if (id === 'newPassword') {
            setErrors(prev => ({ ...prev, newPassword: undefined }));
            validatePassword(value);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({ ...formData, confirmPassword: value });

        // Clear error as soon as the user starts typing
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
        validateConfirmPassword(value);
    };

    const validatePassword = (password: string) => {
        const newErrors: { newPassword?: string } = {};

        if (password.length < 8) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự!';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất một chữ hoa!';
        } else if (!/[a-z]/.test(password)) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất một chữ thường!';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất một ký tự đặc biệt!';
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
    };

    const validateConfirmPassword = (confirmPassword: string) => {
        // Check if confirm password matches new password
        if (confirmPassword !== formData.newPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp!' }));
        } else {
            // Clear error if passwords match
            setErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
    };

    const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
        setErrors({});

        if (!values.newPassword || errors.newPassword) {
            return;
        }

        if (!values.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Vui lòng xác nhận mật khẩu!' }));
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
            router.navigate('/login');
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
                            onChange={handlePasswordChange}
                            onBlur={(e) => validatePassword(e.target.value)}
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
                            onChange={handleConfirmPasswordChange}
                            onBlur={(e) => validateConfirmPassword(e.target.value)}
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
