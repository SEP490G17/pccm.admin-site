import { useStore } from "@/app/stores/store";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, IconButton, InputProps, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface DeleteProps extends InputProps {
    header?: string,
    propId: number
}

const DeleteButtonAtom: React.FC<DeleteProps> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);
    const { newsStore } = useStore();
    const { deleteNews, loading } = newsStore;
    return (
        <>
            <IconButton
                icon={<FaTrash />}
                aria-label="Delete"
                colorScheme="red"
                size="sm"
                onClick={onOpen}
            />

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {props.header}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Hủy
                            </Button>
                            <Button colorScheme='red'
                                onClick={async () => {
                                    try {
                                        await deleteNews(props.propId).then(
                                            () => {
                                                onClose()
                                                toast.success("Xóa thành công")
                                            }
                                        );
                                    } catch (error) {
                                        console.error("Error deleting news:", error);
                                        toast.error("Xóa thất bại")
                                    }
                                }}
                                isLoading={loading}
                                ml={3}>
                                Xóa
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteButtonAtom