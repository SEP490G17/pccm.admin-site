import { CourtPriceResponse } from '@/app/models/court.model';
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
import { FC } from 'react';
import { MdPriceChange } from 'react-icons/md';
import { Form, Formik, FormikProps } from 'formik';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import CourtPriceListTable from '../components/CourtPriceListTableComponent';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
interface CourtPricePopupProps {
  courtPrices: CourtPriceResponse[];
  courtId: number;
}
interface CourtPriceFormik {
  courtPrices: CourtPriceResponse[];
}

const CourtPricePopup: FC<CourtPricePopupProps> = observer(({ courtPrices, courtId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const CourtPriceSchema = Yup.object().shape({
    courtPrices: Yup.array()
      .of(
        Yup.object().shape({
          fromTime: Yup.string().required('Thời gian bắt đầu không được để trống'),
          toTime: Yup.string()
            .required('Thời gian kết thúc không được để trống')
            .test(
              'is-greater',
              'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
              function (toTime) {
                const { fromTime } = this.parent;
                return dayjs(toTime, 'HH:mm').isAfter(dayjs(fromTime, 'HH:mm'));
              },
            ),
          price: Yup.number()
            .typeError('Giá phải là một số')
            .required('Giá không được để trống')
            .positive('Giá phải lớn hơn 0'),
        }),
      )
      .test('no-overlap', 'Khoảng thời gian phải nối tiếp nhau', function (courtPrices) {
        if (!courtPrices || courtPrices.length < 2) return true;

        for (let i = 0; i < courtPrices.length - 1; i++) {
          const currentEnd = dayjs(courtPrices[i].toTime, 'HH:mm');
          const nextStart = dayjs(courtPrices[i + 1].fromTime, 'HH:mm');

          if (!currentEnd.isSame(nextStart)) {
            return false; // Phát hiện trùng
          }
        }
        return true;
      })
      .min(1, 'Cần ít nhất một khung giờ'),
  });

  const { courtManagerStore } = useStore();
  const { updateCourtPrices } = courtManagerStore;
  const toast = useToast();
  return (
    <>
      <Tooltip label="Quản lý giá lẻ" hasArrow placeSelf={'auto'}>
        <IconButton
          colorScheme="teal"
          icon={<MdPriceChange className="text-xl" />}
          aria-label="Quản lý giá lẻ"
          size={'sm'}
          onClick={onOpen}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
        <ModalOverlay />
        <Formik
          initialValues={{ courtPrices }}
          onSubmit={async (values) => {
            console.log('Submitted Values:', values);
            await updateCourtPrices(courtId, values.courtPrices, toast);
            onClose();
          }}
          validationSchema={CourtPriceSchema}
        >
          {(props: FormikProps<CourtPriceFormik>) => (
            <Form>
              <ModalContent>
                <ModalHeader>
                  <Heading size={'lg'}>Bảng giá theo giờ của sân</Heading>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody style={{ zIndex: 10 }}>
                  <CourtPriceListTable formikProps={props} />

                  {props.errors.courtPrices && typeof props.errors.courtPrices === 'string' && (
                    <p className="text-red-500">*Lưu ý: {props.errors.courtPrices}</p>
                  )}
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

export default CourtPricePopup;
