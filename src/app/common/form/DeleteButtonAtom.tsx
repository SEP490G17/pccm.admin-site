import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  // IconButton,
  InputProps,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import TooltipButtonAtoms from '@/features/atoms/TooltipButtonAtoms.tsx';

interface DeleteProps extends InputProps {
  header?: string;
  name?: string;
  onDelete: () => Promise<void>;
  loading?: boolean;
  buttonContent?: string;
  isIcon?: boolean;
  buttonSize?: string;
  buttonClassName?: string;
}

const DeleteButtonAtom: React.FC<DeleteProps> = ({
  buttonSize = 'sm',
  buttonClassName,
  isIcon = true,
  ...props
}: DeleteProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <TooltipButtonAtoms
        icon={isIcon && <FaTrash />}
        buttonAriaLabel={'Delete'}
        buttonColorScheme={'red'}
        buttomSize={buttonSize}
        handleOnclick={onOpen}
        className={buttonClassName}
        placement={'top'}
        bg={'red.500'}
        color={'white'}
        label={'Xóa'}
        hasArrow={true}
        buttonContent={props.buttonContent}
      />
      <AlertDialog size={'2xl'} isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered={true}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.header}
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc muốn xóa{' '}
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{props.name}</span> không?{' '}
              <br />
              <br />
              Bạn không thể hoàn tác hành động này sau đó.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Hủy
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  onClose();
                  await props.onDelete();
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
