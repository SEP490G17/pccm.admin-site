import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, IconButton, InputProps, Tooltip, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { MdLockReset } from 'react-icons/md';
import { toast } from 'react-toastify';

interface ResetPasswordProps extends InputProps {
    email?: string;
    name?: string;
    onReset: () => Promise<void>;
    loading?: boolean;
}

const ResetPasswordDialog = ({ ...props }: ResetPasswordProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);
    return (
        <>
            <Tooltip hasArrow placement='top' label="Reset mật khẩu" bg="gray.300" color="black">
                <IconButton
                    icon={<MdLockReset className="text-lg" />}
                    aria-label="Edit"
                    colorScheme="red"
                    size="sm"
                    onClick={() => onOpen()}
                />
            </Tooltip>
            <AlertDialog size={'2xl'} isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>

                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            RESET MẬT KHẨU
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Bạn có chắc muốn khôi phục mật khẩu của người dùng <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{props.name}</span> không? <br /><br />
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={async () => {
                                    await props
                                        .onReset()
                                        .then(() => toast.success(`Reset mật khẩu thành công !!\nVui lòng check mail ${props.email}`))
                                        .catch(() => toast.error(`Reset mật khẩu thất bại !!`));
                                    onClose();
                                }}
                                isLoading={props.loading}
                                ml={3}
                            >
                                Khôi phục
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ResetPasswordDialog