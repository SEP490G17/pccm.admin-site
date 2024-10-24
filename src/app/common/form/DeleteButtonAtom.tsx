import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  InputProps,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface DeleteProps extends InputProps {
  header?: string;
  name: string;
  onDelete: () => Promise<void>;
  loading: boolean;
}

const DeleteButtonAtom: React.FC<DeleteProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <IconButton
        icon={<FaTrash />}
        aria-label="Delete"
        colorScheme="red"
        size="sm"
        onClick={onOpen}
      />

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.header}
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc muốn xóa {props.name} không? Bạn không thể hoàn tác hành động này sau đó.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Hủy
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await props
                    .onDelete()
                    .then(() => toast.success(`${props.header} thành công`))
                    .catch(() => toast.error(`${props.header} thất bại`));
                  onClose();
                }}
                isLoading={props.loading}
                ml={3}
              >
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteButtonAtom;
