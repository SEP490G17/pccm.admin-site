import {
  Button,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdPriceChange } from 'react-icons/md';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react';
import { CourtCombo } from '@/app/models/court.model';
import CourtComboListTable from '../components/CourtComboListTableComponent';
import { AiOutlineCalendar } from 'react-icons/ai';
import { useStore } from '@/app/stores/store';

interface ICourtComboProps {
  courtCombos: CourtCombo[];
  courtId: number;
}
interface CourtComboFormik {
  courtCombos: CourtCombo[];
}
const CourtComboPopup = observer(({ courtCombos, courtId }: ICourtComboProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const CourtComboSchema = Yup.object().shape({
    courtCombos: Yup.array().of(
      Yup.object().shape({
        displayName: Yup.string().required('Tên hiển thị không được bỏ trống'),
        duration: Yup.number()
          .typeError('Thời lượng phải là 1 số')
          .required('Thời lượng không được bỏ trống')
          .positive('Thời lượng phải ít nhất là 1 tháng'),
        totalPrice: Yup.number()
          .typeError('Giá phải là một số')
          .required('Giá không được để trống')
          .positive('Giá phải lớn hơn 0'),
      }),
    ),
  });

  const { courtManagerStore } = useStore();
  const { updateCourtCombos } = courtManagerStore;
  const toast = useToast(); // Add your own toast hook
  const handleSave = async (courtCombos: CourtCombo[]) => {
    await updateCourtCombos(courtId, courtCombos, toast);
  };
  return (
    <>
      <Tooltip label="Quản lý gói dài hạn" hasArrow placeSelf={'auto'}>
        <IconButton
          colorScheme="blue"
          icon={<AiOutlineCalendar className="text-xl" />}
          aria-label="Quản lý giá lẻ"
          size={'sm'}
          onClick={onOpen}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
        <ModalOverlay />
        <Formik
          initialValues={{ courtCombos }}
          onSubmit={async (values) => {
            console.log('Submitted Values:', values);
            await handleSave(values.courtCombos);
            onClose();
          }}
          validationSchema={CourtComboSchema}
        >
          {(props: FormikProps<CourtComboFormik>) => (
            <Form >
              <ModalContent>
                <ModalHeader>
                  <Heading size={'lg'}>Bảng giá combo</Heading>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody style={{ zIndex: 10 }}>
                  <CourtComboListTable formikProps={props} />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="red" className="w-24" mr={3} onClick={onClose}>
                    Thoát
                  </Button>
                  <Button
                    colorScheme="teal"
                    className="w-24"
                    type="submit"
                    isDisabled={!props.dirty || props.isSubmitting}
                  >
                    Lưu
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
});

export default CourtComboPopup;
